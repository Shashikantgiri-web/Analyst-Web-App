"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CHART_COLORS } from "@/constants/theme";

/** Department Performance Ranking, as a real horizontal bar chart. */
export function RankingBarChart({ items, valueLabel = "Score" }) {
  if (!items || items.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-[14px] text-gray-500">
        No data yet.
      </div>
    );
  }

  const data = items.map((item) => ({
    name: item.name,
    score: Number(item.avgPerformanceScore.toFixed(1)),
    employeeCount: item.employeeCount,
  }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 48)}>
      <BarChart data={data} layout="vertical" margin={{ left: 8, right: 24 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
        <XAxis type="number" tick={{ fontSize: 12, fill: "#6B7280" }} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 13, fill: "#111827" }}
        />
        <Tooltip
          formatter={(value, _name, props) => [
            `${value} ${valueLabel} · ${props.payload.employeeCount} employees`,
            "Avg performance",
          ]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            fontSize: 13,
          }}
        />
        <Bar dataKey="score" fill={CHART_COLORS.performance} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
