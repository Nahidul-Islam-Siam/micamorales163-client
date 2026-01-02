/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Form, Input, Button, Select, Upload, InputNumber, message, Spin } from "antd";
import { UploadOutlined, PlusOutlined, CalendarOutlined, CloseOutlined } from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { 
  useGetClassOfferingByIdQuery, 
  useUpdateClassOfferingByIdMutation 
} from "@/redux/service/userprofile/mylisting";
import Swal from "sweetalert2";
import DateTimePickerModal from "@/components/Dashboard/MyBooking/DateTimePickerModal";

dayjs.extend(utc);

// ✅ Convert 12h → 24h (for modal output)
const convert12hTo24h = (time12h: string): string => {
  if (!time12h) return "00:00";
  let normalized = time12h.trim().toLowerCase();
  normalized = normalized.replace(/:(\d)([ap]m)/, ":0$1$2");
  const match = normalized.match(/(\d{1,2}):(\d{2})([ap]m)/);
  if (!match) return "00:00";

  const [, hourStr, minute, period] = match;
  let hour = parseInt(hourStr, 10);
  if (hour < 1 || hour > 12) return "00:00";

  if (period === "am") {
    if (hour === 12) hour = 0;
  } else {
    if (hour !== 12) hour += 12;
  }

  return `${hour.toString().padStart(2, "0")}:${minute}`;
};

// ✅ Extract HH:mm from ISO datetime (for prefilling)
const extractTimeFromISO = (isoString: string): string => {
  if (!isoString) return "00:00";
  const date = new Date(isoString);
  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

// ✅ Convert minutes to duration string
const getDurationString = (minutes: number): string => {
  switch (minutes) {
    case 30: return "30min";
    case 60: return "1hour";
    case 75: return "1.25hour"; // Added for your example
    case 90: return "1.5hour";
    case 120: return "2hours";
    case 150: return "2.5hour";
    default: return "1hour";
  }
};

// Interfaces
interface BackendTimeSlot {
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  maxSpace?: number;
}

interface BackendSchedule {
  dateTime: string; // ISO date
  classTimeSlot: BackendTimeSlot[];
}

interface FormSchedule {
  id: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
}

export default function EditEventClassForm() {
  const { id } = useParams();
  const classId = Array.isArray(id) ? id[0] : id;
  
  const { data: classTypeDetails, isLoading: isFetching } = useGetClassOfferingByIdQuery(classId as string);
  const [form] = Form.useForm();
  const [schedules, setSchedules] = useState<FormSchedule[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const nextId = useRef(0);
  
  const [updateClassOffering, { isLoading, isSuccess, isError, error }] = useUpdateClassOfferingByIdMutation();

  // ✅ Prefill form when data loads
  useEffect(() => {
    if (classTypeDetails?.data && classId) {
      const offering = classTypeDetails.data;
      
      // Set form values
      form.setFieldsValue({
        className: offering.name,
        shortDescription: offering.description,
        instructorName: offering.instructorName,
        instructorDescription: offering.instructorDescription,
        classPrice: offering.price,
        duration: getDurationString(offering.durationMinutes),
        space: offering.maxSpace,
        detailsDescription: offering.detailsDescription,
        // Note: File uploads can't be prefilled
      });

      // Reconstruct schedules
      const scheduleList: FormSchedule[] = [];
      offering.schedules.forEach((schedule: any) => {
        const dateStr = dayjs(schedule.dateTime).format("YYYY-MM-DD");
        schedule.classTimeSlot.forEach((slot: any) => {
          scheduleList.push({
            id: `prefill-${nextId.current++}`,
            date: dateStr,
            startTime: extractTimeFromISO(slot.startTime),
            endTime: extractTimeFromISO(slot.endTime),
          });
        });
      });
      setSchedules(scheduleList);
    }
  }, [classTypeDetails, classId, form]);

  useEffect(() => {
    if (isSuccess) {
      message.success("Class updated successfully!");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      console.error("Update error:", error);
      message.error("Failed to update class.");
    }
  }, [isError, error]);

  const handleAddSchedule = () => {
    setModalVisible(true);
  };

  const handleModalConfirm = (selectedSchedules: Array<{ date: Date; slots: any[] }>) => {
    const newSchedules: FormSchedule[] = [];
    selectedSchedules.forEach((item) => {
      const dateStr = dayjs(item.date).format("YYYY-MM-DD");
      item.slots.forEach((slot) => {
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
      "1.25hour": 75, // Added
      "1.5hour": 90,
      "2hours": 120,
      "2.5hour": 150,
    };
    return map[duration] || 60;
  };

  const handlePublish = async () => {
    if (!classId) {
      message.error("Class ID not found");
      return;
    }

    try {
      const values = await form.validateFields();

      const scheduleMap: Record<string, BackendTimeSlot[]> = {};
      schedules.forEach((s) => {
        if (!scheduleMap[s.date]) {
          scheduleMap[s.date] = [];
        }
        scheduleMap[s.date].push({
          startTime: s.startTime,
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
        // Preserve original type from fetched data
        type: classTypeDetails?.data?.type || "MEMBERSHIP",
        price: values.classPrice,
        durationMinutes: convertDurationToMinutes(values.duration),
        maxSpace: values.space || 18,
        detailsDescription: values.detailsDescription,
        schedules: backendSchedules,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));

      // Handle file uploads (only if new files selected)
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

      const result = await updateClassOffering({ id: classId as string, formData }).unwrap();
      if (result.success) {
        Swal.fire("Success", result.message || "Class updated successfully", "success");
      } else {
        Swal.fire("Error", result.message || "Failed to update class", "error");
      }
    } catch (validationError) {
      console.error("Validation failed:", validationError);
      message.error("Please fill all required fields correctly.");
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

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
                  <p className="text-gray-600">Click to upload image (optional)</p>
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
                <Select.Option value="1.25hour">1 hour 15 minutes</Select.Option>
                <Select.Option value="1.5hour">1.5 hours</Select.Option>
                <Select.Option value="2hours">2 hours</Select.Option>
                <Select.Option value="2.5hour">2.5 hours</Select.Option>
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
                <p className="text-gray-600">Click to upload images (optional)</p>
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
            onClick={() => window.history.back()}
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
            {isLoading ? "Updating..." : "Update"}
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