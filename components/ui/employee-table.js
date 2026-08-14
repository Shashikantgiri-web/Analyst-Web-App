"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown, Search, Download } from "lucide-react";

const COLUMNS = [
  { key: "employeeCode", label: "Employee Code" },
  { key: "jobTitle", label: "Job Title" },
  { key: "performanceScore", label: "Performance" },
  { key: "monthlySalary", label: "Salary" },
  { key: "yearsAtCompany", label: "Years" },
];

const PAGE_SIZE = 20;

function toCsv(rows) {
  const header = COLUMNS.map((c) => c.label).join(",");
  const lines = rows.map((r) =>
    COLUMNS.map((c) => {
      const v = r[c.key];
      return v === null || v === undefined ? "" : String(v).replace(/,/g, " ");
    }).join(",")
  );
  return [header, ...lines].join("\n");
}

function downloadCsv(rows) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `team-export-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Team roster table per 02_Design.md section 11: sticky header, sorting,
 * search, row hover, pagination, CSV export. Bulk row selection is
 * deferred -- flagged rather than half-implemented.
 */
export function EmployeeTable({ employees }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("performanceScore");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);

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

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSort(key) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    setPage(1);
  }

  function handleSearchChange(value) {
    setSearch(value);
    setPage(1);
  }

  if (!employees || employees.length === 0) {
    return <p className="text-[14px] text-gray-500">No employees found.</p>;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 p-3">
        <div className="flex flex-1 items-center gap-2">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by employee code or job title…"
            className="w-full text-[13px] outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={() => downloadCsv(filtered)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200
            px-3 py-1.5 text-[13px] font-medium text-navy-dark hover:border-orange hover:text-orange"
        >
          <Download size={14} />
          Export CSV
        </button>
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
            {pageRows.map((emp) => (
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

      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-[13px] text-gray-500">
        <span>
          Showing {(page - 1) * PAGE_SIZE + 1}–
          {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border border-gray-200 px-3 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-gray-200 px-3 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
