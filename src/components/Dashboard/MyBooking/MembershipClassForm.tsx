/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Form, Input, Button, Select, Upload, InputNumber } from "antd"
import { UploadOutlined, PlusOutlined, CalendarOutlined, CloseOutlined } from "@ant-design/icons"
import { useState } from "react"
// import DateTimePickerModal from "./date-time-picker-modal"
import type { Dayjs } from "dayjs"
import DateTimePickerModal from "./DateTimePickerModal"

interface TimeSlotData {
  id: number
  date: string
  startTime: string
  endTime: string
}

export default function MembershipClassForm() {
  const [form] = Form.useForm()
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([])
  const [modalVisible, setModalVisible] = useState(false)

  const handleAddTimeSlot = () => {
    setModalVisible(true)
  }

  const handleModalConfirm = (date: Dayjs, startTime: string, endTime: string) => {
    const newSlot: TimeSlotData = {
      id: Date.now(),
      date: date.format("YYYY-MM-DD"),
      startTime,
      endTime,
    }
    setTimeSlots([...timeSlots, newSlot])
  }

  const handleRemoveTimeSlot = (id: number) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id))
  }

  const handlePublish = () => {
    form.validateFields().then((values) => {
      console.log("Membership Class submitted:", values)
    })
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
              <Upload.Dragger maxCount={1} beforeUpload={() => false} className="p-6">
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
              />
            </Form.Item>

            <Form.Item label="Duration" name="duration" rules={[{ required: true, message: "Please select duration" }]}>
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
<div className="space-y-4">
  {/* Always show the "Add Time Slot" trigger */}
  <div
    onClick={handleAddTimeSlot}
    className="flex items-center justify-between px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#A7997D] transition-colors"
  >
    <div className="flex items-center text-gray-500">
      <CalendarOutlined className="text-lg mr-2" />
      <span>Select Date & Time</span>
    </div>
    <PlusOutlined className="text-[#A7997D]" />
  </div>

  {/* Display existing time slots as pills only if any exist */}
  {timeSlots.length > 0 && (
    <div className="flex flex-wrap gap-2 py-1 overflow-x-auto max-h-20 scrollbar-hide">
      {timeSlots.map((slot) => (
        <div
          key={slot.id}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full border border-gray-200 text-sm font-medium text-gray-900 whitespace-nowrap"
        >
          <CalendarOutlined className="text-xs text-gray-500" />
          <span>{slot.date}</span>
          <span className="text-gray-600">•</span>
          <span>{slot.startTime} to {slot.endTime}</span>
          <Button
            type="text"
            danger
            size="small"
            icon={<CloseOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveTimeSlot(slot.id)
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Image</h2>
          <Form.Item name="classImages">
            <Upload.Dragger multiple beforeUpload={() => false} className="p-6">
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
              placeholder="Enter detailed product description"
              rows={4}
              className="rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
            />
          </Form.Item>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end pb-8">
          <Button size="large" className="px-8 rounded-lg" onClick={() => form.resetFields()}>
            Cancel
          </Button>
          <Button
            size="large"
            className="px-8 rounded-lg"
            onClick={() => {
              console.log("Save as draft")
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

      {/* Date/Time Picker Modal */}
      <DateTimePickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleModalConfirm}
      />
    </>
  )
}
