import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLES } from "@/constants/roles";
import { getCeoOverview } from "@/services/dashboard.service";
import { listDepartments } from "@/services/department.service";
import { CeoOverviewView } from "@/components/dashboards/ceo-overview-view";
import { CeoGlobalFilters } from "@/components/dashboards/ceo-global-filters";
import { AppShell } from "@/components/layout/app-shell";

export const metadata = { title: "CEO Dashboard" };

export default async function CeoPage({ searchParams }) {
  const search = await searchParams;
  const session = await getSession();

  if (!session || session.role !== ROLES.CEO) {
    redirect("/login");
  }

  const selectedDepartmentId = search?.dept || null;

  const [overview, departments] = await Promise.all([
    getCeoOverview(selectedDepartmentId),
    listDepartments(),
  ]);

  return (
    <AppShell
      role={ROLES.CEO}
      title="CEO Dashboard"
      subtitle="Company-wide performance overview."
    >
      <CeoGlobalFilters
        departments={departments}
        selectedDepartmentId={selectedDepartmentId}
      />
      <CeoOverviewView overview={overview} />
      <p className="text-[12px] text-gray-400">
        Only the department filter is wired up so far -- gender, education
        level, salary level, and the remaining filter dimensions from the
        spec, plus AI insights and exportable reports, land in a later
        pass.
      </p>
    </AppShell>
  );
}
