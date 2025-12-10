"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { Modal } from "antd";
import { useState } from "react";

export default function AdministratorSection() {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  // Mock data for administrators
  const administrators = [
    {
      id: 1,
      name: "Henry Jr.",
      email: "zen.ahmed@gmail.com",
      avatar: "/images/avatar.png",
    },
    {
      id: 2,
      name: "Emily Carter",
      email: "emily.carter@example.com",
      avatar: "/images/avatar.png",
    },
  ];

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAssignClick = () => setIsAssignModalOpen(true);
  const handleCancelAssign = () => {
    setIsAssignModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      confirmPassword: "",
    });
  };

  const handleAssign = () => {
    // Simple validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.address ||
      !formData.password ||
      formData.password !== formData.confirmPassword
    ) {
      alert("Please fill all required fields and ensure passwords match.");
      return;
    }
    console.log("Assigning administrator:", formData);
    setIsAssignModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      confirmPassword: "",
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
      cancelButtonProps: {
        className: "border-gray-300 text-gray-700 hover:bg-gray-50",
      },
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
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </div>

      {/* Admin Cards */}
      <div className="flex flex-col md:flex-col gap-4">
        {administrators.map((admin) => (
          <div
            key={admin.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-4"
          >
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

      {/* Assign Administrator Modal (Raw Tailwind) */}
      {isAssignModalOpen && (
        <div className="fixed font-roboto inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 md:p-8 relative">
            
                  {/* Title */}
              <h3 className="text-2xl md:text-[30px] font-semibold text-gray-900 mb-6 text-center">
                Assign Administrator
              </h3>
            <div className="p-6 border rounded-lg border-[#D9D9D9]">
              {/* Close Button */}
              <button
                onClick={handleCancelAssign}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 18L18 6M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

        

              {/* Form */}
              <div className="space-y-6">
                {/* Administrator Information Header */}
                <div className=" pb-3">
                  <h4 className="md:text-2xl text-xl font-semibold ">
                    Administrator Information
                  </h4>
                </div>

                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7997D] focus:border-[#A7997D]"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7997D] focus:border-[#A7997D]"
                    placeholder="Enter your email"
                  />
                </div>

                {/* Phone Number Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7997D] focus:border-[#A7997D]"
                    placeholder="+0"
                  />
                </div>

                {/* Address Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7997D] focus:border-[#A7997D]"
                    placeholder="Enter your address"
                  />
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7997D] focus:border-[#A7997D]"
                    placeholder="Enter your password"
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7997D] focus:border-[#A7997D]"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>

              {/* Assign Button - Centered */}
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleAssign}
                  className="px-10 py-2 bg-[#A7997D] border border-transparent rounded-md text-sm font-medium text-white hover:bg-[#8d7c68] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A7997D]"
                >
                  Assign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="max-w-full w-full sm:max-w-md shadow-xl overflow-hidden rounded-2xl border border-[#4E4E4A] bg-[#F3F3F3]">
            <div className="flex justify-between items-center px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                User Profile
              </h3>
              <button
                onClick={closeProfileModal}
                className="text-gray-500 cursor-pointer hover:text-gray-700"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M6 18L18 6M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedAdmin?.name}
                  </h2>
                  <p className="text-sm text-gray-500">Administrator</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                  Introduction:
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Lorem ipsum as their for default model text, and a search for
                  &rsquo;lorem ipsum&rsquo; will uncover many web for site.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">
                    Contact
                  </span>
                  <span className="text-sm text-gray-600">+84 0373467950</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">
                    Email
                  </span>
                  <span className="text-sm text-gray-600">
                    {selectedAdmin?.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">
                    Address
                  </span>
                  <span className="text-sm text-gray-600">
                    Dhaka, Bangladesh
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
