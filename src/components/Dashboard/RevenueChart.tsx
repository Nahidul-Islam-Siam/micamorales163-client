/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/RevenueChart.tsx
"use client";

import { useGetAnalyticsChartDataQuery } from "@/redux/service/Analytics/analyticsApi";
import { Card, Select, Skeleton } from "antd";
import { useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";

type TimeRange = "daily" | "weekly" | "monthly" | "yearly";

interface ChartDataItem {
  name: string;
  value: number;
  secondary?: number; // optional, for the pale line
}

// Custom tooltip (unchanged)
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: any[];
}) => {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;

  return (
    <div
      style={{
        background: "#ffffff ",
        borderRadius: 12,
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        padding: "12px 16px",
        minWidth: 120,
      }}
    >
      <div style={{ fontSize: 12, color: "#999" }}>This Month</div>
      <div style={{ fontSize: 20, fontWeight: 600, color: "#333" }}>
        ${value}
      </div>
      <div style={{ fontSize: 12, color: "#b0a07a", marginTop: 4 }}>May</div>
    </div>
  );
};

export default function RevenueChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  
  const { data: apiResponse, isLoading } = useGetAnalyticsChartDataQuery();

  // ✅ Transform API data: { category, value } → { name, value }
  const chartData = useMemo<ChartDataItem[]>(() => {
    if (!apiResponse?.data?.data) return [];
    
    return apiResponse.data.data.map((item: any) => ({
      name: item.category,
      value: item.value,
      // Optional: derive `secondary` if needed (e.g., value * 1.5)
      // For now, keep it as value or omit
      secondary: item.value, // or remove this line if you don't need secondary line
    }));
  }, [apiResponse]);

  // Optional: Show loading chart
  if (isLoading) {
    return (
      <Card
        style={{
          borderRadius: 16,
          border: "none",
          boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
          overflow: "hidden",
        }}
        bodyStyle={{ padding: "24px 32px 32px" }}
      >
        <Skeleton active paragraph={{ rows: 8 }} />
      </Card>
    );
  }

  return (
    <Card
      title={
        <div className="flex justify-between items-center">
          <div>
            <div
              style={{
                fontSize: 20,
                color: "#b0a07a",
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              Total Revenue
            </div>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#000000" }}>Yoga</div>
          </div>

          <Select
            value={timeRange}
            onChange={(value) => setTimeRange(value as TimeRange)}
            size="small"
            style={{ width: 120 }}
            options={[
              { value: "daily", label: "Daily" },
              { value: "weekly", label: "Weekly" },
              { value: "monthly", label: "Monthly" },
              { value: "yearly", label: "Yearly" },
            ]}
          />
        </div>
      }
      style={{
        borderRadius: 16,
        border: "none",
        boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
      bodyStyle={{ padding: "24px 32px 32px", backgroundColor: "#ffffff" }}
    >
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A7997D" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#f7f3ec" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2dfd7"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "#948b7b", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fill: "#c0b7a8", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={32}
          />

          <Tooltip content={<CustomTooltip />} />

          {/* Secondary line — optional. Remove if not needed */}
          <Line
            type="monotone"
            dataKey="secondary"
            stroke="#e2ded7"
            strokeWidth={2}
            dot={false}
            activeDot={false}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#7f6b4a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
            dot={{
              r: 4,
              fill: "#ffffff",
              stroke: "#7f6b4a",
              strokeWidth: 2,
            }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}