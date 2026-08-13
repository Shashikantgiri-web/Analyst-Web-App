import {
  Users,
  Building2,
  TrendingUp,
  Heart,
  Award,
  Wallet,
  GraduationCap,
  Clock,
  Timer,
} from "lucide-react";
import { KpiCard } from "@/components/ui/kpi-card";
import { RankingBarChart } from "@/components/charts/ranking-bar-chart";
import { DistributionDonutChart } from "@/components/charts/distribution-donut-chart";

/**
 * Presentational CEO dashboard body. Used by both /ceo (the real CEO's
 * own dashboard) and /test/ceo (a Tester simulating the CEO view) --
 * same data shape from getCeoOverview() either way.
 */
export function CeoOverviewView({ overview }) {
  const { kpis, workLifeBalanceDistribution, departmentRanking } = overview;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
          Executive KPIs
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <KpiCard icon={Users} label="Total Employees" value={kpis.totalEmployees} />
          <KpiCard icon={Building2} label="Total Departments" value={kpis.totalDepartments} />
          <KpiCard icon={TrendingUp} label="Avg Performance Score" value={kpis.avgPerformanceScore} />
          <KpiCard icon={Heart} label="Avg Satisfaction Score" value={kpis.avgSatisfactionScore} />
          <KpiCard icon={Award} label="Promotion Rate" value={kpis.promotionRate} suffix="%" />
          <KpiCard icon={Wallet} label="Avg Monthly Salary" value={kpis.avgMonthlySalary} suffix=" ₹" />
          <KpiCard icon={GraduationCap} label="Avg Training Hours" value={kpis.avgTrainingHours} />
          <KpiCard icon={Clock} label="Avg Experience" value={kpis.avgExperienceYears} suffix=" yrs" />
          <KpiCard icon={Timer} label="Avg Work Hours/Week" value={kpis.avgWorkHoursPerWeek} />
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
            Department Performance Ranking
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <RankingBarChart items={departmentRanking} valueLabel="pts" />
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
            Work-Life Balance Distribution
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <DistributionDonutChart distribution={workLifeBalanceDistribution} colorSeed={0} />
          </div>
        </section>
      </div>
    </div>
  );
}
