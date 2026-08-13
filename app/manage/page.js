import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDepartmentSlug } from "@/services/department.service";
import { ROLES } from "@/constants/roles";

// Mirrors app/employee/page.js: the sidebar links to "/manage" (no slug)
// since it doesn't know the manager's department slug ahead of time. This
// bridges that gap using the session's departmentId.
export default async function ManageIndexPage() {
  const session = await getSession();

  if (!session || session.role !== ROLES.MANAGER) {
    redirect("/login");
  }

  const slug = await getDepartmentSlug(session.departmentId);
  redirect(slug ? `/manage/${slug}` : "/login");
}
