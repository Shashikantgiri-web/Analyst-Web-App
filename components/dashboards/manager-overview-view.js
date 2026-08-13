import {
  Users,
  TrendingUp,
  Wallet,
  Clock,
  GraduationCap,
  Briefcase,
  Timer,
} from "lucide-react";
import { KpiCard } from "@/components/ui/kpi-card";
import { DistributionDonutChart } from "@/components/charts/distribution-donut-chart";
import { EmployeeTable } from "@/components/ui/employee-table";

/**
 * Presentational Manager dashboard body. Used by both /manage/[slug] (the
 * real manager's own department) and /test/manager (a Tester previewing
 * any department) -- same data shape from getManagerOverview() either way.
 *
 * Performance Rating Distribution and Work-Life Balance are independently
 * queried (see database/schema/004_dedupe_metrics_fix_fanout.sql) and
 * rendered with different colorSeed values here, so they can never again
 * silently look like duplicates of each other even if two categories
 * happen to share a count.
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
          <KpiCard icon={Users} label="Total Employees" value={kpis.totalEmployees} />
          <KpiCard icon={TrendingUp} label="Avg Performance Score" value={kpis.avgPerformanceScore} />
          <KpiCard icon={Wallet} label="Avg Monthly Salary" value={kpis.avgMonthlySalary} suffix=" ₹" />
          <KpiCard icon={Clock} label="Avg Years at Company" value={kpis.avgYearsAtCompany} suffix=" yrs" />
          <KpiCard icon={GraduationCap} label="Avg Training Hours" value={kpis.avgTrainingHours} />
          <KpiCard icon={Briefcase} label="Total Projects Handled" value={kpis.totalProjectsHandled} />
          <KpiCard icon={Timer} label="Avg Work Hours/Week" value={kpis.avgWorkHoursPerWeek} />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
            Performance Rating Distribution
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <DistributionDonutChart
              distribution={performanceRatingDistribution}
              colorSeed={0}
            />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
            Work-Life Balance
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <DistributionDonutChart
              distribution={workLifeBalanceDistribution}
              colorSeed={3}
            />
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
