// app/page.tsx (or wherever your route is)
"use client";

import RecentBookingsTable from "@/components/Dashboard/RecentBookingsTable";
import RevenueChart from "@/components/Dashboard/RevenueChart";
import StatCards from "@/components/Dashboard/StatCards";
import { Layout, Row, Col } from "antd";
import { useState } from "react";

const { Content } = Layout;
type TimeRange = "daily" | "weekly" | "monthly" | "yearly";
export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <Content style={{ padding: "40px" }}>
        {/* Stat Cards */}
        <Row gutter={[24, 24]}>
          <StatCards />
        </Row>

        {/* Revenue Chart */}
        <Row gutter={[24, 24]} style={{ marginBottom: "40px" }}>
          <Col span={24}>
            <RevenueChart timeRange={timeRange} setTimeRange={setTimeRange} />
          </Col>
        </Row>

        {/* Booking Table */}
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <RecentBookingsTable
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
