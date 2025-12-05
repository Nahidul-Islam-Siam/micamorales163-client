/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Table, Dropdown, Button, Pagination } from "antd";
import { MoreOutlined } from "@ant-design/icons";

import UserDetailsModal from "./UserDetailsModal";

// --------------------
// Interfaces
// --------------------
interface User {
  key: string;
  userId: string;
  name: string;
  email: string;
  subscription: string;
  totalClass: number;
  expiredDate: string;
}

type TabKey = "membership" | "signature" | "event";

// --------------------
// Mock Data
// --------------------
const mockData: Record<TabKey, User[]> = {
  membership: [
    { key: "1", userId: "12345", name: "Wilson Levin", email: "client000@gmail.com", subscription: "Membership", totalClass: 12, expiredDate: "12/12/2025" },
    { key: "2", userId: "12345", name: "Jane Smith", email: "jane@gmail.com", subscription: "Membership", totalClass: 8, expiredDate: "11/30/2025" },
    { key: "3", userId: "12345", name: "Alex Johnson", email: "alex@gmail.com", subscription: "Membership", totalClass: 6, expiredDate: "11/20/2025" },
    { key: "4", userId: "12345", name: "Sam Wilson", email: "sam@gmail.com", subscription: "Membership", totalClass: 4, expiredDate: "11/10/2025" },
  ],
  signature: [
    { key: "5", userId: "12345", name: "Taylor Swift", email: "taylor@gmail.com", subscription: "Signature Experience", totalClass: 8, expiredDate: "12/12/2025" },
    { key: "6", userId: "12345", name: "Chris Lee", email: "chris@gmail.com", subscription: "Signature Experience", totalClass: 8, expiredDate: "12/12/2025" },
    { key: "7", userId: "12345", name: "Morgan Frey", email: "morgan@gmail.com", subscription: "Signature Experience", totalClass: 8, expiredDate: "12/12/2025" },
    { key: "8", userId: "12345", name: "Riley Adams", email: "riley@gmail.com", subscription: "Signature Experience", totalClass: 8, expiredDate: "12/12/2025" },
  ],
  event: [
    { key: "9", userId: "12345", name: "Jamie Fox", email: "jamie@gmail.com", subscription: "Event", totalClass: 8, expiredDate: "12/12/2025" },
    { key: "10", userId: "12345", name: "Casey King", email: "casey@gmail.com", subscription: "Event", totalClass: 8, expiredDate: "12/12/2025" },
    { key: "11", userId: "12345", name: "Avery Park", email: "avery@gmail.com", subscription: "Event", totalClass: 8, expiredDate: "12/12/2025" },
    { key: "12", userId: "12345", name: "Quinn Bell", email: "quinn@gmail.com", subscription: "Event", totalClass: 8, expiredDate: "12/12/2025" },
  ],
};


// --------------------
// Main Component
// --------------------
const UserList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("membership");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const pageSize = 4;

  // Memoized data for current tab
  const displayedData = useMemo(() => mockData[activeTab], [activeTab]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const openDetailsModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    { title: "User Id", dataIndex: "userId", key: "userId" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Subscription", dataIndex: "subscription", key: "subscription" },
    { title: "Total Class", dataIndex: "totalClass", key: "totalClass" },
    { title: "Expired Date", dataIndex: "expiredDate", key: "expiredDate" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'disable',
                danger: true,
                label: 'Disable',
                onClick: () => console.log('Disable user:', record.key),
              },
              {
                key: 'details',
                label: 'Details',
                onClick: () => openDetailsModal(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  // Paginate data manually
  const paginatedData = displayedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">User List</h2>

      <div className="flex flex-col md:flex-row justify-between mb-6">
        {/* Tabs */}
        <div className="flex gap-4">
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
              {tab === "membership" ? "Membership" : tab === "signature" ? "Signature Experience" : "Event"}
            </button>
          ))}
        </div>

        {/* Add Subscription Button */}
        <Button
          className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-1 rounded-full text-sm font-medium"
          href="/dashboard/subscription/add-subscription"
        >
          + Add Subscription
        </Button>
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
                className={`w-10 h-10 flex items-center justify-center rounded mx-1 text-sm font-medium transition-colors
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

      {/* User Details Modal */}
      <UserDetailsModal visible={isModalOpen} onCancel={closeDetailsModal} user={selectedUser} />
    </div>
  );
};

export default UserList;