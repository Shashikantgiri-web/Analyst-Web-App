import {
  TrendingUp,
  Star,
  Heart,
  Smile,
  Wallet,
  GraduationCap,
  Timer,
  Briefcase,
  Scale,
  CalendarX,
  Award,
} from "lucide-react";
import { KpiCard } from "@/components/ui/kpi-card";
import { DepartmentComparisonChart } from "@/components/charts/department-comparison-chart";

/**
 * Presentational Employee dashboard body. Used by both /employee/[slug]
 * (the real employee's own data) and /test/employee (a Tester previewing
 * any employee) -- same data shape from getEmployeeOverview() either way.
 *
 * Note: the employees table has no first/last name columns -- employeeCode
 * and jobTitle are the real identifying fields available.
 */
export function EmployeeOverviewView({ overview }) {
  const { employee, metrics, departmentComparison } = overview;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-[18px] font-semibold text-navy-dark">
          {employee?.jobTitle ?? "Employee"} · {employee?.employeeCode}
        </h2>
        <p className="mt-1 text-[13px] text-gray-500">
          {employee?.departmentName} · {employee?.yearsAtCompany} yrs at
          company
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
          Performance
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <KpiCard icon={TrendingUp} label="Performance Score" value={metrics.performanceScore} />
          <KpiCard icon={Star} label="Rating" value={metrics.performanceRating} />
          <KpiCard icon={Heart} label="Satisfaction Score" value={metrics.satisfactionScore} />
          <KpiCard icon={Smile} label="Satisfaction" value={metrics.satisfactionRating} />
          <KpiCard icon={Wallet} label="Monthly Salary" value={metrics.monthlySalary} suffix=" ₹" />
          <KpiCard icon={GraduationCap} label="Training Hours" value={metrics.trainingHours} />
          <KpiCard icon={Timer} label="Work Hours/Week" value={metrics.workHoursPerWeek} />
          <KpiCard icon={Briefcase} label="Projects Handled" value={metrics.projectsHandled} />
          <KpiCard icon={Scale} label="Work-Life Balance" value={metrics.workLifeBalance} />
          <KpiCard icon={CalendarX} label="Sick Days" value={metrics.sickDays} />
          <KpiCard icon={Award} label="Promotions" value={metrics.promotions} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-[18px] font-semibold text-navy-dark">
          You vs. Your Department Average
        </h2>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <DepartmentComparisonChart comparison={departmentComparison} />
        </div>
      </section>
    </div>
  );
}
