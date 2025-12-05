/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { LeftOutlined } from "@ant-design/icons";
import MembershipClassForm from "../MyBooking/MembershipClassForm";
import SignatureExperiencesForm from "../MyBooking/SignatureExperiencesForm";
import EventForm from "../MyBooking/EventForm";


export default function AddProductForm() {
  const [activeTab, setActiveTab] = useState<"membership-class" | "signature-experiences" | "event">(
    "membership-class"
  );

  const productTypeOptions = [
    {
      key: "membership-class",
      label: "Membership Class",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73Z"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 22V12"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3.29004 7L12 12L20.71 7"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.5 4.27002L16.5 9.42002"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "signature-experiences",
      label: "Signature Experiences",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73Z"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 22V12"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3.29004 7L12 12L20.71 7"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.5 4.27002L16.5 9.42002"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "event",
      label: "Event",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M11 21.73C11.304 21.9056 11.6489 21.998 12 21.998C12.3511 21.998 12.696 21.9056 13 21.73L20 17.73C20.3037 17.5547 20.556 17.3025 20.7315 16.9989C20.9071 16.6952 20.9996 16.3508 21 16V8.00002C20.9996 7.6493 20.9071 7.30483 20.7315 7.00119C20.556 6.69754 20.3037 6.44539 20 6.27002L13 2.27002C12.696 2.09449 12.3511 2.00208 12 2.00208C11.6489 2.00208 11.304 2.09449 11 2.27002L4 6.27002C3.69626 6.44539 3.44398 6.69754 3.26846 7.00119C3.09294 7.30483 3.00036 7.6493 3 8.00002V16C3.00036 16.3508 3.09294 16.6952 3.26846 16.9989C3.44398 17.3025 3.69626 17.5547 4 17.73L11 21.73Z"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M12 22V12"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M3.29004 7L12 12L20.71 7"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.5 4.27002L16.5 9.42002"
            stroke="#F3F3F3"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
  ];

  const renderActiveForm = () => {
    switch (activeTab) {
      case "membership-class":
        return <MembershipClassForm />;
      case "signature-experiences":
        return <SignatureExperiencesForm />;
      case "event":
        return <EventForm />;
      default:
        return <MembershipClassForm />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <LeftOutlined className="text-gray-600" />
            Back
          </button>

          {/* Title & Subtitle */}
          <div>
            <h1 className="text-xl font-normal text-[#111827]">Add Product</h1>
            <p className="text-sm text-[#4A5565] mt-1">
              Create a new product or package in your inventory
            </p>
          </div>
        </div>

        {/* Product Type Tabs */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {productTypeOptions.map((option) => (
              <div
                key={option.key}
                onClick={() => setActiveTab(option.key as any)}
                className={`p-6 cursor-pointer transition-all rounded-lg border-2 ${
                  activeTab === option.key
                    ? "border-[#A7997D] bg-[#A7997D] text-white"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-10 h-10 rounded-lg bg-[#8A8A83] flex items-center justify-center">
                    {option.icon}
                  </div>
                </div>
                <p className="text-center font-medium">{option.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Render Active Form */}
        {renderActiveForm()}
      </div>
    </div>
  );
}