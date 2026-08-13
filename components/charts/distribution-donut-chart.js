"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { CATEGORICAL_PALETTE } from "@/constants/theme";

/**
 * Renders a category -> count distribution (e.g. Performance Rating,
 * Work-Life Balance) as a donut chart. Each chart instance gets its own
 * independent data + color assignment -- per 02_Design.md's explicit rule
 * that two distribution charts must never share a query, config, or
 * color/order mapping (this was the root cause of the v1 duplicate-chart
 * bug on the Manager dashboard).
 */
export function DistributionDonutChart({ distribution, colorSeed = 0 }) {
  const entries = Object.entries(distribution || {});

  if (entries.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-[14px] text-gray-500">
        No data yet.
      </div>
    );
  }

  const data = entries.map(([name, value]) => ({ name, value }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <Cell
              key={entry.name}
              fill={CATEGORICAL_PALETTE[(i + colorSeed) % CATEGORICAL_PALETTE.length]}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name) => [value, name]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            fontSize: 13,
          }}
        />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 13 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
