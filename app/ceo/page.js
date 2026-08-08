import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLES } from "@/constants/roles";
import { getCeoOverview } from "@/services/dashboard.service";
import { CeoOverviewView } from "@/components/dashboards/ceo-overview-view";

export const metadata = { title: "CEO Dashboard" };

export default async function CeoPage() {
  const session = await getSession();

  if (!session || session.role !== ROLES.CEO) {
    redirect("/login");
  }

  const overview = await getCeoOverview();

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
      <CeoOverviewView overview={overview} />
      <p className="text-[12px] text-gray-400">
        Global filters, AI insights, exportable reports, and the remaining
        chart set from the spec land in a later pass.
      </p>
    </main>
  );
}
