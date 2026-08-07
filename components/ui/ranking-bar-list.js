export function RankingBarList({ items, valueLabel = "Score" }) {
  if (!items || items.length === 0) {
    return <p className="text-[14px] text-gray-500">No data yet.</p>;
  }

  const max = Math.max(...items.map((i) => i.avgPerformanceScore));

  return (
    <div className="flex flex-col gap-3">
      {items.map((item, idx) => {
        const widthPct = max > 0 ? (item.avgPerformanceScore / max) * 100 : 0;
        return (
          <div key={item.id} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-navy-dark">
                {idx + 1}. {item.name}
              </span>
              <span className="text-gray-500">
                {item.avgPerformanceScore.toFixed(1)} {valueLabel} ·{" "}
                {item.employeeCount} employees
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-orange"
                style={{ width: `${widthPct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
