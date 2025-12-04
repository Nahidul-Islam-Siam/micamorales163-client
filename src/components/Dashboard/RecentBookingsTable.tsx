// components/dashboard/RecentBookingsTable.tsx
import { Card, Table, Dropdown, Button } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";

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

/** Props interface */
interface RecentBookingsTableProps {
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

// Mock data generation
const bookingData: BookingRecord[] = Array.from({ length: 12 }, (_, i) => ({
  key: i,
  id: 12345 + i,
  bookedBy: "Wilson Leon",
  email: "client009@gmail.com",
  className: "Signature Experiences",
  dateTime: "12/12/25 - 6:00pm",
  payment: ["Card", "Bank", "Credit"][i % 3] as BookingRecord["payment"],
}));

;

export default function RecentBookingsTable({
  currentPage,
  setCurrentPage,
}: RecentBookingsTableProps) {
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
    let fontWeight = 500;

    if (text === "Credit") {
      bgColor = "#4CAF50"; // Green
      textColor = "white";
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
      title: "Actions",
      key: "actions",
      width: 100,
      render: () => (
        <Dropdown
          menu={{
            items: [
              { key: "1", label: "View Details" },
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
  <Card
    className="custom-recent-bookings-card"
    title={
      <span style={{ fontSize: "18px", color: "#A7997D", fontWeight: "600" }}>
        Recent Bookings
      </span>
    }
    style={{
      borderRadius: "0",
      border: "none",
      backgroundColor: "transparent",
      overflow: "hidden",
    }}
    bodyStyle={{
      padding: 0,
      backgroundColor: "transparent",
    }}
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
        tableLayout="auto"
        bordered={false}
        style={{ marginTop: "20px" }}
      />
    </div>

    {/* --- Header Background & Style Override --- */}
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
    background-color: #D2D6D8 !important; /* Fixed typo: was ## */
    color: #333 !important;
    font-weight: 600 !important;
    border: 2px solid #D2D6D8 !important;
    padding: 16px 16px;
  }

  .custom-recent-bookings-card .ant-table-thead > tr:first-child > th:first-child {
    border-top-left-radius: 8px !important;
  }

  .custom-recent-bookings-card .ant-table-thead > tr:first-child > th:last-child {
    border-top-right-radius: 8px !important;
  }

  /* 👇 Pagination Text Color & Border */
  .custom-recent-bookings-card .ant-pagination-item-link,
  .custom-recent-bookings-card .ant-pagination-item a {
    color: #ff6f61 !important; /* Example: pink/red text for prev/next and numbers */
    border-color: #A7997D !important; /* Red border around items */
  }

  /* Style for active page */
  .custom-recent-bookings-card .ant-pagination-item-active {
    background-color: #A7997D !important;
    border-color: #A7997D !important;
  }

  .custom-recent-bookings-card .ant-pagination-item-active a {
    color: white !important; /* White text on active page */
  }

  /* Optional: change hover state */
  .custom-recent-bookings-card .ant-pagination-item:hover a,
  .custom-recent-bookings-card .ant-pagination-item-link:hover {
    color: black !important;
    border-color: black !important;
  }

  /* If you have "Previous" and "Next" buttons */
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
);
}