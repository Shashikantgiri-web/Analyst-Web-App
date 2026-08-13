/**
 * KPI card per 02_Design.md section 10: Title, Main Number, Icon, hover
 * shadow, rounded corners, 20px padding.
 *
 * Note: "Comparison" and "Trend" from the spec (e.g. "+4% vs last month")
 * need a historical snapshot to compare against, which nothing in the
 * schema currently stores -- deliberately left out rather than faked.
 * Worth a V2.1 pass once period-over-period data exists.
 */
export function KpiCard({ label, value, suffix = "", icon: Icon, tooltip }) {
  const display =
    value === null || value === undefined
      ? "—"
      : typeof value === "number"
      ? value.toLocaleString(undefined, { maximumFractionDigits: 1 })
      : value;

  return (
    <div
      title={tooltip}
      className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5
        shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-gray-500">{label}</span>
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange/10 text-orange">
            <Icon size={16} />
          </span>
        )}
      </div>
      <span className="text-[24px] font-bold text-navy-dark">
        {display}
        {value !== null && value !== undefined ? suffix : ""}
      </span>
    </div>
  );
}
