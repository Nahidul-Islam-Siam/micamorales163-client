/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Table, Dropdown, Button, Tag, Spin } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useGetAllUserListQuery } from "@/redux/service/userprofile/userApi";
import UserDetailsModal from "./UserDetailsModal";

// --------------------
// Interface (based on real API)
// --------------------
interface TableRowUser {
  key: string;
  userId: string;
  name: string;
  email: string;
  subscription: string; // inferred
  totalClass: number; // from bookings
  expiredDate: string; // inferred from payments
  rawUser: any; // full user object for modal
}

type TabKey = "membership" | "signature" | "event";

// --------------------
// Main Component
// --------------------
const UserList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("membership");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TableRowUser | null>(null);

  const { data: userData, isLoading, error } = useGetAllUserListQuery();

  const pageSize = 4;

  // 🔁 Map real API data to table rows
  const allTableData = useMemo<TableRowUser[]>(() => {
    if (!userData?.data?.filterOnlyCustomerList?.length) return [];

    return userData.data.filterOnlyCustomerList.map((user: any) => {
      const { id, email, username } = user;
      const customer = user.customer || {};
      const firstName = customer.firstName || "";
      const lastName = customer.lastName || "";
      const name =
        firstName || lastName ? `${firstName} ${lastName}`.trim() : username;

      const bookings = customer.bookings || [];
      const payments = customer.payments || [];

      // 🔸 Infer subscription type (example logic — adjust as needed)
      let subscription = "Free";
      if (payments.some((p: any) => p.status === "COMPLETED")) {
        // Simple: if any paid class, mark as "Paid"
        subscription = "Paid";
      }

      // 🔸 Infer expiry (example: 30 days from latest completed payment)
      let expiredDate = "N/A";
      const completedPayments = payments.filter(
        (p: any) => p.status === "COMPLETED"
      );
      if (completedPayments.length > 0) {
        const latest = completedPayments.reduce((latest: any, p: any) =>
          new Date(p.createdAt) > new Date(latest.createdAt) ? p : latest
        );
        const expiry = new Date(latest.createdAt);
        expiry.setDate(expiry.getDate() + 30); // 30-day access
        expiredDate = expiry.toLocaleDateString("en-US");
      }

      return {
        key: id,
        userId: id,
        name,
        email,
        subscription,
        totalClass: bookings.length,
        expiredDate,
        rawUser: user, // for modal
      };
    });
  }, [userData]);

  // 🔍 Filter by tab (you can refine logic later)
  const displayedData = useMemo(() => {
    // For now: show all users in all tabs (since we lack `type` field)
    // Later: filter by customer.preferredExperience or class type
    return allTableData;
  }, [allTableData, activeTab]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const openDetailsModal = (user: TableRowUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleDisable = (user: TableRowUser) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, disable it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Disabling user:", user.userId);
        Swal.fire("Disabled!", "The user has been disabled.", "success");
      }
    });
  };

  const columns = [
    { title: "User Id", dataIndex: "userId", key: "userId" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Subscription",
      dataIndex: "subscription",
      key: "subscription",
      render: (text: string) => (
        <Tag color={text === "Paid" ? "green" : "default"}>{text}</Tag>
      ),
    },
    { title: "Total Class", dataIndex: "totalClass", key: "totalClass" },
    { title: "Expired Date", dataIndex: "expiredDate", key: "expiredDate" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: TableRowUser) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "disable",
                danger: true,
                label: "Disable",
                onClick: () => handleDisable(record),
              },
              {
                key: "details",
                label: "Details",
                onClick: () => openDetailsModal(record),
              },
            ],
          }}
          trigger={["click"]}
        >
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-red-500 text-center">
        Failed to load users.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">User List</h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          {(["membership", "signature", "event"] as TabKey[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
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

        {/* <Button
          href="/dashboard/subscription/add-subscription"
          className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-1 rounded-full text-sm font-medium"
        >
          + Add Subscription
        </Button> */}
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={displayedData}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize,
            total: displayedData.length,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            position: ["bottomRight"],
          }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
          className="w-full"
        />
      </div>

      <UserDetailsModal
        visible={isModalOpen}
        onCancel={closeDetailsModal}
        user={selectedUser?.rawUser || null} // Pass full user object
      />

      {/* Styles (keep your existing global styles) */}
      <style jsx global>{`
        /* ... your existing styles ... */
      `}</style>
    </div>
  );
};

export default UserList;
