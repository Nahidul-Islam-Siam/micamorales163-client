/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { Button, Pagination, Modal } from "antd";
import { EyeOutlined, DeleteOutlined, MailOutlined } from "@ant-design/icons";

// --------------------
// Interfaces
// --------------------
interface ContactMessage {
  key: string;
  userName: string;
  email: string;
  phoneNumber: string;
  message: string;
}

// --------------------
// Mock Data
// --------------------
const mockContactMessages: ContactMessage[] = [
  { key: "1", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "2", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "3", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "4", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "5", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "6", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "7", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "8", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "9", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "10", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "11", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
  { key: "12", userName: "Wilson Levin", email: "client000@gmail.com", phoneNumber: "088 3343 32437", message: "I want to book a event for my company and i have 32 member. Can you do this event?" },
];

// --------------------
// Main Component
// --------------------
const ContactUsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const pageSize = 10;

  // Memoized data
  const displayedData = useMemo(() => mockContactMessages, []);

  const handlePageChange = (page: number) => setCurrentPage(page);

  const openMessageModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  // Paginate data manually
  const paginatedData = displayedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Us</h2>

      {/* Custom Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => (
              <tr key={item.key} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.userName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.phoneNumber}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {item.message}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => openMessageModal(item)}
                      className="text-gray-500 hover:text-blue-600"
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => console.log('Remove message:', item.key)}
                      className="text-gray-500 hover:text-red-600"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={displayedData.length}
          onChange={handlePageChange}
          showSizeChanger={false}
          itemRender={(page, type) => {
            if (type === 'prev') return <Button type="text">‹</Button>;
            if (type === 'next') return <Button type="text">›</Button>;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 flex items-center justify-center rounded mx-1 text-sm font-medium transition-colors
                  ${page === currentPage
                    ? "bg-[#A7997D] text-white"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                  }`}
              >
                {page}
              </button>
            );
          }}
        />
      </div>

      {/* Message View Modal */}
      <Modal
        open={isModalOpen}
        onCancel={closeMessageModal}
        footer={null}
        width={600}
        centered
        className="contact-message-modal"
        // style={{ top: 100 }}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Message</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-gray-700 leading-relaxed">{selectedMessage?.message}</p>
          </div>
          <div className="flex justify-between items-center">
            <Button
              className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-2 rounded-md font-medium"
              onClick={() => console.log('Reply to:', selectedMessage?.key)}
            >
              Reply
            </Button>
            {/* Small circular icon in the bottom right */}
            <div className="absolute bottom-4 right-4 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white">
              <MailOutlined />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ContactUsPage;