import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveAccountForCurrentUser } from "@/services/auth.service";
import { ROLES } from "@/constants/roles";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `${slug} · Employee Dashboard` };
}

export default async function EmployeePage({ params }) {
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

  if (result.status !== "ok" || result.role !== ROLES.EMPLOYEE) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-[30px] font-bold text-navy-dark capitalize">
        {slug} · My Performance
      </h1>
      <p className="mt-2 text-[14px] text-gray-500">
        Individual dashboards land here in Phase 4.
      </p>
    </main>
  );
}
