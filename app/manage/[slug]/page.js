import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveAccountForCurrentUser } from "@/services/auth.service";
import { ROLES } from "@/constants/roles";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug} · Manager Dashboard` };
}

export default async function ManagerDepartmentPage({ params }) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const result = await resolveAccountForCurrentUser({
    userId: null,
    email: user.email,
  });

  if (result.status !== "ok" || result.role !== ROLES.MANAGER) {
    redirect("/login");
  }

  // Phase 2 will verify `slug` actually matches this manager's own
  // department (via employees.department_id) before rendering any data —
  // RLS already blocks cross-department reads at the query level.

  return (
    <main className="p-8">
      <h1 className="text-[30px] font-bold text-navy-dark capitalize">
        {slug} · Manager Dashboard
      </h1>
      <p className="mt-2 text-[14px] text-gray-500">
        Department-scoped dashboards land here in Phase 4.
      </p>
    </main>
  );
}
