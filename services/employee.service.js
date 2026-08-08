import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

/** A lightweight employee list for the Tester's employee-simulation picker. */
export async function listEmployeesBasic() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("employees")
    .select("id, employee_code, job_title")
    .order("employee_code")
    .limit(200);

  if (error || !data) return [];

  return data.map((e) => ({
    id: e.id,
    employeeCode: e.employee_code,
    name: e.job_title ?? e.employee_code,
  }));
}
