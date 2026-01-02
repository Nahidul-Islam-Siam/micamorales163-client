/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Form, Input, Button, Select, Upload, InputNumber, message } from "antd";
import { UploadOutlined, PlusOutlined, CalendarOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import DateTimePickerModal from "./DateTimePickerModal";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { useCreateClassOfferingMutation } from "@/redux/service/userprofile/mylisting";
import Swal from "sweetalert2";


dayjs.extend(utc);

// ✅ ADD: Convert 12h time (e.g., "6:01am", "12:01pm") → 24h ("06:01", "12:01")
const convert12hTo24h = (time12h: string): string => {
  if (!time12h) return "00:00";

  // Normalize: "6:1am" → "06:01am", "12:1pm" → "12:01pm"
  let normalized = time12h.trim().toLowerCase();

  // Ensure minutes are 2 digits
  normalized = normalized.replace(/:(\d)([ap]m)/, ":0$1$2");
  // Ensure hour is 1-2 digits (we'll parse it anyway)

  const match = normalized.match(/(\d{1,2}):(\d{2})([ap]m)/);
  if (!match) {
    console.warn("Failed to parse time:", time12h);
    return "00:00";
  }

  const [, hourStr, minute, period] = match;
  let hour = parseInt(hourStr, 10);

  // Validate
  if (hour < 1 || hour > 12 || minute < "00" || minute > "59") {
    return "00:00";
  }

  if (period === "am") {
    if (hour === 12) hour = 0; // 12am → 00
  } else {
    if (hour !== 12) hour += 12; // 1pm → 13, ..., 11pm → 23
  }

  return `${hour.toString().padStart(2, "0")}:${minute}`;
};

// Interfaces
interface BackendTimeSlot {
  startTime: string;
  endTime: string;
  maxSpace?: number;
}

interface BackendSchedule {
  dateTime: string;
  classTimeSlot: BackendTimeSlot[];
}

interface FormSchedule {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

export default function MembershipClassForm() {
  const [form] = Form.useForm();
  const [schedules, setSchedules] = useState<FormSchedule[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const nextId = useRef(0);

  const [createClassOffering, { isLoading, isSuccess, isError, error }] = useCreateClassOfferingMutation();

  useEffect(() => {
    if (isSuccess) {
      message.success("Class offering published successfully!");
      form.resetFields();
      setSchedules([]);
    }
  }, [isSuccess, form]);

  useEffect(() => {
    if (isError) {
      console.error("API Error:", error);
      message.error("Failed to publish class. Please try again.");
    }
  }, [isError, error]);

  const handleAddSchedule = () => {
    setModalVisible(true);
  };

  // ✅ UPDATED: Convert 12h → 24h here
  const handleModalConfirm = (selectedSchedules: Array<{ date: Date; slots: any[] }>) => {
    const newSchedules: FormSchedule[] = [];

    selectedSchedules.forEach((item) => {
      const dateStr = dayjs(item.date).format("YYYY-MM-DD");
      item.slots.forEach((slot) => {
        // 🔥 Convert to 24h format before storing
        const startTime24 = convert12hTo24h(slot.startTime);
        const endTime24 = convert12hTo24h(slot.endTime);

        newSchedules.push({
          id: `schedule-${nextId.current++}`,
          date: dateStr,
          startTime: startTime24,
          endTime: endTime24,
        });
      });
    });

    setSchedules((prev) => [...prev, ...newSchedules]);
    setModalVisible(false);
  };

  const handleRemoveSchedule = (id: string) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };

  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format("MM/DD/YYYY");
  };

  const convertDurationToMinutes = (duration: string): number => {
    const map: Record<string, number> = {
      "30min": 30,
      "1hour": 60,
      "1.5hour": 90,
      "2hours": 120,
    };
    return map[duration] || 60;
  };

  const handlePublish = async () => {
    try {
      const values = await form.validateFields();

      const scheduleMap: Record<string, BackendTimeSlot[]> = {};
      schedules.forEach((s) => {
        if (!scheduleMap[s.date]) {
          scheduleMap[s.date] = [];
        }
        scheduleMap[s.date].push({
          startTime: s.startTime, // ✅ Already 24h
          endTime: s.endTime,
          maxSpace: values.space || 18,
        });
      });

      const backendSchedules: BackendSchedule[] = Object.entries(scheduleMap).map(
        ([dateStr, slots]) => ({
          dateTime: dayjs(dateStr).utc().startOf("day").toISOString(),
          classTimeSlot: slots,
        })
      );

      const payload = {
        name: values.className,
        description: values.shortDescription,
        instructorName: values.instructorName,
        instructorDescription: values.instructorDescription,
        type: "MEMBERSHIP" as const,
        price: values.classPrice,
        durationMinutes: convertDurationToMinutes(values.duration),
        maxSpace: values.space || 18,
        detailsDescription: values.detailsDescription,
        schedules: backendSchedules,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      const instructorFile = values.instructorImage?.fileList?.[0]?.originFileObj;
      if (instructorFile) {
        formData.append("instructorImage", instructorFile);
      }

      const classImages = values.classImages?.fileList || [];
      classImages.forEach((file: any) => {
        if (file.originFileObj) {
          formData.append("class_image", file.originFileObj);
        }
      });

    const response =  await createClassOffering(formData).unwrap();

    if(response.success) {
      Swal.fire("Success", response?.message || "Class created successfully", "success");
     setSchedules([]);
     form.resetFields(); 
    }else {
      Swal.fire("Error", (response?.message || "Failed to create class. Please try again."), "error");
    }
    } catch (validationError) {
      console.error("Validation failed:", validationError);
      message.error("Please fill all required fields correctly.");
    }
  };

  return (
    <>
      <Form form={form} layout="vertical" className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <Form.Item
              label="Class Name"
              name="className"
              rules={[{ required: true, message: "Please enter class name" }]}
            >
              <Input
                placeholder="Enter class name"
                className="h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
              />
            </Form.Item>

            <Form.Item
              label="Short Description"
              name="shortDescription"
              rules={[{ required: true, message: "Please enter short description" }]}
            >
              <Input.TextArea
                placeholder="Enter class short description"
                rows={2}
                className="rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
              />
            </Form.Item>

            <Form.Item
              label="Instructor Name"
              name="instructorName"
              rules={[{ required: true, message: "Please enter instructor name" }]}
            >
              <Input
                placeholder="Enter instructor name"
                className="h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
              />
            </Form.Item>

            <Form.Item label="Instructor Description" name="instructorDescription">
              <Input.TextArea
                placeholder="Enter instructor description"
                rows={2}
                className="rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
              />
            </Form.Item>

            <Form.Item label="Instructor Image" name="instructorImage">
              <Upload.Dragger
                maxCount={1}
                beforeUpload={() => false}
                className="p-6"
              >
                <div className="flex flex-col items-center justify-center py-6">
                  <UploadOutlined className="text-3xl text-gray-400 mb-2" />
                  <p className="text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                </div>
              </Upload.Dragger>
            </Form.Item>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Duration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Form.Item
              label="Class Price"
              name="classPrice"
              rules={[{ required: true, message: "Please enter class price" }]}
            >
              <InputNumber
                prefix="$"
                placeholder="Enter price"
                className="w-full h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
                min={0}
                precision={2}
              />
            </Form.Item>

            <Form.Item
              label="Duration"
              name="duration"
              rules={[{ required: true, message: "Please select duration" }]}
            >
              <Select placeholder="Select duration">
                <Select.Option value="30min">30 minutes</Select.Option>
                <Select.Option value="1hour">1 hour</Select.Option>
                <Select.Option value="1.5hour">1.5 hours</Select.Option>
                <Select.Option value="2hours">2 hours</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Space" name="space">
              <InputNumber
                placeholder="Enter number of spaces"
                className="w-full h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
                min={0}
                defaultValue={18}
              />
            </Form.Item>
          </div>
        </div>

        {/* Date & Time Selection */}
        <div className="space-y-4">
          <div
            onClick={handleAddSchedule}
            className="flex items-center justify-between px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#A7997D] transition-colors"
          >
            <div className="flex items-center text-gray-500">
              <CalendarOutlined className="text-lg mr-2" />
              <span>Select Date & Time</span>
            </div>
            <PlusOutlined className="text-[#A7997D]" />
          </div>

          {schedules.length > 0 && (
            <div className="flex flex-wrap gap-2 py-1 overflow-x-auto max-h-20 scrollbar-hide">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full border border-gray-200 text-sm font-medium text-gray-900 whitespace-nowrap"
                >
                  <CalendarOutlined className="text-xs text-gray-500" />
                  <span>{formatDate(schedule.date)}</span>
                  <span className="text-gray-600">•</span>
                  <span>
                    {schedule.startTime} to {schedule.endTime}
                  </span>
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<CloseOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSchedule(schedule.id);
                    }}
                    className="ml-1 p-0 h-auto"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Class Images</h2>
          <Form.Item name="classImages">
            <Upload.Dragger
              multiple
              beforeUpload={() => false}
              className="p-6"
            >
              <div className="flex flex-col items-center justify-center py-6">
                <UploadOutlined className="text-3xl text-gray-400 mb-2" />
                <p className="text-gray-600">Click to upload images</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 10MB each</p>
              </div>
            </Upload.Dragger>
          </Form.Item>
        </div>

        {/* Details Description Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Details Description</h2>
          <Form.Item
            name="detailsDescription"
            rules={[{ required: true, message: "Please enter details description" }]}
          >
            <Input.TextArea
              placeholder="Enter detailed class description"
              rows={4}
              className="rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
            />
          </Form.Item>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pb-8">
          <Button
            size="large"
            className="px-8 rounded-lg"
            onClick={() => {
              form.resetFields();
              setSchedules([]);
            }}
          >
            Cancel
          </Button>
          <Button
            size="large"
            className="px-8 rounded-lg"
            onClick={() => {
              message.info("Draft saved!");
            }}
          >
            Save As Draft
          </Button>
          <Button
            type="primary"
            size="large"
            loading={isLoading}
            className="px-8 rounded-lg bg-[#A7997D] hover:bg-[#8d7c68]"
            onClick={handlePublish}
            disabled={isLoading}
          >
            {isLoading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </Form>

      <DateTimePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleModalConfirm}
      />
    </>
  );
}