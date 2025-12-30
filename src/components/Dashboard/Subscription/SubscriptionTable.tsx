/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Table, Dropdown, Button, Spin, Alert } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useGetAllSubscriptionModelsQuery, useDeleteSubscriptionModelMutation } from "@/redux/service/subscription/subscriptionApi";

interface Subscription {
  key: string;
  id: string;
  title: string;
  numberOfClass: number | "Unlimited";
  numberOfCredit: number | "Unlimited";
  price: number;
  validity: string;
  type: string;
}

type TabKey = "membership" | "signature" | "event" | "unlimited";

const SubscriptionTable: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("membership");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const router = useRouter();

  // Fetch all data (small dataset)
  const { data, isLoading, isError, refetch } = useGetAllSubscriptionModelsQuery({
    page: 1,
    limit: 100, // safe since total is 11
  });

  const [deleteSubscription] = useDeleteSubscriptionModelMutation();

  const allSubscriptions = useMemo<Subscription[]>(() => {
    if (!data?.data?.result) return [];
    return data.data.result.map((item: any) => ({
      key: item.id,
      id: item.id,
      title: item.title,
      numberOfClass: item.classLimit === null ? "Unlimited" : item.classLimit,
      numberOfCredit: item.creditAmount === 0 && item.classLimit === null ? "Unlimited" : item.creditAmount,
      price: item.price,
      validity: `${item.validityTime} days`,
      type: item.type.toLowerCase(),
    }));
  }, [data]);

  // Filter by exact tab (including "unlimited")
  const filteredByTab = useMemo(() => {
    return allSubscriptions.filter((sub) => sub.type === activeTab);
  }, [allSubscriptions, activeTab]);

  const totalForTab = filteredByTab.length;

  // Paginate client-side
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredByTab.slice(start, start + pageSize);
  }, [filteredByTab, currentPage, pageSize]);

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
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const res = await deleteSubscription(record.id).unwrap();

        if (res.success) {
          await refetch();
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: res.message || "The subscription has been deleted.",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Deletion Failed",
            text: res.message || "Something went wrong.",
          });
        }
      } catch (error: any) {
        console.error("Delete error:", error);
        // Handle network errors or 4xx/5xx
        const message = error?.data?.message || "Failed to delete subscription.";
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: message,
        });
      }
    }
  });
};

  const columns = [
    {
      title: "ID",
      key: "index",
      render: (_: any, __: Subscription, index: number) => {
        return <span className="font-medium">{(currentPage - 1) * pageSize + index + 1}</span>;
      },
    },
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
      render: (price: number) => <span>${price.toFixed(2)}</span>,
    },
    { title: "Validity Time", dataIndex: "validity", key: "validity" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Subscription) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "edit",
                label: "Edit",
                onClick: () => {
                  router.push(`/dashboard/subscription/edit/${record.type}/${record.id}`);
                },
              },
              {
                key: "delete",
                label: "Delete",
                danger: true,
                onClick: () => handleDelete(record),
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
      <div className="p-6 flex justify-center items-center h-64">
        <Spin size="default" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert
          message="Failed to load subscriptions"
          description="Please try again later."
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => refetch()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-6 custom-recent-bookings-card">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Subscription List</h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          {([
            ["membership", "Membership"],
            ["signature", "Signature Experience"],
            ["event", "Event"],
            ["unlimited", "Unlimited"],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleTabChange(key as TabKey)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === key
                  ? "bg-[#A7997D] text-white border border-[#A7997D]"
                  : "text-[#A7997D] border border-[#A7997D] hover:bg-gray-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <Button
          href="/dashboard/subscription/add-subscription"
          className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-1 rounded-lg text-sm font-medium"
        >
          + Add Subscription
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table
          dataSource={paginatedData}
          columns={columns}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalForTab, // ✅ critical: total per tab
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
            position: ["bottomRight"],
            // Ant Design automatically disables "Next" when total <= current * pageSize
          }}
          rowClassName="hover:bg-gray-50"
          scroll={{ x: "max-content" }}
          className="w-full"
          locale={{ emptyText: "No subscriptions found for this category." }}
        />
      </div>

      <style jsx global>{`
        /* Your global styles here */
      `}</style>
    </div>
  );
};

export default SubscriptionTable;