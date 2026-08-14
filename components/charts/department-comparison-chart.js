"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { CHART_COLORS } from "@/constants/theme";

const METRIC_LABELS = {
  performanceScore: "Performance Score",
  satisfactionScore: "Satisfaction Score",
  trainingHours: "Training Hours",
  workHoursPerWeek: "Work Hours/Week",
};

/** "You vs. Your Department Average" -- the one chart that makes sense
 * for a single-person dashboard (a distribution needs multiple data
 * points; a direct comparison against a peer average doesn't). */
export function DepartmentComparisonChart({ comparison }) {
  if (!comparison) {
    return (
      <div className="flex h-[220px] items-center justify-center text-[14px] text-gray-500">
        No comparison data yet.
      </div>
    );
  }

  const data = Object.entries(comparison)
    .filter(([, v]) => v.you !== null && v.departmentAvg !== null)
    .map(([key, v]) => ({
      metric: METRIC_LABELS[key] ?? key,
      You: Number(Number(v.you).toFixed(1)),
      "Department Avg": Number(Number(v.departmentAvg).toFixed(1)),
    }));

  if (data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center text-[14px] text-gray-500">
        No comparison data yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ left: 8, right: 8 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="metric" tick={{ fontSize: 12, fill: "#6B7280" }} />
        <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #E5E7EB",
            fontSize: 13,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 13 }} />
        <Bar dataKey="You" fill={CHART_COLORS.performance} radius={[6, 6, 0, 0]} />
        <Bar dataKey="Department Avg" fill={CHART_COLORS.info} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
