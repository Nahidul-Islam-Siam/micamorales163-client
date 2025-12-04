// components/dashboard/RevenueChart.tsx
import { Card, Select } from "antd";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

/** Data Interface */
interface ChartData {
  name: string;
  value: number;
}

/** Component Props Interface */
interface RevenueChartProps {
  timeRange: "daily" | "weekly" | "monthly" | "yearly";
  setTimeRange: (value: "daily" | "weekly" | "monthly" | "yearly") => void;
}

const chartData: ChartData[] = [
  { name: "Featured Classes", value: 200 },
  { name: "Signature Experiences", value: 450 },
  { name: "Events of the Season", value: 600 },
  { name: "Upcoming Events", value: 500 },
  { name: "Lumina Packages", value: 400 },
];

export default function RevenueChart({ timeRange, setTimeRange }: RevenueChartProps) {
  return (
    <Card
      title={
        <div className="flex justify-between items-center">
          <span style={{ fontSize: "18px", fontWeight: "600" }}>Total Revenue</span>
          <Select
            value={timeRange}
            onChange={setTimeRange}
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
        borderRadius: "12px",
        border: "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
      bodyStyle={{ padding: "24px" }}
    >
      <ResponsiveContainer width="100%" height={400}>
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          {/* Gradient Fill */}
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A7997D" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#A7997D" stopOpacity={0.1} />
            </linearGradient>
          </defs>

          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e8e8" />

          {/* Axes */}
          <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} />
          <YAxis tick={{ fill: "#666", fontSize: 12 }} axisLine={false} />

          {/* Tooltip */}
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "8px",
              borderColor: "#e8e8e8",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
              fontSize: "14px",
            }}
          />

          {/* Area Graph */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#A7997D"
            fillOpacity={1}
            fill="url(#colorValue)"
            strokeWidth={2}
            dot={{
              r: 4,
              fill: "#8884d8",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}