/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  Table,
  Dropdown,
  Button,
  Modal,
  Typography,

} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useState } from "react";
import AddAppointmentModal from "@/components/Dashboard/MyBooking/AddAppointmentModal";

const { Text } = Typography;

/** Interface for booking data */
interface BookingRecord {
  key: number;
  id: number;
  bookedBy: string;
  email: string;
  className: string;
  dateTime: string;
  payment: "Card" | "Bank" | "Credit";
}

// Mock data
const bookingData: BookingRecord[] = Array.from({ length: 12 }, (_, i) => ({
  key: i,
  id: 12345 + i,
  bookedBy: "Wilson Leon",
  email: "client009@gmail.com",
  className: "Signature Experiences",
  dateTime: "12/12/25 - 6:00pm",
  payment: ["Card", "Bank", "Credit"][i % 3] as BookingRecord["payment"],
}));

/** Add Modal Props */



export default function BookingListTable() {
  // ⬇️ FIX: Local pagination state (NOT props)
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const showBookingDetails = (record: BookingRecord) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  const bookingColumns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Booked By",
      dataIndex: "bookedBy",
      key: "bookedBy",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      render: (text: string) => (
        <span className="text-gray-700 text-sm">{text}</span>
      ),
    },
    {
      title: "Class Name",
      dataIndex: "className",
      key: "className",
      width: 180,
    },
    {
      title: "Date & Time",
      dataIndex: "dateTime",
      key: "dateTime",
      width: 160,
    },
    {
      title: "Payment",
      dataIndex: "payment",
      key: "payment",
      width: 120,
      render: (text: BookingRecord["payment"]) => {
        let bgColor = "#A7997D40";
        let textColor = "#4E4E4A";

        if (text === "Credit") {
          bgColor = "#4CAF50";
          textColor = "white";
        }

        return (
          <span
            style={{
              backgroundColor: bgColor,
              color: textColor,
              fontWeight: 600,
              padding: "4px 8px",
              borderRadius: "20px",
              fontSize: "11px",
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_: any, record: BookingRecord) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "View Details",
                onClick: () => showBookingDetails(record),
              },
              { key: "2", label: "Edit" },
              { key: "3", label: "Delete" },
            ],
          }}
          placement="bottomRight"
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                color: "#A7997D",
                fontWeight: "600",
              }}
            >
              Recent Bookings
            </span>

            <button
              className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-2 rounded-[14px] text-sm font-medium"
              onClick={() => setIsAddModalVisible(true)}
            >
              + Add Booking
            </button>
          </div>
        }
        style={{ border: "none", backgroundColor: "transparent" }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ overflowX: "auto", width: "100%" }}>
          <Table
            columns={bookingColumns}
            dataSource={bookingData}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: bookingData.length,
              onChange: setCurrentPage,
              showSizeChanger: false,
              position: ["bottomRight"],
              hideOnSinglePage: true,
            }}
            scroll={{ x: 800 }}
            style={{ marginTop: "20px" }}
          />
        </div>
      </Card>

      {/* View Booking Details Modal */}
      <Modal
        title="Booking Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={600}
      >
        {selectedBooking && (
          <div style={{ padding: "20px", lineHeight: "2" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Booking ID</Text>
              <Text>{selectedBooking.id}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Booked By</Text>
              <Text>{selectedBooking.bookedBy}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Email</Text>
              <Text>{selectedBooking.email}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Last Class Name</Text>
              <Text>{selectedBooking.className}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Date & Time</Text>
              <Text>{selectedBooking.dateTime}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Payment</Text>
              <span
                style={{
                  backgroundColor:
                    selectedBooking.payment === "Credit"
                      ? "#4CAF50"
                      : "#A7997D40",
                  color:
                    selectedBooking.payment === "Credit" ? "white" : "#4E4E4A",
                  padding: "4px 8px",
                  borderRadius: "20px",
                }}
              >
                {selectedBooking.payment}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={(values) => {
          console.log("New Appointment Data:", values);
          setIsAddModalVisible(false);
        }}
      />
    </>
  );
}
