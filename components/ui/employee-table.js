"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Search } from "lucide-react";

const COLUMNS = [
  { key: "employeeCode", label: "Employee Code" },
  { key: "jobTitle", label: "Job Title" },
  { key: "performanceScore", label: "Performance" },
  { key: "monthlySalary", label: "Salary" },
  { key: "yearsAtCompany", label: "Years" },
];

/**
 * Team roster table per 02_Design.md section 11: sticky header, sorting,
 * search, row hover. Pagination, bulk selection, and CSV export are
 * deferred to a later pass -- flagged rather than half-implemented.
 */
export function EmployeeTable({ employees }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("performanceScore");
  const [sortDir, setSortDir] = useState("desc");

  const filtered = useMemo(() => {
    if (!employees) return [];
    const q = search.trim().toLowerCase();
    const rows = q
      ? employees.filter(
          (e) =>
            e.employeeCode?.toLowerCase().includes(q) ||
            e.jobTitle?.toLowerCase().includes(q)
        )
      : employees;

    return [...rows].sort((a, b) => {
      const av = a[sortKey] ?? -Infinity;
      const bv = b[sortKey] ?? -Infinity;
      if (typeof av === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [employees, search, sortKey, sortDir]);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  if (!employees || employees.length === 0) {
    return <p className="text-[14px] text-gray-500">No employees found.</p>;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-gray-200 p-3">
        <Search size={16} className="text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by employee code or job title…"
          className="w-full text-[13px] outline-none placeholder:text-gray-400"
        />
      </div>

      <div className="max-h-[420px] overflow-auto">
        <table className="w-full text-[13px]">
          <thead className="sticky top-0 z-10 bg-gray-workspace">
            <tr className="border-b border-gray-200 text-left text-gray-500">
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3 font-medium">
                  <button
                    onClick={() => toggleSort(col.key)}
                    className="flex items-center gap-1 hover:text-navy-dark"
                  >
                    {col.label}
                    <ArrowUpDown size={12} />
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr
                key={emp.id}
                className="border-b border-gray-100 last:border-0 hover:bg-gray-workspace"
              >
                <td className="px-4 py-3 text-navy-dark">{emp.employeeCode}</td>
                <td className="px-4 py-3 text-navy-dark">{emp.jobTitle ?? "—"}</td>
                <td className="px-4 py-3 text-navy-dark">
                  {emp.performanceScore?.toFixed(1) ?? "—"}
                </td>
                <td className="px-4 py-3 text-navy-dark">
                  {emp.monthlySalary
                    ? `₹${Number(emp.monthlySalary).toLocaleString()}`
                    : "—"}
                </td>
                <td className="px-4 py-3 text-navy-dark">
                  {emp.yearsAtCompany ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
