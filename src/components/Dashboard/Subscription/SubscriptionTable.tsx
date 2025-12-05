/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Table, Dropdown, Menu, Button, Pagination } from "antd";
import { MoreOutlined } from "@ant-design/icons";

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

  // Memoized data for current tab
  const displayedData = useMemo(() => mockData[activeTab], [activeTab]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const columns = [
    { title: "Subscription Title", dataIndex: "title", key: "title", render: (text: string) => <span className="font-medium">{text}</span> },
    { title: "Number Of Class", dataIndex: "numberOfClass", key: "numberOfClass" },
    { title: "Number Of Credit", dataIndex: "numberOfCredit", key: "numberOfCredit" },
    { title: "Price $", dataIndex: "price", key: "price", render: (price: number) => <span>${price}</span> },
    { title: "Validity Time", dataIndex: "validity", key: "validity" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Subscription) => (
        <Dropdown overlay={<ActionMenu onEdit={() => console.log("Edit", record.key)} onDelete={() => console.log("Delete", record.key)} />} trigger={['click']}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      )
    }
  ];

  // Paginate data manually
  const paginatedData = displayedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription List</h2>

<div className="flex flex-col md:flex-row  justify-between">
          {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["membership", "signature", "event"].map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab as TabKey)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab
                ? "bg-[#A7997D] text-white border border-[#A7997D]"
                : "text-gray-700 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            {tab === "membership" ? "Membership" : tab === "signature" ? "Signature Experience" : "Event"}
          </button>
        ))}
      </div>

      
    <div>
                {/* Add Listing */}
            <Button
              className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-1 rounded-full text-sm font-medium"
          href="/dashboard/subscription/add-subscription"
            >
              + Add Subscription
            </Button>
    </div>
</div>

      {/* Table */}
      <Table
        dataSource={paginatedData}
        columns={columns}
        pagination={false}
        rowClassName="hover:bg-gray-50"
        scroll={{ x: "max-content" }}
      />

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={displayedData.length}
          onChange={handlePageChange}
          showSizeChanger={false}
          itemRender={(page, type) => {
            if (type === 'prev') return <Button type="text">‹</Button>;
            if (type === 'next') return <Button type="text">›</Button>;
           return (
  <button
    key={page}
    onClick={() => handlePageChange(page)}
    className={`w-10  h-10 flex items-center justify-center rounded mx-1 text-sm font-medium transition-colors
      ${page === currentPage
        ? "bg-[#A7997D] text-white"
        : "bg-white text-gray-700 hover:bg-gray-200"
      }`}
  >
    {page}
  </button>
);

          }}
        />
      </div>
    </div>
  );
};

export default SubscriptionTable;
