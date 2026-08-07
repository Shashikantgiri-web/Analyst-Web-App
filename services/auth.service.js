import "server-only";
import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * Verifies userId + email + password against employee_accounts directly.
 * This bypasses RLS by design (RLS is keyed on auth.uid(), which doesn't
 * exist here since we're not using Supabase Auth) -- the service-role
 * client is the ONLY place password_hash is ever read or compared. No
 * other server code should import createAdminClient for anything except
 * this login check.
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

  if (String(account.employees?.employee_code) !== String(userId)) {
    return { status: "not_found" };
  }

  const passwordMatches = await bcrypt.compare(password, account.password_hash);
  if (!passwordMatches) {
    return { status: "not_found" }; // deliberately generic -- never reveal which field was wrong
  }

  return {
    status: "ok",
    accountId: account.id,
    employeeId: account.employee_id,
    departmentId: account.department_id,
    role: account.roles?.name ?? null,
  };
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
