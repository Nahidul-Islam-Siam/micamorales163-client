/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Form, Input, Button, Select, Upload, InputNumber, DatePicker, TimePicker, Checkbox } from "antd";
import { UploadOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function EventForm() {
  const [form] = Form.useForm();
  const [timeSlots, setTimeSlots] = useState<any[]>([]);

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, { id: Date.now() }]);
  };

  const handleRemoveTimeSlot = (id: number) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
  };

  const handlePublish = () => {
    form.validateFields().then((values) => {
      console.log("Event submitted:", values);
    });
  };

  return (
    <Form form={form} layout="vertical" className="space-y-6">
      {/* Basic Information Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

        {/* Category Toggles */}
        <div className="mb-6 flex items-center gap-6">
          <Form.Item name="category" valuePropName="checked" noStyle>
            <Checkbox
              defaultChecked
              className="font-medium text-gray-700"
            >
              Events of the Season
            </Checkbox>
          </Form.Item>
          <Form.Item name="celebrationPackage" valuePropName="checked" noStyle>
            <Checkbox className="font-medium text-gray-700">
              Celebration in Lumica Packages
            </Checkbox>
          </Form.Item>
          <Form.Item name="upcomingEvents" valuePropName="checked" noStyle>
            <Checkbox className="font-medium text-gray-700">
              Upcoming Events
            </Checkbox>
          </Form.Item>
        </div>

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
            rules={[
              { required: true, message: "Please enter short description" },
            ]}
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
            rules={[
              { required: true, message: "Please enter instructor name" },
            ]}
          >
            <Input
              placeholder="Enter instructor name"
              className="h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
            />
          </Form.Item>

          <Form.Item
            label="Instructor Description"
            name="instructorDescription"
          >
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
            rules={[
              { required: true, message: "Please enter class price" },
            ]}
          >
            <InputNumber
              prefix="$"
              placeholder="Enter price"
              className="w-full h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
              min={0}
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
            />
          </Form.Item>
        </div>
      </div>

      {/* Schedule Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Select Date & Time</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddTimeSlot}
            className="bg-[#A7997D] hover:bg-[#8d7c68]"
          >
            Add Slot
          </Button>
        </div>

        {timeSlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <p>No time slots added yet</p>
            <p className="text-sm">Click “Add Slot” to create a schedule</p>
          </div>
        ) : (
          <div className="space-y-4">
            {timeSlots.map((slot, index) => (
              <div
                key={slot.id}
                className="flex gap-4 items-end pb-4 border-b border-gray-200"
              >
                <Form.Item
                  label="Date"
                  name={["timeSlots", index, "date"]}
                  className="flex-1 mb-0"
                >
                  <DatePicker className="w-full h-10" />
                </Form.Item>
                <Form.Item
                  label="Start Time"
                  name={["timeSlots", index, "startTime"]}
                  className="flex-1 mb-0"
                >
                  <TimePicker className="w-full h-10" />
                </Form.Item>
                <Form.Item
                  label="End Time"
                  name={["timeSlots", index, "endTime"]}
                  className="flex-1 mb-0"
                >
                  <TimePicker className="w-full h-10" />
                </Form.Item>
                <Button
                  danger
                  onClick={() => handleRemoveTimeSlot(slot.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Image</h2>
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
          rules={[
            { required: true, message: "Please enter details description" },
          ]}
        >
          <Input.TextArea
            placeholder="Enter detailed product description"
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
          onClick={() => form.resetFields()}
        >
          Cancel
        </Button>
        <Button
          size="large"
          className="px-8 rounded-lg"
          onClick={() => {
            console.log("Save as draft");
          }}
        >
          Save As Draft
        </Button>
        <Button
          type="primary"
          size="large"
          className="px-8 rounded-lg bg-[#A7997D] hover:bg-[#8d7c68]"
          onClick={handlePublish}
        >
          Publish
        </Button>
      </div>
    </Form>
  );
}