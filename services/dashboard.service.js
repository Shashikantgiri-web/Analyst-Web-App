import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * CEO dashboard overview -- KPIs + department ranking + work-life balance
 * distribution, computed inside Postgres via the ceo_dashboard_overview()
 * SQL function (see database/schema/ceo_dashboard_overview.sql) instead of
 * pulling every employees/employee_metrics row over the network and
 * aggregating in JS. Cached for 5 minutes since this doesn't need to be
 * second-by-second live.
 */
const getCachedCeoOverview = unstable_cache(
  async () => {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("ceo_dashboard_overview");

    if (error) throw error;
    return data;
  },
  ["ceo-dashboard-overview"],
  { revalidate: 300 } // 5 minutes
);

export async function getCeoOverview() {
  const data = await getCachedCeoOverview();

  return {
    kpis: {
      totalEmployees: data.totalEmployees,
      totalDepartments: data.totalDepartments,
      avgPerformanceScore: data.avgPerformanceScore,
      avgSatisfactionScore: data.avgSatisfactionScore,
      avgMonthlySalary: data.avgMonthlySalary,
      avgTrainingHours: data.avgTrainingHours,
      avgWorkHoursPerWeek: data.avgWorkHoursPerWeek,
      avgExperienceYears: data.avgExperienceYears,
      promotionRate: data.promotionRate,
    },
    workLifeBalanceDistribution: data.workLifeBalanceDistribution ?? {},
    departmentRanking: data.departmentRanking ?? [],
  };
}
