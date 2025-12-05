/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Form, Input, Button, Checkbox,  Row, Col, InputNumber } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function AddSubscription() {
  const [activeTab, setActiveTab] = useState<"membership" | "signature" | "event">("membership");

  // Mock class list data
  const mockClasses = [
    "Hot Pilates",
    "Soul Pack",
    "Yoga Flow",
    "Barre Blast",
    "Meditation Hour",
    "HIIT Core",
    "Dance Cardio",
    "Stretch & Restore",
  ];

  const [classList, setClassList] = useState<string[]>(["Hot Pilates"]);
  const [newClassName, setNewClassName] = useState("");

  const handleAddClass = () => {
    if (newClassName.trim()) {
      setClassList([...classList, newClassName.trim()]);
      setNewClassName("");
    }
  };

  const handleRemoveClass = (className: string) => {
    setClassList(classList.filter((c) => c !== className));
  };

  const onFinish = (values: any) => {
    console.log("Submitted values:", values);
    console.log("Selected classes:", classList);
    // Handle actual submission here
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-xl font-normal text-[#111827] mb-2">Add Subscription</h1>
        <p className="text-sm text-[#4A5565] mb-6">Create a new subscription plan for your customers</p>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          {[
            { key: "membership", label: "Membership" },
            { key: "signature", label: "Signature Experience" },
            { key: "event", label: "Event" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap
                ${activeTab === tab.key
                  ? "bg-[#A7997D] text-white border border-[#A7997D]"
                  : "text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <Form layout="vertical" onFinish={onFinish} className="bg-white p-6 rounded-lg shadow-sm space-y-6">
          {/* Subscription Plan */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>
            <Form.Item
              label="Subscription Title*"
              name="subscriptionTitle"
              rules={[{ required: true, message: "Please enter subscription title" }]}
            >
              <Input placeholder="Enter subscription title" className="h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]" />
            </Form.Item>
          </div>

          {/* Number of Class & Credit */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Number Of Class*"
                name="numberOfClass"
                rules={[{ required: true, message: "Please enter number of class" }]}
              >
                <InputNumber
                  min={1}
                  placeholder="Enter number of class"
                  className="w-full h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Number Of Credit*"
                name="numberOfCredit"
                rules={[{ required: true, message: "Please enter number of credit" }]}
              >
                <InputNumber
                  min={1}
                  placeholder="Enter number of credit"
                  className="w-full h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Price & Validity */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Price $*"
                name="price"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <InputNumber
                  prefix="$"
                  min={0}
                  step={0.01}
                  placeholder="Enter price"
                  className="w-full h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Validity Time*"
                name="validityTime"
                rules={[{ required: true, message: "Please enter validity time" }]}
              >
                <InputNumber
                  min={1}
                  placeholder="Enter days"
                  suffix="days"
                  className="w-full h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Class List */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Class List*</h2>
            <div className="mb-4 flex gap-2">
              <Input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Enter class name"
                className="h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]"
              />
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddClass}
                className="bg-[#A7997D] hover:bg-[#8d7c68]"
              >
                Add New
              </Button>
            </div>

            {/* Selected Classes */}
            <div className="mb-4 p-4 bg-[#F3F3F5] rounded-lg">
              <div className="flex flex-wrap gap-2">
                {classList.map((className) => (
                  <span
                    key={className}
                    className="inline-flex items-center px-3 py-1 bg-white border border-gray-300 rounded-full text-sm"
                  >
                    {className}
                    <button
                      onClick={() => handleRemoveClass(className)}
                      className="ml-2 text-xs text-gray-500 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Checkbox Grid */}
            <div className="grid grid-cols-3 gap-4">
              {mockClasses.map((className) => (
                <Checkbox
                  key={className}
                  checked={classList.includes(className)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setClassList([...classList, className]);
                    } else {
                      setClassList(classList.filter((c) => c !== className));
                    }
                  }}
                  className="font-medium"
                >
                  {className}
                </Checkbox>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="px-8 rounded-lg bg-[#A7997D] hover:bg-[#8d7c68]"
            >
              Add
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}