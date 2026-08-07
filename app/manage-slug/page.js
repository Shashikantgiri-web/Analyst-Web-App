import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDepartmentSlug } from "@/services/department.service";
import { getManagerOverview } from "@/services/dashboard.service";
import { ROLES } from "@/constants/roles";
import { KpiCard } from "@/components/ui/kpi-card";
import { DistributionBars } from "@/components/ui/distribution-bars";
import { EmployeeTable } from "@/components/ui/employee-table";

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

  const overview = await getManagerOverview(session.departmentId);
  const { department, kpis, workLifeBalanceDistribution, performanceRatingDistribution, employees } =
    overview;

  return (
    <main className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-[30px] font-bold text-navy-dark">
          {department?.name ?? slug} · Manager Dashboard
        </h1>
        <p className="mt-1 text-[14px] text-gray-500">
          Department-scoped performance overview.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
          Department KPIs
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <KpiCard label="Total Employees" value={kpis.totalEmployees} />
          <KpiCard
            label="Avg Performance Score"
            value={kpis.avgPerformanceScore}
          />
          <KpiCard
            label="Avg Monthly Salary"
            value={kpis.avgMonthlySalary}
            suffix=" ₹"
          />
          <KpiCard
            label="Avg Years at Company"
            value={kpis.avgYearsAtCompany}
            suffix=" yrs"
          />
          <KpiCard label="Avg Training Hours" value={kpis.avgTrainingHours} />
          <KpiCard
            label="Total Projects Handled"
            value={kpis.totalProjectsHandled}
          />
          <KpiCard
            label="Avg Work Hours/Week"
            value={kpis.avgWorkHoursPerWeek}
          />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
            Performance Rating Distribution
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <DistributionBars distribution={performanceRatingDistribution} />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
            Work-Life Balance
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <DistributionBars distribution={workLifeBalanceDistribution} />
          </div>
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
          Team
        </h2>
        <EmployeeTable employees={employees} />
      </section>

      <p className="text-[12px] text-gray-400">
        Department filters, salary/workload/promotion charts, and
        demographics land in a later pass.
      </p>
    </main>
  );
}
