import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getEmployeeOverview } from "@/services/dashboard.service";
import { ROLES } from "@/constants/roles";
import { KpiCard } from "@/components/ui/kpi-card";

export async function generateMetadata() {
  return { title: "My Performance" };
}

export default async function EmployeePage({ params }) {
  const { slug } = await params;
  const session = await getSession();

  if (!session || session.role !== ROLES.EMPLOYEE) {
    redirect("/login");
  }

  // Ownership check: an employee can only view their own dashboard.
  if (session.employeeId !== slug) {
    redirect(`/employee/${session.employeeId}`);
  }

  const { employee, metrics } = await getEmployeeOverview(session.employeeId);

  return (
    <main className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-[30px] font-bold text-navy-dark">
          {employee?.firstName} {employee?.lastName}
        </h1>
        <p className="mt-1 text-[14px] text-gray-500">
          {employee?.departmentName} · {employee?.employeeCode} ·{" "}
          {employee?.yearsAtCompany} yrs at company
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
          My Performance
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <KpiCard
            label="Performance Score"
            value={metrics.performanceScore}
          />
          <KpiCard label="Rating" value={metrics.performanceRating} />
          <KpiCard
            label="Satisfaction Score"
            value={metrics.satisfactionScore}
          />
          <KpiCard label="Satisfaction" value={metrics.satisfactionRating} />
          <KpiCard
            label="Monthly Salary"
            value={metrics.monthlySalary}
            suffix=" ₹"
          />
          <KpiCard label="Training Hours" value={metrics.trainingHours} />
          <KpiCard
            label="Work Hours/Week"
            value={metrics.workHoursPerWeek}
          />
          <KpiCard label="Projects Handled" value={metrics.projectsHandled} />
          <KpiCard label="Work-Life Balance" value={metrics.workLifeBalance} />
          <KpiCard label="Sick Days" value={metrics.sickDays} />
          <KpiCard label="Promotions" value={metrics.promotions} />
        </div>
      </section>

      <p className="text-[12px] text-gray-400">
        This shows your own data only. Note: 08_Employee_Dashboard.md in
        the spec currently duplicates the Manager dashboard doc verbatim --
        worth fixing at the source so future phases build against the
        right requirements.
      </p>
    </main>
  );
}
