import { KpiCard } from "@/components/ui/kpi-card";
import { DistributionBars } from "@/components/ui/distribution-bars";
import { EmployeeTable } from "@/components/ui/employee-table";

/**
 * Presentational Manager dashboard body. Used by both /manage/[slug] (the
 * real manager's own department) and /test/manager (a Tester previewing
 * any department) -- same data shape from getManagerOverview() either way.
 */
export function ManagerOverviewView({ overview }) {
  const {
    kpis,
    workLifeBalanceDistribution,
    performanceRatingDistribution,
    employees,
  } = overview;

  return (
    <div className="flex flex-col gap-8">
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
    </div>
  );
}
