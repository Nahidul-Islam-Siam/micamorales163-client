"use client";

import React from "react";
import { Modal, Row, Col, Table, Divider, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import avatarPlaceholder from "@/assets/avatar/avatar2.png"; // fallback image

// Match your actual API response structure
export interface RealUser {
  id: string;
  email: string;
  gender: "MALE" | "FEMALE" | "OTHERS" | null;
  avatars: string | null;
  customer: {
    firstName: string;
    lastName: string;
    address: string | null;
    gymGoal: string | null;
    preferredExperience: string | null;
    bookings: Array<{
      id: string;
      bookingDate: string;
      status: string;
      classOffering: {
        name: string;
        type: string; // e.g., "SIGNATURE", "EVENTS_OF_SEASON"
      };
    }>;
  };
}

interface UserDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  user: RealUser | null;
}

const UserDetailsModal: React.FC<UserDetailsModalProps> = ({ visible, onCancel, user }) => {
  if (!user) return null;

  const customer = user.customer;
  const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || user.email.split("@")[0];
  // const avatarUrl = user.avatars || avatarPlaceholder;

  // Map actual bookings to table rows
  const bookingRows = (customer.bookings || []).map((booking) => ({
    key: booking.id,
    date: new Date(booking.bookingDate).toLocaleDateString("en-US"),
    subscription: booking.classOffering?.name || "—",
    type: booking.classOffering?.type || "—",
    status: booking.status || "—",
  }));

  const columns: ColumnsType<typeof bookingRows[0]> = [
    { title: "Booking Date", dataIndex: "date", key: "date" },
    { title: "Class Name", dataIndex: "subscription", key: "subscription" },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        let color = "default";
        if (type === "SIGNATURE") color = "purple";
        else if (type === "EVENTS_OF_SEASON") color = "blue";
        else if (type === "MEMBERSHIP") color = "green";
        return <Tag color={color}>{type}</Tag>;
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "COMPLETED") color = "success";
        else if (["PENDING", "PROCESSING"].includes(status)) color = "processing";
        else if (["CANCELLED", "REJECTED"].includes(status)) color = "error";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const safeValue = (value: string | null | undefined) => value || "N/A";

  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onCancel}
      width={900}
      footer={null}
      styles={{
        header: { textAlign: "center", paddingBottom: "16px" },
        body: { padding: "24px" },
      }}
    >
      {/* User Profile Section */}
      <Row gutter={24} style={{ marginBottom: "32px" }}>
        <Col span={24}>
          <Row gutter={24}>
            <Col span={8} style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid #f0f0f0",
                }}
              >
                <Image
                  src={avatarPlaceholder}
                  alt="Avatar"
                  width={120}
                  height={120}
                  style={{ objectFit: "cover" }}
                />
              </div>
            </Col>
            <Col span={16}>
              <h2 style={{ margin: "0 0 8px 0", fontSize: "1.5rem" }}>{fullName}</h2>
              <p style={{ margin: "0 0 16px 0", color: "#666" }}>Customer ID: {user.id}</p>
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <InfoField label="Email" value={user.email} />
                </Col>
                <Col span={12}>
                  <InfoField label="Phone Number" value="N/A" /> {/* add when API supports */}
                </Col>
                <Col span={12}>
                  <InfoField label="Gender" value={safeValue(user.gender)} />
                </Col>
                <Col span={12}>
                  <InfoField
                    label="Preference to experience"
                    value={safeValue(customer.preferredExperience)}
                  />
                </Col>
                <Col span={12}>
                  <InfoField label="Address" value={safeValue(customer.address)} />
                </Col>
                <Col span={12}>
                  <InfoField label="Goal" value={safeValue(customer.gymGoal)} />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>

      <Divider />

      {/* Bookings Section */}
      <div style={{ marginTop: "24px" }}>
        <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "16px", color: "#A7997D" }}>
          Bookings ({bookingRows.length})
        </h3>
        <Table
          columns={columns}
          dataSource={bookingRows}
          pagination={false}
          size="small"
          rowHoverable={true}
        />
      </div>
    </Modal>
  );
};

const InfoField = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <p style={{ margin: "0 0 4px 0", fontSize: "0.75rem", color: "#999" }}>{label}</p>
    <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 500 }}>{value}</p>
  </div>
);

export default UserDetailsModal;