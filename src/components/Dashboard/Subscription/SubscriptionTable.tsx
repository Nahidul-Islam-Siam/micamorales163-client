/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Table, Dropdown, Menu, Button } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

// --------------------
// Interfaces
// --------------------
interface Subscription {
  key: string;
  title: string;
  numberOfClass: number | "Unlimited";
  numberOfCredit: number | "Unlimited";
  price: number;
  validity: string;
}

type TabKey = "membership" | "signature" | "event";

interface ActionMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

// --------------------
// Mock Data
// --------------------
const mockData: Record<TabKey, Subscription[]> = {
  membership: [
    { key: "1", title: "4 Class Membership", numberOfClass: 4, numberOfCredit: 4, price: 40, validity: "7 days" },
    { key: "2", title: "8 Class Membership", numberOfClass: 8, numberOfCredit: 8, price: 80, validity: "30 days" },
    { key: "3", title: "Unlimited Monthly", numberOfClass: "Unlimited", numberOfCredit: "Unlimited", price: 200, validity: "30 days" },
    { key: "4", title: "16 Class Pack", numberOfClass: 16, numberOfCredit: 16, price: 150, validity: "60 days" },
    { key: "5", title: "24 Class Pack", numberOfClass: 24, numberOfCredit: 24, price: 250, validity: "90 days" },
    { key: "6", title: "Unlimited Yearly", numberOfClass: "Unlimited", numberOfCredit: "Unlimited", price: 500, validity: "365 days" },
    { key: "7", title: "Unlimited Lifetime", numberOfClass: "Unlimited", numberOfCredit: "Unlimited", price: 1000, validity: "Lifetime" },
    { key: "8", title: "Unlimited Lifetime", numberOfClass: "Unlimited", numberOfCredit: "Unlimited", price: 1000, validity: "Lifetime" },
    { key: "9", title: "Unlimited Lifetime", numberOfClass: "Unlimited", numberOfCredit: "Unlimited", price: 1000, validity: "Lifetime" },
  ],
  signature: [
    { key: "5", title: "Sunset Yoga Retreat", numberOfClass: 1, numberOfCredit: 1, price: 99, validity: "1 day" },
    { key: "6", title: "Weekend Wellness Escape", numberOfClass: 3, numberOfCredit: 3, price: 299, validity: "3 days" },
    { key: "7", title: "Full Moon Meditation", numberOfClass: 1, numberOfCredit: 1, price: 50, validity: "1 night" },
    { key: "8", title: "Spa & Sound Healing", numberOfClass: 2, numberOfCredit: 2, price: 180, validity: "2 days" },
  ],
  event: [
    { key: "9", title: "New Year Gala Dinner", numberOfClass: 1, numberOfCredit: 1, price: 150, validity: "Dec 31" },
    { key: "10", title: "Summer Solstice Party", numberOfClass: 1, numberOfCredit: 1, price: 120, validity: "Jun 21" },
    { key: "11", title: "Charity Fundraiser", numberOfClass: 1, numberOfCredit: 1, price: 100, validity: "Oct 15" },
    { key: "12", title: "VIP Wine Tasting", numberOfClass: 1, numberOfCredit: 1, price: 200, validity: "Monthly" },
  ],
};

// --------------------
// Action Menu
// --------------------
const ActionMenu: React.FC<ActionMenuProps> = ({ onEdit, onDelete }) => (
  <Menu>
    <Menu.Item key="edit" onClick={onEdit}>Edit</Menu.Item>
    <Menu.Item key="delete" danger onClick={onDelete}>Delete</Menu.Item>
  </Menu>
);

// --------------------
// Main Component
// --------------------
const SubscriptionTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("membership");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 4;

  const displayedData = useMemo(() => mockData[activeTab], [activeTab]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleDelete = (record: Subscription) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then((result) => {
  if (result.isConfirmed) {
    // ✅ Perform delete logic here
    // e.g., call your API: deleteService(record.id)
    console.log("Deleting record:", record.key);
    
    // Optionally show success message
    Swal.fire("Deleted!", "The record has been deleted.", "success");
  }   
  })

  };

  const columns = [
    {
      title: "Subscription Title",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span className="font-medium">{text}</span>,
    },
    { title: "Number Of Class", dataIndex: "numberOfClass", key: "numberOfClass" },
    { title: "Number Of Credit", dataIndex: "numberOfCredit", key: "numberOfCredit" },
    {
      title: "Price $",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span>${price}</span>,
    },
    { title: "Validity Time", dataIndex: "validity", key: "validity" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Subscription) => (
        <Dropdown
          overlay={
            <ActionMenu
              onEdit={() => console.log("Edit", record.key)}
              onDelete={() => handleDelete(record)}
            />
          }
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
      {/* Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription List</h2>

      {/* Tabs & Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          {["membership", "signature", "event"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab as TabKey)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? "bg-[#A7997D] text-white border border-[#A7997D]"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {tab === "membership"
                ? "Membership"
                : tab === "signature"
                ? "Signature Experience"
                : "Event"}
            </button>
          ))}
        </div>

        <Button
          href="/dashboard/subscription/add-subscription"
          className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-1 rounded-full text-sm font-medium"
        >
          + Add Subscription
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          dataSource={displayedData}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: displayedData.length,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            position: ['bottomRight'],
            hideOnSinglePage: true,
          }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
          className="w-full"
        />
      </div>

      {/* --- Global Style Copied from Booking Table --- */}
      <style jsx global>{`
        /* Match exactly with RecentBookingsTable */

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
          padding: 16px !important;
        }

        .custom-recent-bookings-card .ant-table-thead > tr:first-child > th:first-child {
          border-top-left-radius: 8px !important;
        }

        .custom-recent-bookings-card .ant-table-thead > tr:first-child > th:last-child {
          border-top-right-radius: 8px !important;
        }

        /* Table Body */
        .custom-recent-bookings-card .ant-table-tbody > tr > td {
          padding: 16px !important;
          border-bottom: 1px solid #f0f0f0;
        }

        .custom-recent-bookings-card .ant-table-tbody > tr:hover > td {
          background-color: #f9fafb !important;
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
          color: #8d7c68 !important;
          border-color: #8d7c68 !important;
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
    </div>
  );
};

export default SubscriptionTable;