/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  Table,
  Dropdown,
  Button,
  Modal,
  Typography,
  Input,
  Tag,
} from "antd";
import { EllipsisOutlined, SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import imageUrl from "@/assets/table/r.png";
import Swal from "sweetalert2";

const { Text } = Typography;

/** -------- INTERFACE ---------- **/
interface ListingRecord {
  key: number;
  id: number;
  className: string;
  instructor: string;
  space: number;
  remainingSpace: number;
  booked: number;
  status: "Draft" | "Publish" | "Upcoming";
  image: string | StaticImageData;
}

/** -------- MOCK DATA ---------- **/
const listingData: ListingRecord[] = Array.from({ length: 6 }, (_, i) => ({
  key: i,
  id: 1819238388 + i,
  className: "Soul Pack",
  instructor: "Micaela Morales",
  space: 12,
  remainingSpace: i % 2 === 0 ? 6 : 0,
  booked: i % 2 === 0 ? 6 : 12,
  status: i % 3 === 0 ? "Draft" : i % 3 === 1 ? "Publish" : "Upcoming",
  image: imageUrl,
}));

/** -------- MAIN COMPONENT ---------- **/
export default function MyListingTable() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedListing, setSelectedListing] = useState<ListingRecord | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const showListingDetails = (record: ListingRecord): void => {
    setSelectedListing(record);
    setIsModalVisible(true);
  };

  const handleDelete = (record: any): void => {
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
        console.log("Deleting record:", record.id);

        // Optionally show success message
        Swal.fire("Deleted!", "The record has been deleted.", "success");
      }
    });
  };

  /** -------- FILTERING ---------- **/
  const filteredData = listingData.filter((item) => {
    const matchesFilter =
      activeFilter === "All" || item.status === activeFilter;
    const matchesSearch =
      item.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  /** -------- TABLE COLUMNS ---------- **/
  const listingColumns = [
    {
      title: "Class Name",
      dataIndex: "className",
      key: "className",
      width: 200,
      render: (_text: string, record: ListingRecord) => (
        <div className="flex items-center gap-2">
          <Image
            width={50}
            height={50}
            src={record.image}
            alt={record.className}
            className="w-12 h-12 rounded object-cover"
          />
          <div>
            <div className="font-medium text-gray-800">{record.className}</div>
            <div className="text-xs text-gray-500">ID: {record.id}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Instructor",
      dataIndex: "instructor",
      key: "instructor",
      width: 150,
      render: (text: string) => (
        <span className="text-gray-700 text-sm">{text}</span>
      ),
    },
    {
      title: "Space",
      dataIndex: "space",
      key: "space",
      width: 80,
      render: (text: number) => (
        <span className="text-gray-700 text-sm">{text}</span>
      ),
    },
    {
      title: "Remaining Space",
      dataIndex: "remainingSpace",
      key: "remainingSpace",
      width: 120,
      render: (text: number) => (
        <span
          className={`text-sm ${
            text === 0 ? "text-red-500" : "text-green-600"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Booked",
      dataIndex: "booked",
      key: "booked",
      width: 80,
      render: (text: number) => (
        <span className="text-gray-700 text-sm">{text}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: ListingRecord["status"]) => {
        const styles = {
          Draft: { bg: "#A7997D40", color: "#4E4E4A", border: "#A7997D" },
          Publish: { bg: "#4CAF5020", color: "#4CAF50", border: "#4CAF50" },
          Upcoming: { bg: "#FF980020", color: "#FF9800", border: "#FF9800" },
        };
        const s = styles[status];

        return (
          <Tag
            style={{
              backgroundColor: s.bg,
              border: `1px solid ${s.border}`,
              color: s.color,
              fontWeight: 500,
              fontSize: "12px",
              padding: "2px 8px",
              borderRadius: "16px",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_: any, record: ListingRecord) => (
        <Dropdown
          menu={{
            items: [
              {
                key: "1",
                label: "Edit",
                onClick: () => console.log("Edit clicked"),
              },
              {
                key: "2",
                label: "Details",
                onClick: () => showListingDetails(record),
              },
              {
                key: "3",
                label: "Delete",
                onClick: () => handleDelete(record),
              },
            ],
          }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button type="text" icon={<EllipsisOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <>
      {/* Main Container */}
      <Card
        className="custom-my-listing-table"
        bordered={false}
        style={{ backgroundColor: "transparent", border: "none" }}
        bodyStyle={{ padding: 0 }}
      >
        {/* Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-[#4E4E4A]">My Listing</h2>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search */}
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 rounded-[14px] border border-gray-300"
            />

            {/* Filters */}
            <div className="flex gap-2">
              {["All", "Membership", "Signature Experience", "Event"].map(
                (filter) => (
                  <Button
                    key={filter}
                    type={activeFilter === filter ? "primary" : "default"}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-1 rounded-full text-sm ${
                      activeFilter === filter
                        ? "bg-[#A7997D] text-white"
                        : "border border-[#A7997D] text-[#A7997D]"
                    }`}
                  >
                    {filter}
                  </Button>
                )
              )}
            </div>

            {/* Add Class */}
            <Button
              href="/dashboard/my-listing/add-membership-class"
              className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-1 rounded-full text-sm font-medium"
            >
              + Add Member Ship Class
            </Button>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto">
          <Table
            columns={listingColumns}
            dataSource={filteredData}
            pagination={{
              current: currentPage,
              pageSize: 5,
              total: filteredData.length,
              onChange: setCurrentPage,
              showSizeChanger: false,
              position: ["bottomRight"],
              hideOnSinglePage: true,
            }}
            scroll={{ x: 800 }}
          />
        </div>

        {/* --- Global Styles (Copied from RecentBookingsTable) --- */}
        <style jsx global>{`
          .custom-my-listing-table .ant-card-head {
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

          .custom-my-listing-table .ant-card-head-title {
            color: #a7997d !important;
            font-weight: 600 !important;
            font-size: 18px !important;
          }

          /* Table Header */
          .custom-my-listing-table .ant-table-thead > tr > th {
            background-color: #d2d6d8 !important;
            color: #333 !important;
            font-weight: 600 !important;
            border: 2px solid #d2d6d8 !important;
            padding: 16px !important;
          }

          .custom-my-listing-table
            .ant-table-thead
            > tr:first-child
            > th:first-child {
            border-top-left-radius: 8px !important;
          }

          .custom-my-listing-table
            .ant-table-thead
            > tr:first-child
            > th:last-child {
            border-top-right-radius: 8px !important;
          }

          /* Pagination Styling */
          .custom-my-listing-table .ant-pagination-item-link,
          .custom-my-listing-table .ant-pagination-item a {
            color: black !important;
            border-color: #a7997d !important;
          }

          .custom-my-listing-table .ant-pagination-item-active {
            background-color: #a7997d !important;
            border-color: #a7997d !important;
          }

          .custom-my-listing-table .ant-pagination-item-active a {
            color: white !important;
          }

          .custom-my-listing-table .ant-pagination-item:hover a,
          .custom-my-listing-table .ant-pagination-item-link:hover {
            color: #5e5e5e !important;
            border-color: #5e5e5e !important;
          }

          .custom-my-listing-table .ant-pagination-prev a,
          .custom-my-listing-table .ant-pagination-next a {
            color: black !important;
          }

          .custom-my-listing-table .ant-pagination-prev button:disabled,
          .custom-my-listing-table .ant-pagination-next button:disabled {
            border-color: #ddd !important;
            color: #ccc !important;
          }
        `}</style>
      </Card>

      {/* Details Modal */}
      <Modal
        title="Listing Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={600}
        styles={{
          header: { textAlign: "center" },
        }}
      >
        {selectedListing && (
          <div className="p-5 space-y-4 text-sm">
            <div className="flex items-center gap-4">
              <Image
                width={64}
                height={64}
                src={selectedListing.image}
                alt={selectedListing.className}
                className="w-16 h-16 rounded object-cover"
              />
              <div>
                <Text strong>{selectedListing.className}</Text>
                <div className="text-gray-500">ID: {selectedListing.id}</div>
              </div>
            </div>

            {[
              ["Instructor", selectedListing.instructor],
              ["Space", selectedListing.space],
              ["Remaining Space", selectedListing.remainingSpace],
              ["Booked", selectedListing.booked],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between text-gray-700">
                <Text strong>{label}</Text>
                <Text>{value}</Text>
              </div>
            ))}

            <div className="flex justify-between">
              <Text strong>Status</Text>
              <Tag
                style={{
                  backgroundColor:
                    selectedListing.status === "Publish"
                      ? "#4CAF5020"
                      : selectedListing.status === "Upcoming"
                      ? "#FF980020"
                      : "#A7997D40",
                  color:
                    selectedListing.status === "Publish"
                      ? "#4CAF50"
                      : selectedListing.status === "Upcoming"
                      ? "#FF9800"
                      : "#4E4E4A",
                  border:
                    selectedListing.status === "Publish"
                      ? "1px solid #4CAF50"
                      : selectedListing.status === "Upcoming"
                      ? "1px solid #FF9800"
                      : "1px solid #A7997D",
                  borderRadius: "16px",
                  padding: "2px 8px",
                  fontSize: "12px",
                }}
              >
                {selectedListing.status}
              </Tag>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
