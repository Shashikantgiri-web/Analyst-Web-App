import "server-only";
import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * CEO dashboard overview -- KPIs + department ranking + work-life balance
 * distribution, computed inside Postgres via ceo_dashboard_overview().
 * Cached 5 min per filter value since this doesn't need to be
 * second-by-second live. Pass departmentId to scope to one department
 * (Global Filters, 06_CEO_Dashboard.md v2) -- omit for company-wide.
 */
export async function getCeoOverview(departmentId = null) {
  const getCached = unstable_cache(
    async () => {
      const supabase = createAdminClient();
      const { data, error } = await supabase.rpc("ceo_dashboard_overview", {
        filter_department_id: departmentId,
      });
      if (error) throw error;
      return data;
    },
    ["ceo-dashboard-overview", departmentId ?? "all"],
    { revalidate: 300 }
  );

  const data = await getCached();
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

/**
 * Manager dashboard overview, scoped to one department via
 * manager_department_overview(). Cached per-department for 5 min.
 */
export async function getManagerOverview(departmentId) {
  const getCached = unstable_cache(
    async () => {
      const supabase = createAdminClient();
      const { data, error } = await supabase.rpc(
        "manager_department_overview",
        { dept_id: departmentId }
      );
      if (error) throw error;
      return data;
    },
    ["manager-dashboard-overview", departmentId],
    { revalidate: 300 }
  );

  return getCached();
}

/**
 * Employee's own dashboard overview, via employee_own_overview(). Cached
 * per-employee for 5 min.
 */
export async function getEmployeeOverview(employeeId) {
  const getCached = unstable_cache(
    async () => {
      const supabase = createAdminClient();
      const { data, error } = await supabase.rpc("employee_own_overview", {
        emp_id: employeeId,
      });
      if (error) throw error;
      return data;
    },
    ["employee-dashboard-overview", employeeId],
    { revalidate: 300 }
  );

  return getCached();
}
