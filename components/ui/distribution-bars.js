export function DistributionBars({ distribution }) {
  const entries = Object.entries(distribution || {});
  if (entries.length === 0) {
    return <p className="text-[14px] text-gray-500">No data yet.</p>;
  }

  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <div className="flex flex-col gap-3">
      {entries.map(([label, count]) => {
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-navy-dark">{label}</span>
              <span className="text-gray-500">
                {count} ({pct.toFixed(0)}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-orange"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
