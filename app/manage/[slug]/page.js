import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getDepartmentSlug } from "@/services/department.service";
import { getManagerOverview } from "@/services/dashboard.service";
import { ROLES } from "@/constants/roles";
import { ManagerOverviewView } from "@/components/dashboards/manager-overview-view";
import { AppShell } from "@/components/layout/app-shell";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug} · Manager Dashboard` };
}

export default async function ManagerDepartmentPage({ params }) {
  const { slug } = await params;
  const session = await getSession();

  if (!session || session.role !== ROLES.MANAGER) {
    redirect("/login");
  }

  const ownSlug = await getDepartmentSlug(session.departmentId);
  if (!ownSlug || ownSlug !== slug) {
    redirect(ownSlug ? `/manage/${ownSlug}` : "/login");
  }

  const overview = await getManagerOverview(session.departmentId);

  return (
    <AppShell
      role={ROLES.MANAGER}
      title={`${overview.department?.name ?? slug} · Manager Dashboard`}
      subtitle="Department-scoped performance overview."
    >
      <ManagerOverviewView overview={overview} />
      <p className="text-[12px] text-gray-400">
        Department filters, salary/workload/promotion charts, and
        demographics land in a later pass.
      </p>
    </AppShell>
  );
}
