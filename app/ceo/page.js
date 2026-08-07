import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLES } from "@/constants/roles";
import { getCeoOverview } from "@/services/dashboard.service";
import { KpiCard } from "@/components/ui/kpi-card";
import { RankingBarList } from "@/components/ui/ranking-bar-list";

export const metadata = { title: "CEO Dashboard" };

export default async function CeoPage() {
  const session = await getSession();

  if (!session || session.role !== ROLES.CEO) {
    redirect("/login");
  }

  const { kpis, workLifeBalanceDistribution, departmentRanking } =
    await getCeoOverview();

  return (
    <main className="p-8 flex flex-col gap-8">
      <div>
        <h1 className="text-[30px] font-bold text-navy-dark">
          CEO Dashboard
        </h1>
        <p className="mt-1 text-[14px] text-gray-500">
          Company-wide performance overview.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
          Executive KPIs
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <KpiCard label="Total Employees" value={kpis.totalEmployees} />
          <KpiCard label="Total Departments" value={kpis.totalDepartments} />
          <KpiCard
            label="Avg Performance Score"
            value={kpis.avgPerformanceScore}
          />
          <KpiCard
            label="Avg Satisfaction Score"
            value={kpis.avgSatisfactionScore}
          />
          <KpiCard
            label="Promotion Rate"
            value={kpis.promotionRate}
            suffix="%"
          />
          <KpiCard
            label="Avg Monthly Salary"
            value={kpis.avgMonthlySalary}
            suffix=" ₹"
          />
          <KpiCard
            label="Avg Training Hours"
            value={kpis.avgTrainingHours}
          />
          <KpiCard
            label="Avg Experience"
            value={kpis.avgExperienceYears}
            suffix=" yrs"
          />
          <KpiCard
            label="Avg Work Hours/Week"
            value={kpis.avgWorkHoursPerWeek}
          />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
          Department Performance Ranking
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <RankingBarList items={departmentRanking} valueLabel="pts" />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
          Work-Life Balance Distribution
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-4">
            {Object.entries(workLifeBalanceDistribution).map(
              ([label, count]) => (
                <div
                  key={label}
                  className="rounded-lg bg-gray-workspace px-4 py-2 text-[13px]"
                >
                  <span className="font-semibold text-navy-dark">
                    {label}
                  </span>
                  <span className="ml-2 text-gray-500">{count}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <p className="text-[12px] text-gray-400">
        Global filters, AI insights, exportable reports, and the remaining
        chart set from the spec land in a later pass.
      </p>
    </main>
  );
}
