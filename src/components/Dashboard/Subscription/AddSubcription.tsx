/* eslint-disable @typescript-eslint/no-explicit-any */
// app/AddSubscription.tsx
"use client";

import React, { useState } from "react";
import MembershipSubscriptionForm from "./MembershipSubscriptionForm";
import SignatureExperienceSubscriptionForm from "./SignatureExperienceSubscriptionForm";

import EvenSubscriptionForm from "./EventSubscriptionForm";

export default function AddSubscription() {
  const [activeTab, setActiveTab] = useState<"membership" | "signature" | "event">("membership");

  const handleFormSubmit = (values: any) => {
    console.log(`Submitted ${activeTab} form:`, values);
    // Handle actual submission logic here (e.g., API call)
  };

  return (
    <div className="min-h-screen  p-6">
      <div className=" mx-auto">
        {/* Header */}
        <h1 className="text-xl font-normal text-[#111827] mb-6">Add Subscription</h1>

        {/* Custom Tab Buttons */}
        <div className="flex gap-1 mb-6 p-1  w-fit ">
          {[
            { key: "membership", label: "Membership" },
            { key: "signature", label: "Signature Experience" },
            { key: "event", label: "Event" },
          ].map((tab) => (
            <button
              type="button"
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-2 text-sm font-medium rounded-md  whitespace-nowrap ${
                activeTab === tab.key
                  ? "bg-[#A7997D] text-white shadow-sm "
                  : "text-gray-700 hover:bg-gray-100 border border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className=" p-6 rounded-lg shadow-sm">
          {activeTab === "membership" && (
            <MembershipSubscriptionForm onSubmit={handleFormSubmit} />
          )}
          {activeTab === "signature" && (
            <SignatureExperienceSubscriptionForm onSubmit={handleFormSubmit} />
          )}
          {activeTab === "event" && (
            <EvenSubscriptionForm onSubmit={handleFormSubmit} />
          )}
        </div>
      </div>
    </div>
  );
}