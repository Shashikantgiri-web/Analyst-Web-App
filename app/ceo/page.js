import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveAccountForCurrentUser } from "@/services/auth.service";
import { ROLES } from "@/constants/roles";

export const metadata = { title: "CEO Dashboard" };

export default async function CeoPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const result = await resolveAccountForCurrentUser({
    userId: null,
    email: user.email,
  });

  // Guard: only CEO (and Tester in CEO-simulation mode, routed via /test/ceo)
  // may render this page. Anyone else is bounced back to login.
  if (result.status !== "ok" || result.role !== ROLES.CEO) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-[30px] font-bold text-navy-dark">CEO Dashboard</h1>
      <p className="mt-2 text-[14px] text-gray-500">
        Company-wide performance analytics land here in Phase 3 — KPI cards,
        department ranking, and the full chart set from 06_CEO_Dashboard.md.
      </p>
    </main>
  );
}
