/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Button, Modal, Spin } from "antd";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useDeleteContactUsMutation, useGetAllContactUsQuery } from "@/redux/service/contactUs/contactUsApi";

// --------------------
// Interfaces
// --------------------
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}



// --------------------
// Main Component
// --------------------
const ContactUsPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const pageSize = 5; // Show 5 messages per page

  // Fetch data from API with pagination
  const { data: apiData, isLoading, isError, refetch } = useGetAllContactUsQuery({
    page: currentPage,
    limit: pageSize,
  });
const [deleteContactUs] = useDeleteContactUsMutation();
  const displayedData: ContactMessage[] = apiData?.data?.result || [];
  const total = apiData?.data?.meta?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const openMessageModal = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const handleDelete = (record: ContactMessage) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
      
        console.log("Deleting record:", record.id);
        const deleteResult = await deleteContactUs(record.id);
      
        refetch();
        
        // Show success message
        Swal.fire("Deleted!", "The record has been deleted.", "success");
      }
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
        <div className="text-center text-red-600">
          <p>Failed to load contact messages. Please try again later.</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!displayedData.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Us</h2>
        <div className="text-center text-gray-500 py-10">
          <p>No contact messages found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm custom-recent-bookings-card">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
        <p className="text-sm text-gray-500">Total Messages: {total}</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                User Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Phone Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {displayedData.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.phoneNumber}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={item.message}>
                  {item.message}
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  <div className="flex space-x-2">
                    <Button
                      type="text"
                      icon={<EyeOutlined />}
                      onClick={() => openMessageModal(item)}
                      className="text-gray-500 hover:text-[#A7997D]"
                    />
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDelete(item)}
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
      {totalPages > 1 && (
        <div className="flex justify-end mt-6">
          <div className="flex items-center space-x-1">
            {/* Previous */}
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`w-10 h-10 flex items-center justify-center rounded text-lg ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              ‹
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => {
              const page = i + 1;
              // Show only 5 pages at a time with ellipsis
              if (totalPages <= 5) {
                // Show all pages if 5 or fewer
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 flex items-center justify-center rounded text-sm font-medium
                      ${currentPage === page
                        ? 'bg-[#A7997D] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {page}
                  </button>
                );
              } else {
                // Show first page, last page, current page, and adjacent pages
                if (page === 1 || page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)) {
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 flex items-center justify-center rounded text-sm font-medium
                        ${currentPage === page
                          ? 'bg-[#A7997D] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-2 text-gray-500">...</span>;
                }
                return null;
              }
            })}

            {/* Next */}
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`w-10 h-10 flex items-center justify-center rounded text-lg ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* Message View Modal */}
      <Modal
        open={isModalOpen}
        onCancel={closeMessageModal}
        footer={null}
        width={600}
        centered
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Message Details</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">From:</span> {selectedMessage?.name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {selectedMessage?.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {selectedMessage?.phoneNumber}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Subject:</span> {selectedMessage?.subject}
              </p>
            </div>
            <hr className="my-4" />
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {selectedMessage?.message}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <Button
              className="bg-[#A7997D] hover:bg-[#8d7c68] text-white justify-center flex items-center px-4 py-2 rounded-md font-medium"
              onClick={() => console.log('Reply to:', selectedMessage?._id)}
            >
              Reply
            </Button>
          </div>
        </div>
      </Modal>

      {/* --- Global Style: Match Booking Table Exactly --- */}
      <style jsx global>{`
        /* Table Header (match RecentBookingsTable) */
        .custom-recent-bookings-card .ant-table-thead > tr > th,
        .custom-recent-bookings-card table thead tr th {
          background-color: #d2d6d8 !important;
          color: #333 !important;
          font-weight: 600 !important;
          border: 2px solid #d2d6d8 !important;
          padding: 16px !important;
        }

        .custom-recent-bookings-card table thead tr:first-child th:first-child {
          border-top-left-radius: 8px;
        }

        .custom-recent-bookings-card table thead tr:first-child th:last-child {
          border-top-right-radius: 8px;
        }

        /* Table Body */
        .custom-recent-bookings-card table tbody tr:hover td {
          background-color: #f9fafb !important;
        }

        /* Pagination Styling */
        .custom-recent-bookings-card .ant-pagination-item-active {
          background-color: #a7997d !important;
          border-color: #a7997d !important;
        }

        .custom-recent-bookings-card .ant-pagination-item-active a {
          color: white !important;
        }

        .custom-recent-bookings-card .ant-pagination-item a,
        .custom-recent-bookings-card .ant-pagination-item-link {
          color: black !important;
        }

        .custom-recent-bookings-card .ant-pagination-item:hover a,
        .custom-recent-bookings-card .ant-pagination-item-link:hover {
          color: #8d7c68 !important;
          border-color: #8d7c68 !important;
        }
      `}</style>
    </div>
  );
};

export default ContactUsPage;