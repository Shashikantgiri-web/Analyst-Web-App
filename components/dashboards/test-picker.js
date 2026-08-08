"use client";

import { useRouter, usePathname } from "next/navigation";

export function TestPicker({ label, paramName, options }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <p className="text-[14px] font-medium text-navy-dark">{label}</p>
      <select
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) {
            router.push(`${pathname}?${paramName}=${e.target.value}`);
          }
        }}
        className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-[14px]"
      >
        <option value="" disabled>
          Choose…
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
