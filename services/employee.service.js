import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

/** A lightweight employee list for the Tester's employee-simulation picker. */
export async function listEmployeesBasic() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("employees")
    .select("id, employee_code, first_name, last_name")
    .order("employee_code")
    .limit(200);

  if (error || !data) return [];

  return data.map((e) => ({
    id: e.id,
    employeeCode: e.employee_code,
    name: `${e.first_name} ${e.last_name}`,
  }));
}
