import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLES } from "@/constants/roles";

// ROLE_HOME_ROUTE sends Employees to "/employee" (no slug) right after
// login, since the login form doesn't know their employeeId until the
// session exists. This page bridges that gap: it reads the just-created
// session and forwards straight to the employee's own scoped dashboard.
export default async function EmployeeIndexPage() {
  const session = await getSession();

  if (!session || session.role !== ROLES.EMPLOYEE) {
    redirect("/login");
  }

  redirect(`/employee/${session.employeeId}`);
}
