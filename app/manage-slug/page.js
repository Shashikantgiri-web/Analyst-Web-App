import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDepartmentSlug } from "@/services/department.service";
import { ROLES } from "@/constants/roles";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug} · Manager Dashboard` };
}

export default async function ManagerDepartmentPage({ params }) {
  const { slug } = await params;
  const session = await getSession();

  if (!session || session.role !== ROLES.MANAGER) {
    redirect("/login");
  }

  // Ownership check: the slug in the URL must match this manager's own
  // department. Without this, any logged-in manager could type a
  // different department's slug and view it.
  const ownSlug = await getDepartmentSlug(session.departmentId);
  if (!ownSlug || ownSlug !== slug) {
    redirect(ownSlug ? `/manage/${ownSlug}` : "/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-[30px] font-bold text-navy-dark capitalize">
        {slug} · Manager Dashboard
      </h1>
      <p className="mt-2 text-[14px] text-gray-500">
        Department-scoped dashboards land here in Phase 4.
      </p>
    </main>
  );
}
