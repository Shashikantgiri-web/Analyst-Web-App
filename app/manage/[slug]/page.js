import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
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

  // Phase 2 will verify `slug` matches session.departmentId before
  // rendering any data.

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
