import "server-only";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/server";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

/**
 * Verifies userId + email + password against employee_accounts, with
 * basic brute-force lockout: 5 consecutive failed attempts locks the
 * account for 15 minutes. A successful login resets the counter.
 *
 * Uses the service-role client since there's no Supabase Auth session to
 * scope RLS to (see lib/session.js -- this app issues its own JWT cookie).
 */
export async function verifyCredentials({ userId, email, password }) {
  const supabase = createAdminClient();

  const { data: account, error } = await supabase
    .from("employee_accounts")
    .select(
      `
      id,
      employee_id,
      department_id,
      email,
      password_hash,
      is_active,
      failed_login_attempts,
      locked_until,
      employees:employee_id ( employee_code ),
      roles:role_id ( name )
      `
    )
    .eq("email", email)
    .maybeSingle();

  if (error || !account) {
    return { status: "not_found" };
  }

  if (!account.is_active) {
    return { status: "inactive" };
  }

  if (account.locked_until && new Date(account.locked_until) > new Date()) {
    return { status: "locked", lockedUntil: account.locked_until };
  }

  if (String(account.employees?.employee_code) !== String(userId)) {
    await registerFailedAttempt(supabase, account);
    return { status: "not_found" };
  }

  const passwordMatches = await bcrypt.compare(password, account.password_hash);
  if (!passwordMatches) {
    await registerFailedAttempt(supabase, account);
    return { status: "not_found" }; // deliberately generic
  }

  // Success -- reset the failed-attempt counter and record last_login.
  await supabase
    .from("employee_accounts")
    .update({
      failed_login_attempts: 0,
      locked_until: null,
      last_login: new Date().toISOString(),
    })
    .eq("id", account.id);

  return {
    status: "ok",
    accountId: account.id,
    employeeId: account.employee_id,
    departmentId: account.department_id,
    role: account.roles?.name ?? null,
  };
}

async function registerFailedAttempt(supabase, account) {
  const attempts = (account.failed_login_attempts ?? 0) + 1;
  const update = { failed_login_attempts: attempts };

  if (attempts >= MAX_FAILED_ATTEMPTS) {
    const lockUntil = new Date();
    lockUntil.setMinutes(lockUntil.getMinutes() + LOCKOUT_MINUTES);
    update.locked_until = lockUntil.toISOString();
  }

  await supabase.from("employee_accounts").update(update).eq("id", account.id);
}

/** Reads back the current session's account, scoped to admin client (server-only). */
export async function getAccountById(accountId) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("employee_accounts")
    .select("id, employee_id, department_id, roles:role_id ( name )")
    .eq("id", accountId)
    .maybeSingle();

  if (error || !data) return null;
  return { ...data, role: data.roles?.name ?? null };
}
