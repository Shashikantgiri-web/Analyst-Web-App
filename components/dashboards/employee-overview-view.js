import { KpiCard } from "@/components/ui/kpi-card";

/**
 * Presentational Employee dashboard body. Used by both /employee/[slug]
 * (the real employee's own data) and /test/employee (a Tester previewing
 * any employee) -- same data shape from getEmployeeOverview() either way.
 */
export function EmployeeOverviewView({ overview }) {
  const { employee, metrics } = overview;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-[22px] font-bold text-navy-dark">
          {employee?.firstName} {employee?.lastName}
        </h1>
        <p className="mt-1 text-[14px] text-gray-500">
          {employee?.departmentName} · {employee?.employeeCode} ·{" "}
          {employee?.yearsAtCompany} yrs at company
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
          Performance
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
          <KpiCard label="Work Hours/Week" value={metrics.workHoursPerWeek} />
          <KpiCard label="Projects Handled" value={metrics.projectsHandled} />
          <KpiCard label="Work-Life Balance" value={metrics.workLifeBalance} />
          <KpiCard label="Sick Days" value={metrics.sickDays} />
          <KpiCard label="Promotions" value={metrics.promotions} />
        </div>
      </section>
    </div>
  );
}
