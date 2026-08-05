import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * Resolves the signed-in Supabase Auth user to an application role by
 * reading the employee_accounts ("access") table, per App_detail.md:
 *   1. Look up the account by employee_code (userId) + email.
 *   2. Confirm the role (CEO / Manager / Employee / Tester).
 *   3. If no matching, active account exists, the caller is unauthorized.
 *
 * RLS on employee_accounts restricts each row to its own auth_user_id,
 * so this can only ever resolve the caller's own account — it cannot be
 * used to probe other users' roles.
 */
export async function resolveAccountForCurrentUser({ userId, email }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { status: "unauthorized", reason: "No active session." };
  }

  const { data: account, error } = await supabase
    .from("employee_accounts")
    .select(
      `
      id,
      employee_id,
      username,
      email,
      is_active,
      employees:employee_id ( employee_code ),
      roles:role_id ( name )
      `
    )
    .eq("auth_user_id", user.id)
    .eq("email", email)
    .single();

  if (error || !account) {
    return { status: "not_found", reason: "User not found/Unauthorized." };
  }

  if (!account.is_active) {
    return { status: "inactive", reason: "Account is disabled." };
  }

  if (account.employees?.employee_code !== userId) {
    return { status: "not_found", reason: "User not found/Unauthorized." };
  }

  return {
    status: "ok",
    role: account.roles?.name ?? null,
    employeeId: account.employee_id,
    accountId: account.id,
  };
}
