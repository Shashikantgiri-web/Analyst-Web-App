import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLES } from "@/constants/roles";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug} · Employee Dashboard` };
}

export default async function EmployeePage({ params }) {
  const { slug } = await params;
  const session = await getSession();

  if (!session || session.role !== ROLES.EMPLOYEE) {
    redirect("/login");
  }

  // Ownership check: an employee can only view their own dashboard --
  // the slug must match their own employeeId from the session.
  if (session.employeeId !== slug) {
    redirect(`/employee/${session.employeeId}`);
  }

  return (
    <main className="p-8">
      <h1 className="text-[30px] font-bold text-navy-dark capitalize">
        My Performance
      </h1>
      <p className="mt-2 text-[14px] text-gray-500">
        Individual dashboards land here in Phase 4.
      </p>
    </main>
  );
}
