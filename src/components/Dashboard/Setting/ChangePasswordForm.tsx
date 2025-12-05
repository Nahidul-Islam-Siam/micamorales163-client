/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Form, Input, Button } from "antd";
import React from "react";

export default function ChangePasswordForm() {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Password changed:", values);
    // Handle password update API call here
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Current Password*"
          name="currentPassword"
          rules={[{ required: true, message: "Please enter current password" }]}
        >
          <Input.Password placeholder="Enter current password" className="h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]" />
        </Form.Item>

        <Form.Item
          label="New Password*"
          name="newPassword"
          rules={[{ required: true, message: "Please enter new password" }]}
        >
          <Input.Password placeholder="Enter new password" className="h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]" />
        </Form.Item>

        <Form.Item
          label="Confirm New Password*"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" className="h-10 rounded-lg border border-[rgba(0,0,0,0)] bg-[#F3F3F5]" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="bg-[#A7997D] hover:bg-[#8d7c68]"
          >
            Update Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}