import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { resolveAccountForCurrentUser } from "@/services/auth.service";
import { ROLES } from "@/constants/roles";

const VALID_TEST_ROLES = ["ceo", "manager", "employee"];

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `Test: ${slug}` };
}

export default async function TestRolePage({ params }) {
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

  if (result.status !== "ok" || result.role !== ROLES.TESTER) {
    redirect("/login");
  }

  if (!VALID_TEST_ROLES.includes(slug)) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-[30px] font-bold text-navy-dark capitalize">
        Simulating: {slug}
      </h1>
      <p className="mt-2 text-[14px] text-gray-500">
        Testers get read access to all three dashboard tiers for QA — the
        actual {slug} view renders here once Phases 3–4 are built.
      </p>
    </main>
  );
}
