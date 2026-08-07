export function KpiCard({ label, value, suffix = "", tooltip }) {
  const display =
    value === null || value === undefined
      ? "—"
      : typeof value === "number"
      ? value.toLocaleString(undefined, { maximumFractionDigits: 1 })
      : value;

  return (
    <div
      title={tooltip}
      className="flex flex-col gap-1 rounded-xl border border-gray-200 bg-white p-4
        shadow-sm"
    >
      <span className="text-[13px] font-medium text-gray-500">{label}</span>
      <span className="text-[24px] font-bold text-navy-dark">
        {display}
        {value !== null && value !== undefined ? suffix : ""}
      </span>
    </div>
  );
}
