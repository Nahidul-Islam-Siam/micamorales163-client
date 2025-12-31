/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, Table, Dropdown, Button, Modal, Typography, Tag, Spin } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import AddAppointmentModal from "@/components/Dashboard/MyBooking/AddAppointmentModal";
import Swal from "sweetalert2";
import { useDeleteBookingMutation, useGetAllBookingsQuery } from "@/redux/service/booking/bookingApi";

const { Text } = Typography;

/** Interface for booking data - updated to match real API */
interface BookingRecord {
  key: string;
  id: string;
  bookedBy: string;
  email: string | null;
  className: string;
  dateTime: string;
  payment: "Card" | "Bank" | "Credit" | "Not Paid";
  status: string;
  phoneNumber: string;
  classType: string;
}

export default function RecentBookingListTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // Use real API data instead of mock data
  const { data: bookingResponse, isLoading, error } = useGetAllBookingsQuery({ 
    page: currentPage, 
    limit: 10, 
    searchTerm: "" 
  });

  const [deleteBooking] = useDeleteBookingMutation();

  // Transform real API data to table format
  const bookingData = useMemo<BookingRecord[]>(() => {
    if (!bookingResponse?.data?.result) return [];
    
    return bookingResponse.data.result.map((booking: any) => {
      // Determine payment method
      let paymentMethod: "Card" | "Bank" | "Credit" | "Not Paid" = "Not Paid";
      if (booking.payment) {
        // You can enhance this logic based on your payment system
        paymentMethod = "Card"; // Default to Card when payment exists
      }
      
      // Format date and time from classTimeSlot
      const startTime = booking.classTimeSlot?.startTime 
        ? new Date(booking.classTimeSlot.startTime).toLocaleString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        : "N/A";
      
      // Get customer name
      const customerName = booking.name || 
        `${booking.customer?.firstName || ''} ${booking.customer?.lastName || ''}`.trim() || 
        "Unknown";
      
      return {
        key: booking.id,
        id: booking.id,
        bookedBy: customerName,
        email: booking.email || booking.customer?.user?.email || "N/A",
        className: booking.classOffering?.name || "N/A",
        dateTime: startTime,
        payment: paymentMethod,
        status: booking.status,
        phoneNumber: booking.phoneNumber || "N/A",
        classType: booking.classOffering?.type || "N/A"
      };
    });
  }, [bookingResponse]);

  const showBookingDetails = (record: BookingRecord) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

const handleDelete = async (record: { id: string }) => {
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    const res = await deleteBooking(record.id).unwrap();

    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: res.message || "The booking has been deleted.",
    });
  } catch (error: any) {
    Swal.fire({
      icon: "error",
      title: "Deletion Failed",
      text: error?.data?.message || "Something went wrong.",
    });
  }
};


  const bookingColumns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
      width: 140,
      render: (text: string) => (
        <span className="text-gray-700 text-sm font-mono">{text.substring(0, 8)}</span>
      ),
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status: string) => {
        let color = "default";
        if (status === "BOOKED") color = "success";
        else if (status === "PROCESSING") color = "processing";
        else if (status === "CANCELLED") color = "error";
        
        return <Tag color={color}>{status}</Tag>;
      },
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
        } else if (text === "Not Paid") {
          bgColor = "#ff4d4f20";
          textColor = "#ff4d4f";
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
              whiteSpace: "nowrap",
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
              // { key: "2", label: "Edit" },
              {
                key: "3",
                label: "Delete",
                onClick: (e) => {
                  e.domEvent.stopPropagation();
                  handleDelete(record);
                },
              },
            ],
          }}
          placement="bottomRight"
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Card className="custom-recent-bookings-card" bodyStyle={{ padding: '40px' }}>
        <div className="flex justify-center">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="custom-recent-bookings-card" bodyStyle={{ padding: '40px' }}>
        <div className="text-center text-red-500">Failed to load bookings.</div>
      </Card>
    );
  }

  return (
    <>
      <Card
        className="custom-recent-bookings-card"
        title={
          <div className="flex justify-between items-center w-full">
            <span className="text-[#A7997D] font-semibold text-lg">
              Recent Bookings
            </span>
   
          </div>
        }
        bordered={false}
        style={{
          backgroundColor: "transparent",
          boxShadow: "none",
          border: "none",
        }}
        bodyStyle={{ padding: 0, backgroundColor: "transparent" }}
      >
        <div className="overflow-x-auto">
          <Table
            columns={bookingColumns}
            dataSource={bookingData}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: bookingResponse?.data?.meta?.total || 0,
              onChange: setCurrentPage,
              showSizeChanger: false,
              position: ["bottomRight"],
              hideOnSinglePage: true,
            }}
            scroll={{ x: 800 }}
            className="mt-5"
            locale={{ emptyText: "No bookings found" }}
          />
        </div>

        {/* --- Global Styles --- */}
        <style jsx global>{`
          .custom-recent-bookings-card .ant-card-head {
            display: flex !important;
            justify-content: center !important;
            flex-direction: column !important;
            min-height: 40px !important;
            margin-bottom: -1px;
            background: transparent !important;
            border-bottom: 1px solid #f0f0f0 !important;
            border-radius: 10px 10px 0 0 !important;
            padding: 0px 0px !important;
          }

          .custom-recent-bookings-card .ant-card-head-title {
            color: #a7997d !important;
            font-weight: 600 !important;
            font-size: 18px !important;
          }

          /* Table Header */
          .custom-recent-bookings-card .ant-table-thead > tr > th {
            background-color: #d2d6d8 !important;
            color: #333 !important;
            font-weight: 600 !important;
            border: 2px solid #d2d6d8 !important;
            padding: 16px 16px;
          }

          .custom-recent-bookings-card
            .ant-table-thead
            > tr:first-child
            > th:first-child {
            border-top-left-radius: 8px !important;
          }

          .custom-recent-bookings-card
            .ant-table-thead
            > tr:first-child
            > th:last-child {
            border-top-right-radius: 8px !important;
          }

          /* Pagination Styling */
          .custom-recent-bookings-card .ant-pagination-item-link,
          .custom-recent-bookings-card .ant-pagination-item a {
            color: black !important;
            border-color: #a7997d !important;
          }

          .custom-recent-bookings-card .ant-pagination-item-active {
            background-color: #a7997d !important;
            border-color: #a7997d !important;
          }

          .custom-recent-bookings-card .ant-pagination-item-active a {
            color: white !important;
          }

          .custom-recent-bookings-card .ant-pagination-item:hover a,
          .custom-recent-bookings-card .ant-pagination-item-link:hover {
            color: #5e5e5e !important;
            border-color: #5e5e5e !important;
          }

          .custom-recent-bookings-card .ant-pagination-prev a,
          .custom-recent-bookings-card .ant-pagination-next a {
            color: black !important;
          }

          .custom-recent-bookings-card .ant-pagination-prev button:disabled,
          .custom-recent-bookings-card .ant-pagination-next button:disabled {
            border-color: #ddd !important;
            color: #ccc !important;
          }
        `}</style>
      </Card>

      {/* View Booking Details Modal */}
      <Modal
        title="Booking Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={600}
        styles={{
          header: { textAlign: "center" },
        }}
      >
        {selectedBooking && (
          <div className="space-y-3 p-5 text-sm">
            <div className="flex justify-between">
              <Text strong>Booking ID</Text>
              <Text>{selectedBooking.id}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Booked By</Text>
              <Text>{selectedBooking.bookedBy}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Email</Text>
              <Text>{selectedBooking.email}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Phone Number</Text>
              <Text>{selectedBooking.phoneNumber}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Class Name</Text>
              <Text>{selectedBooking.className}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Class Type</Text>
              <Text>{selectedBooking.classType}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Date & Time</Text>
              <Text>{selectedBooking.dateTime}</Text>
            </div>
            <div className="flex justify-between">
              <Text strong>Status</Text>
              <Tag color={selectedBooking.status === "BOOKED" ? "success" : "processing"}>
                {selectedBooking.status}
              </Tag>
            </div>
            <div className="flex justify-between items-center">
              <Text strong>Payment</Text>
              <span
                style={{
                  backgroundColor:
                    selectedBooking.payment === "Credit"
                      ? "#4CAF50"
                      : selectedBooking.payment === "Not Paid"
                      ? "#ff4d4f20"
                      : "#A7997D40",
                  color:
                    selectedBooking.payment === "Credit"
                      ? "white"
                      : selectedBooking.payment === "Not Paid"
                      ? "#ff4d4f"
                      : "#4E4E4A",
                  padding: "4px 8px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {selectedBooking.payment}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Appointment Modal */}
    
    </>
  );
}