import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

const PAGE_SIZE = 1000;

/** Fetches every row of a table/select, paging past PostgREST's default row cap. */
async function fetchAll(supabase, table, select) {
  let rows = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(select)
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    rows = rows.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return rows;
}

function average(nums) {
  const valid = nums.filter((n) => typeof n === "number" && !Number.isNaN(n));
  if (valid.length === 0) return null;
  return valid.reduce((sum, n) => sum + n, 0) / valid.length;
}

/**
 * Builds the CEO dashboard's Executive KPI cards + Department Performance
 * Ranking from real employees/employee_metrics/departments data.
 *
 * Scope note (Phase 3): no global filters applied yet -- this reads the
 * whole active workforce. Filtering by department/gender/etc. (spec
 * section 5 of 06_CEO_Dashboard.md) is planned for a later pass.
 */
export async function getCeoOverview() {
  const supabase = createAdminClient();

  const [employees, metrics, departments] = await Promise.all([
    fetchAll(
      supabase,
      "employees",
      "id, department_id, years_at_company, employee_status_id"
    ),
    fetchAll(
      supabase,
      "employee_metrics",
      `employee_id, performance_score, monthly_salary, training_hours,
       training_hours_calc, work_hours_per_week, work_hours_per_week_calc,
       promotions, emp_satisfaction_score, work_life_balance`
    ),
    fetchAll(supabase, "departments", "id, department_name, department_code"),
  ]);

  const totalEmployees = employees.length;
  const totalDepartments = departments.length;

  const avgPerformanceScore = average(metrics.map((m) => m.performance_score));
  const avgSatisfactionScore = average(
    metrics.map((m) => m.emp_satisfaction_score)
  );
  const avgMonthlySalary = average(metrics.map((m) => m.monthly_salary));
  const avgTrainingHours = average(
    metrics.map((m) => m.training_hours_calc ?? m.training_hours)
  );
  const avgWorkHoursPerWeek = average(
    metrics.map((m) => m.work_hours_per_week_calc ?? m.work_hours_per_week)
  );
  const avgExperienceYears = average(employees.map((e) => e.years_at_company));

  const promotedCount = metrics.filter((m) => (m.promotions ?? 0) > 0).length;
  const promotionRate =
    metrics.length > 0 ? (promotedCount / metrics.length) * 100 : null;

  // work_life_balance is a category label (e.g. "High"/"Medium"/"Low"),
  // not a number -- show distribution instead of a fabricated average.
  const workLifeBalanceDistribution = metrics.reduce((acc, m) => {
    const label = m.work_life_balance || "Unknown";
    acc[label] = (acc[label] ?? 0) + 1;
    return acc;
  }, {});

  // Department Performance Ranking: avg performance_score per department.
  const metricsByEmployee = new Map(metrics.map((m) => [m.employee_id, m]));
  const deptTotals = new Map(); // department_id -> { sum, count }

  for (const emp of employees) {
    const m = metricsByEmployee.get(emp.id);
    if (!m || typeof m.performance_score !== "number") continue;
    const bucket = deptTotals.get(emp.department_id) ?? { sum: 0, count: 0 };
    bucket.sum += m.performance_score;
    bucket.count += 1;
    deptTotals.set(emp.department_id, bucket);
  }

  const departmentRanking = departments
    .map((d) => {
      const bucket = deptTotals.get(d.id);
      return {
        id: d.id,
        name: d.department_name,
        avgPerformanceScore: bucket ? bucket.sum / bucket.count : null,
        employeeCount: bucket?.count ?? 0,
      };
    })
    .filter((d) => d.avgPerformanceScore !== null)
    .sort((a, b) => b.avgPerformanceScore - a.avgPerformanceScore);

  return {
    kpis: {
      totalEmployees,
      totalDepartments,
      avgPerformanceScore,
      avgSatisfactionScore,
      avgMonthlySalary,
      avgTrainingHours,
      avgWorkHoursPerWeek,
      avgExperienceYears,
      promotionRate,
    },
    workLifeBalanceDistribution,
    departmentRanking,
  };
}
