/* eslint-disable @typescript-eslint/no-explicit-any */
// components/dashboard/RecentBookingsTable.tsx
'use client';
import { Card, Table, Dropdown, Button, Modal, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Text } = Typography;

/** Interface for booking data */
interface BookingRecord {
  key: number;
  id: number;
  bookedBy: string;
  email: string;
  className: string;
  dateTime: string;
  payment: 'Card' | 'Bank' | 'Credit';
}

/** Props interface */
interface RecentBookingsTableProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

// Mock data generation
const bookingData: BookingRecord[] = Array.from({ length: 12 }, (_, i) => ({
  key: i,
  id: 12345 + i,
  bookedBy: 'Wilson Leon',
  email: 'client009@gmail.com',
  className: 'Signature Experiences',
  dateTime: '12/12/25 - 6:00pm',
  payment: ['Card', 'Bank', 'Credit'][i % 3] as BookingRecord['payment'],
}));

export default function RecentBookingsTable({
  currentPage,
  setCurrentPage,
}: RecentBookingsTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showDetails = (record: BookingRecord) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedBooking(null);
  };

  const bookingColumns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Booked By',
      dataIndex: 'bookedBy',
      key: 'bookedBy',
      width: 150,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      render: (text: string) => (
        <span className="text-gray-700 text-sm">{text}</span>
      ),
    },
    {
      title: 'Class Name',
      dataIndex: 'className',
      key: 'className',
      width: 180,
    },
    {
      title: 'Date & Time',
      dataIndex: 'dateTime',
      key: 'dateTime',
      width: 160,
    },
    {
      title: 'Payment',
      dataIndex: 'payment',
      key: 'payment',
      width: 120,
      render: (text: BookingRecord['payment']) => {
        let bgColor = '#A7997D40';
        let textColor = '#4E4E4A';
        let fontWeight = 500;

        if (text === 'Credit') {
          bgColor = '#4CAF50'; // Green
          textColor = 'white';
          fontWeight = 600;
        }

        return (
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs whitespace-nowrap"
            style={{
              backgroundColor: bgColor,
              color: textColor,
              fontWeight,
              fontSize: '11px',
              padding: '4px 8px',
            }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: BookingRecord) => (
        <Dropdown
          menu={{
            items: [
              {
                key: '1',
                label: 'View Details',
                onClick: () => showDetails(record),
              },
              { key: '2', label: 'Edit' },
              { key: '3', label: 'Delete' },
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
        className="custom-recent-bookings-card"
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            {/* Left: Title */}
            <span
              style={{
                fontSize: '18px',
                color: '#A7997D',
                fontWeight: '600',
              }}
            >
              Recent Bookings
            </span>

            {/* Right: Add Product Button */}
            <button
              className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-2 rounded-[14px] text-sm font-medium flex items-center space-x-1 transition-colors"
              onClick={() => alert('Add new booking!')}
            >
              <span>+</span>
              <span>Add Booking</span>
            </button>
          </div>
        }
        style={{
          borderRadius: '0',
          border: 'none',
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
        bodyStyle={{
          padding: 0,
          backgroundColor: 'transparent',
        }}
      >
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <Table
            columns={bookingColumns}
            dataSource={bookingData}
            pagination={{
              current: currentPage,
              pageSize: 10,
              total: bookingData.length,
              onChange: setCurrentPage,
              showSizeChanger: false,
              position: ['bottomRight'],
              hideOnSinglePage: true,
            }}
            scroll={{ x: 800 }}
            tableLayout="auto"
            bordered={false}
            style={{ marginTop: '20px' }}
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

          .custom-recent-bookings-card .ant-table-thead > tr:first-child > th:first-child {
            border-top-left-radius: 8px !important;
          }

          .custom-recent-bookings-card .ant-table-thead > tr:first-child > th:last-child {
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

      {/* 💡 Modal: Booking Details */}
      <Modal
        title="Booking Details"
        open={isModalVisible}
        onCancel={closeModal}
        footer={null}
        centered
        width={600}
      >
        {selectedBooking && (
          <div style={{ padding: '20px', lineHeight: '2.2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Booking ID</Text>
              <Text>{selectedBooking.id}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Booked By</Text>
              <Text>{selectedBooking.bookedBy}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Email</Text>
              <Text>{selectedBooking.email}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Last Class Name</Text>
              <Text>{selectedBooking.className}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Date & Time</Text>
              <Text>{selectedBooking.dateTime}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text strong>Payment</Text>
              <span
                style={{
                  backgroundColor:
                    selectedBooking.payment === 'Credit' ? '#4CAF50' : '#A7997D40',
                  color: selectedBooking.payment === 'Credit' ? 'white' : '#4E4E4A',
                  fontWeight: selectedBooking.payment === 'Credit' ? 600 : 500,
                  padding: '4px 8px',
                  borderRadius: '20px',
                  fontSize: '11px',
                }}
              >
                {selectedBooking.payment}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}