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
          Draft: {
            bg: "#A7997D40",
            color: "#4E4E4A",
            border: "#A7997D",
          },
          Publish: {
            bg: "#4CAF5020",
            color: "#4CAF50",
            border: "#4CAF50",
          },
          Upcoming: {
            bg: "#FF980020",
            color: "#FF9800",
            border: "#FF9800",
          },
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
                danger: true,
                onClick: () => console.log("Delete clicked"),
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

  return (
    <>
      <Card
        style={{ border: "none", backgroundColor: "transparent" }}
        bodyStyle={{ padding: 0 }}
      >
        {/* ---------- HEADER ---------- */}
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

            {/* Add Listing */}
            <Button
              className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-1 rounded-full text-sm font-medium"
          href="/dashboard/my-listing/add-membership-class"
            >
              + Add Member Ship Class
            </Button>
          </div>
        </div>

        {/* ---------- TABLE ---------- */}
        <div className="bg-white rounded-lg shadow-sm">
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
              itemRender: (current, type, original) => {
                if (type === "prev")
                  return (
                    <Button type="text">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="24"
                        viewBox="0 0 12 24"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M1.84306 12.711L7.50006 18.368L8.91406 16.954L3.96406 12.004L8.91406 7.054L7.50006 5.64L1.84306 11.297C1.65559 11.4845 1.55028 11.7388 1.55028 12.004C1.55028 12.2692 1.65559 12.5235 1.84306 12.711Z"
                          fill="#4E4E4A"
                        />
                      </svg>
                    </Button>
                  );
                if (type === "next")
                  return (
                    <Button type="text">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="24"
                        viewBox="0 0 12 24"
                        fill="none"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M10.1569 12.711L4.49994 18.368L3.08594 16.954L8.03594 12.004L3.08594 7.054L4.49994 5.64L10.1569 11.297C10.3444 11.4845 10.4497 11.7388 10.4497 12.004C10.4497 12.2692 10.3444 12.5235 10.1569 12.711Z"
                          fill="#4E4E4A"
                        />
                      </svg>
                    </Button>
                  );
                if (type === "page")
                  return (
                    <Button
                      type={current === currentPage ? "primary" : "text"}
                      className={`px-3 py-1 rounded mx-1 ${
                        current === currentPage
                          ? "bg-[#A7997D] text-white"
                          : "text-[#4E4E4A]"
                      }`}
                    >
                      {current}
                    </Button>
                  );

                return original;
              },
            }}
            scroll={{ x: 800 }}
          />
        </div>
      </Card>

      {/* ---------- MODAL ---------- */}
      <Modal
        title="Listing Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={600}
      >
        {selectedListing && (
          <div className="p-5 space-y-4">
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
                <div className="text-sm text-gray-500">
                  ID: {selectedListing.id}
                </div>
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

            {/* Status */}
            <div className="flex justify-between text-gray-700">
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
