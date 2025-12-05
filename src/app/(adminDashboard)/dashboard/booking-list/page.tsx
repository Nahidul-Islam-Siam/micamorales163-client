/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  Table,
  Dropdown,
  Button,
  Modal,
  Typography,
  Col,
  Form,
  Input,
  Row,
  Select,
  DatePicker,

} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useState } from "react";
import moment from "moment";

const { Text } = Typography;

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

// Mock data
const bookingData: BookingRecord[] = Array.from({ length: 12 }, (_, i) => ({
  key: i,
  id: 12345 + i,
  bookedBy: "Wilson Leon",
  email: "client009@gmail.com",
  className: "Signature Experiences",
  dateTime: "12/12/25 - 6:00pm",
  payment: ["Card", "Bank", "Credit"][i % 3] as BookingRecord["payment"],
}));

/** Add Modal Props */
interface AddAppointmentModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: {
    patientName: string;
    contact: string;
    email: string;
    class: string;
    note?: string;
    appointmentDateTime?: moment.Moment | null;
  }) => void;
}

const AddAppointmentModal = ({
  visible,
  onCancel,
  onOk,
}: AddAppointmentModalProps) => {
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedTime, setSelectedTime] = useState<moment.Moment | null>(null);

  const handleDateChange = (date: moment.Moment | null) => {
    setSelectedDate(date);
  };

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        let appointmentDateTime: moment.Moment | null = null;

        if (selectedDate && selectedTime) {
          appointmentDateTime = selectedDate.clone().set({
            hour: selectedTime.hour(),
            minute: selectedTime.minute(),
          });
        }

        onOk({
          ...values,
          appointmentDateTime,
        });
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title="Add an Appointment"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          style={{ backgroundColor: "#A68D70", borderColor: "#A68D70" }}
        >
          Add To Booking
        </Button>,
      ]}
      centered
      width={800}
    >
      <Form form={form} layout="vertical">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="Patient Name"
              name="patientName"
              rules={[{ required: true, message: "Please enter patient name" }]}
            >
              <Input placeholder="e.g emily" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Contact"
              name="contact"
              rules={[{ required: true, message: "Please enter contact number" }]}
            >
              <Input placeholder="e.g +12 1245 1524" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item
              label="EMAIL"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
          </Col>

          <Col xs={24} sm={12}>
            <Form.Item
              label="Class"
              name="class"
              rules={[{ required: true, message: "Please select a class" }]}
            >
              <Select placeholder="Hot Yoga">
                <Select.Option value="hotYoga">Hot Yoga</Select.Option>
                <Select.Option value="vinyasa">Vinyasa</Select.Option>
                <Select.Option value="hatha">Hatha</Select.Option>
                <Select.Option value="power">Power Yoga</Select.Option>
                <Select.Option value="restorative">Restorative</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Note" name="note">
          <Input.TextArea placeholder="Write note here" rows={3} />
        </Form.Item>

        <Form.Item label="Select Date and Time">
          <div
            style={{
              border: "1px solid #d9d9d9",
              borderRadius: "8px",
              padding: "16px",
              background: "#fafafa",
            }}
          >
            <Row gutter={[16, 16]} align="top">
              <Col xs={24} md={12}>
                <DatePicker
                  onChange={handleDateChange}
                  value={selectedDate}
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  disabledDate={(current) =>
                    current ? current < moment().startOf("day") : false
                  }
                />
              </Col>

              <Col xs={24} md={12}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {[
                    "07:00am",
                    "07:30am",
                    "08:00am",
                    "08:30am",
                    "09:00am",
                    "09:30am",
                    "10:00am",
                    "10:30am",
                    "11:00am",
                    "11:30am",
                    "12:00pm",
                    "12:30pm",
                  ].map((time) => {
                    const isSelected = selectedTime?.format("hh:mm a") === time;
                    return (
                      <Button
                        key={time}
                        type={isSelected ? "primary" : "default"}
                        onClick={() =>
                          setSelectedTime(moment(time, "hh:mm a"))
                        }
                        style={{
                          width: "calc(50% - 4px)",
                          ...(isSelected
                            ? {
                                backgroundColor: "#A68D70",
                                borderColor: "#A68D70",
                              }
                            : {}),
                        }}
                      >
                        {time}
                      </Button>
                    );
                  })}
                </div>
              </Col>
            </Row>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default function BookingListTable() {
  // ⬇️ FIX: Local pagination state (NOT props)
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(
    null
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const showBookingDetails = (record: BookingRecord) => {
    setSelectedBooking(record);
    setIsModalVisible(true);
  };

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

        if (text === "Credit") {
          bgColor = "#4CAF50";
          textColor = "white";
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
    <>
      <Card
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                color: "#A7997D",
                fontWeight: "600",
              }}
            >
              Recent Bookings
            </span>

            <button
              className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-2 rounded-[14px] text-sm font-medium"
              onClick={() => setIsAddModalVisible(true)}
            >
              + Add Booking
            </button>
          </div>
        }
        style={{ border: "none", backgroundColor: "transparent" }}
        bodyStyle={{ padding: 0 }}
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
            style={{ marginTop: "20px" }}
          />
        </div>
      </Card>

      {/* View Booking Details Modal */}
      <Modal
        title="Booking Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        width={600}
      >
        {selectedBooking && (
          <div style={{ padding: "20px", lineHeight: "2" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Booking ID</Text>
              <Text>{selectedBooking.id}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Booked By</Text>
              <Text>{selectedBooking.bookedBy}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Email</Text>
              <Text>{selectedBooking.email}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Last Class Name</Text>
              <Text>{selectedBooking.className}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Date & Time</Text>
              <Text>{selectedBooking.dateTime}</Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Payment</Text>
              <span
                style={{
                  backgroundColor:
                    selectedBooking.payment === "Credit"
                      ? "#4CAF50"
                      : "#A7997D40",
                  color:
                    selectedBooking.payment === "Credit" ? "white" : "#4E4E4A",
                  padding: "4px 8px",
                  borderRadius: "20px",
                }}
              >
                {selectedBooking.payment}
              </span>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Appointment Modal */}
      <AddAppointmentModal
        visible={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={(values) => {
          console.log("New Appointment Data:", values);
          setIsAddModalVisible(false);
        }}
      />
    </>
  );
}
