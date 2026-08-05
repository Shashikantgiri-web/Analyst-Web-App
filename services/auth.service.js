import "server-only";
import { createClient, createAdminClient } from "@/lib/supabase/server";

/**
 * Verifies userId + email + password using Supabase Auth, then cross-checks
 * against the employee_accounts table for the role and active status.
 */
export async function verifyCredentials({ userId, email, password }) {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData.user) {
    return { status: "not_found" };
  }

  const { data: account, error: accountError } = await adminSupabase
    .from("employee_accounts")
    .select(
      `
      id,
      employee_id,
      email,
      is_active,
      employees:employee_id ( employee_code, department_id ),
      roles:role_id ( name )
      `
    )
    .eq("auth_user_id", authData.user.id)
    .maybeSingle();

  if (accountError || !account) {
    await supabase.auth.signOut();
    return { status: "not_found" };
  }

  if (!account.is_active) {
    await supabase.auth.signOut();
    return { status: "inactive" };
  }

  if (account.employees?.employee_code !== userId) {
    await supabase.auth.signOut();
    return { status: "not_found" };
  }

  return {
    status: "ok",
    accountId: account.id,
    employeeId: account.employee_id,
    departmentId: account.employees?.department_id,
    role: account.roles?.name ?? null,
  };
}

/** Reads back the current session's account, scoped to admin client (server-only). */
export async function getAccountById(accountId) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("employee_accounts")
    .select("id, employee_id, employees:employee_id(department_id), roles:role_id ( name )")
    .eq("id", accountId)
    .maybeSingle();

  if (error || !data) return null;
  return { 
    ...data, 
    department_id: data.employees?.department_id, 
    role: data.roles?.name ?? null 
  };
}
