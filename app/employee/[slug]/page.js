import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getEmployeeOverview } from "@/services/dashboard.service";
import { ROLES } from "@/constants/roles";
import { EmployeeOverviewView } from "@/components/dashboards/employee-overview-view";

export async function generateMetadata() {
  return { title: "My Performance" };
}

export default async function EmployeePage({ params }) {
  const { slug } = await params;
  const session = await getSession();

  if (!session || session.role !== ROLES.EMPLOYEE) {
    redirect("/login");
  }

  if (session.employeeId !== slug) {
    redirect(`/employee/${session.employeeId}`);
  }

  const overview = await getEmployeeOverview(session.employeeId);

  return (
    <main className="p-8">
      <EmployeeOverviewView overview={overview} />
    </main>
  );
}
