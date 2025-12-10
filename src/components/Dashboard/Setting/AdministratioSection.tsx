'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { Modal, Form, Input, Button } from "antd";
import { useState } from "react";

export default function AdministratorSection() {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
  const [form] = Form.useForm();

  const administrators = [
    { id: 1, name: "Henry Jr.", email: "zen.ahmed@gmail.com", avatar: "/images/avatar.png" },
    { id: 2, name: "Emily Carter", email: "emily.carter@example.com", avatar: "/images/avatar.png" },
  ];

  const handleAssignClick = () => setIsAssignModalOpen(true);
  const handleCancelAssign = () => {
    setIsAssignModalOpen(false);
    form.resetFields();
  };
  const handleAssign = () => {
    form.validateFields().then((values) => {
      console.log("Assigning administrator:", values);
      setIsAssignModalOpen(false);
      form.resetFields();
    });
  };
  const handleDetailsClick = (admin: any) => {
    setSelectedAdmin(admin);
    setIsProfileModalOpen(true);
  };
  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedAdmin(null);
  };
  const handleRemoveClick = (admin: any) => {
    Modal.confirm({
      title: "Do you want to remove?",
      okText: "Yes",
      cancelText: "No",
      onOk: () => alert(`Removed: ${admin.name}`),
      okButtonProps: { className: "bg-blue-600 hover:bg-blue-700 text-white" },
      cancelButtonProps: { className: "border-gray-300 text-gray-700 hover:bg-gray-50" },
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
        <h3 className="text-lg font-semibold text-gray-900">Administrators</h3>
        <button
          onClick={handleAssignClick}
          className="bg-[#A7997D] text-white px-4 cursor-pointer py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors w-full md:w-auto justify-center md:justify-start"
        >
         + Assign Administrator
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Admin Cards */}
      <div className="flex flex-col md:flex-col gap-4">
        {administrators.map((admin) => (
          <div key={admin.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={admin.avatar}
                alt={`${admin.name} avatar`}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <h4 className="font-medium text-gray-900">{admin.name}</h4>
                <p className="text-sm text-gray-500 break-all">{admin.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => handleDetailsClick(admin)}
                className="px-4 cursor-pointer py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Details
              </button>
              <button
                onClick={() => handleRemoveClick(admin)}
                className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Assign Administrator Modal */}
      <Modal
        title="Assign Administrator"
        open={isAssignModalOpen}
        onCancel={handleCancelAssign}
        footer={[
          <Button style={{cursor: "pointer"}} key="assign" type="primary" onClick={handleAssign} className="w-full md:w-auto">
            Assign
          </Button>,
        ]}
        width="100%"
        style={{ maxWidth: 600 }}
        centered
        closable
        destroyOnClose
      >
        <div className="p-2 md:p-6 space-y-4">
          <Form form={form} layout="vertical" initialValues={{}}>
            <Form.Item
              name="name"
              label="Name*"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Enter your first name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email*"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Invalid email format' }
              ]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone number"
            >
              <Input placeholder="Enter your phone number" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Address*"
              rules={[{ required: true, message: 'Please enter your address' }]}
            >
              <Input placeholder="Enter your address" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please enter a password' }]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm Password"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm your password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) return Promise.resolve();
                    return Promise.reject(new Error('Passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm your password" />
            </Form.Item>
          </Form>
        </div>
      </Modal>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg border border-gray-200 max-w-full w-full sm:max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
              <button onClick={closeProfileModal} className="text-gray-500 cursor-pointer hover:text-gray-700" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center gap-4">
                <Image
                  src={selectedAdmin?.avatar || "/images/avatar.png"}
                  alt={selectedAdmin?.name}
                  width={64}
                  height={64}
                  className="rounded-full object-cover border border-gray-200"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedAdmin?.name}</h2>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Introduction:</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Lorem ipsum as their for default model text, and a search for &rsquo;lorem ipsum&rsquo; will uncover many web for site.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">Contact</span>
                  <span className="text-sm text-gray-600">+84 0373467950</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">Email</span>
                  <span className="text-sm text-gray-600">{selectedAdmin?.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">Address</span>
                  <span className="text-sm text-gray-600">Dhaka, Bangladesh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
