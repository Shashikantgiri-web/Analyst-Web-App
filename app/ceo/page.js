import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ROLES } from "@/constants/roles";

export const metadata = { title: "CEO Dashboard" };

export default async function CeoPage() {
  const session = await getSession();

  if (!session || session.role !== ROLES.CEO) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-[30px] font-bold text-navy-dark">CEO Dashboard</h1>
      <p className="mt-2 text-[14px] text-gray-500">
        Company-wide performance analytics land here in Phase 3 -- KPI cards,
        department ranking, and the full chart set from 06_CEO_Dashboard.md.
      </p>
    </main>
  );
}
