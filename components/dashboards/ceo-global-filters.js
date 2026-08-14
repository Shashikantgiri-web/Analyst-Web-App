"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Global Filters bar per 06_CEO_Dashboard.md v2 section 4 (sits between
 * Header/Breadcrumb and the KPI cards). Only the department dimension is
 * implemented in this pass -- the full filter set (gender, education
 * level, salary level, etc.) is deferred; see the note in the CEO page.
 */
export function CeoGlobalFilters({ departments, selectedDepartmentId }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("dept", value);
    } else {
      params.delete("dept");
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <label className="text-[13px] font-medium text-gray-500">
        Department
      </label>
      <select
        value={selectedDepartmentId ?? ""}
        onChange={(e) => handleChange(e.target.value)}
        className="h-9 rounded-lg border border-gray-300 bg-white px-3 text-[13px]"
      >
        <option value="">All Departments</option>
        {departments.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
    </div>
  );
}
