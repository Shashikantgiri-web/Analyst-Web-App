import "server-only";
import { createAdminClient } from "@/lib/supabase/server";

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Resolves a department_id to the slug used in /manage/[slug] routes. */
export async function getDepartmentSlug(departmentId) {
  if (!departmentId) return null;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("departments")
    .select("department_code, department_name")
    .eq("id", departmentId)
    .maybeSingle();

  if (error || !data) return null;

  return data.department_code
    ? slugify(data.department_code)
    : slugify(data.department_name);
}

/** Resolves a /manage/[slug] value back to a department_id, for the guard check. */
export async function getDepartmentIdForSlug(slug) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("departments")
    .select("id, department_code, department_name");

  if (error || !data) return null;

  const match = data.find(
    (d) =>
      (d.department_code && slugify(d.department_code) === slug) ||
      slugify(d.department_name) === slug
  );

  return match?.id ?? null;
}

/** All departments, for the Tester's manager-simulation picker. */
export async function listDepartments() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("departments")
    .select("id, department_code, department_name")
    .order("department_name");

  if (error || !data) return [];

  return data.map((d) => ({
    id: d.id,
    name: d.department_name,
    slug: d.department_code ? slugify(d.department_code) : slugify(d.department_name),
  }));
}
