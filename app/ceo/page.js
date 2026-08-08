import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLES } from "@/constants/roles";
import { getCeoOverview } from "@/services/dashboard.service";
import { CeoOverviewView } from "@/components/dashboards/ceo-overview-view";
import { DashboardTopBar } from "@/components/layout/dashboard-top-bar";

export const metadata = { title: "CEO Dashboard" };

export default async function CeoPage() {
  const session = await getSession();

  if (!session || session.role !== ROLES.CEO) {
    redirect("/login");
  }

  const overview = await getCeoOverview();

  return (
    <main className="p-8 flex flex-col gap-8">
      <DashboardTopBar
        title="CEO Dashboard"
        subtitle="Company-wide performance overview."
      />
      <CeoOverviewView overview={overview} />
      <p className="text-[12px] text-gray-400">
        Global filters, AI insights, exportable reports, and the remaining
        chart set from the spec land in a later pass.
      </p>
    </main>
  );
}
