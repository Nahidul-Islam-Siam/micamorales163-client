/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useCreateSubscriptionModelMutation } from "@/redux/service/subscription/subscriptionApi";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function EventSubscriptionForm() {
  const [createMemberShipSubscription, { isLoading }] = useCreateSubscriptionModelMutation();
  const router = useRouter();

  const staticClasses = [
    "Hot Pilates",
    "Soul Pack",
    "Yoga Flow",
    "Barre Blast",
    "Meditation Hour",
    "HIIT Core",
    "Dance Cardio",
    "Stretch & Restore",
  ];

  const [formData, setFormData] = useState({
    subscriptionTitle: "",
    numberOfClass: 1,
    numberOfCredit: 1,
    price: 0,
    validityTime: 30,
  });

  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [customClasses, setCustomClasses] = useState<string[]>([]);
  const [newClassName, setNewClassName] = useState("");

  const handleAddClass = () => {
    const name = newClassName.trim();
    if (name && !customClasses.includes(name) && !staticClasses.includes(name)) {
      setCustomClasses([...customClasses, name]);
      setSelectedClasses([...selectedClasses, name]);
      setNewClassName("");
    }
  };

  const toggleClassSelection = (className: string) => {
    setSelectedClasses((prev) =>
      prev.includes(className)
        ? prev.filter((c) => c !== className)
        : [...prev, className]
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? parseFloat(value) || 0
          : name === "subscriptionTitle"
          ? value
          : parseInt(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.subscriptionTitle.trim()) {
      Swal.fire("Error", "Subscription title is required.", "error");
      return;
    }
    if (selectedClasses.length === 0) {
      Swal.fire("Error", "Please select at least one class.", "error");
      return;
    }

    // ✅ Build payload matching your API
    const payload = {
      title: formData.subscriptionTitle,
      classLimit: formData.numberOfClass, // number (not null for MEMBERSHIP)
      creditAmount: formData.numberOfCredit,
      price: formData.price,
      validityTime: formData.validityTime,
      type: "EVENT" as const, // 👈 hardcoded per your requirement
      personLimit: 1, // as in your example
      classList: selectedClasses,
    };

    try {
      const res = await createMemberShipSubscription(payload).unwrap();

      if (res.success) {
    Swal.fire("Success", res?.message || "Subscription created successfully", "success");
        router.push("/dashboard/subscription");

      } else {
        Swal.fire("Failed", res?.message || "Something went wrong", "error");
      }
    } catch (err: any) {
      console.error("Create error:", err);
      Swal.fire(
        "Error",
        err?.data?.message || "Failed to create subscription",
        "error"
      );
    }
  };

  const allClasses = [...staticClasses, ...customClasses];

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-sm space-y-6">
      {/* Subscription Plan Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subscription Title*
          </label>
          <input
            type="text"
            name="subscriptionTitle"
            value={formData.subscriptionTitle}
            onChange={handleChange}
            placeholder="Enter subscription title"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
        </div>
      </div>

      {/* Number of Class & Credit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number Of Class*
          </label>
          <input
            type="number"
            name="numberOfClass"
            min="1"
            value={formData.numberOfClass}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Number Of Credit*
          </label>
          <input
            type="number"
            name="numberOfCredit"
            min="1"
            value={formData.numberOfCredit}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
        </div>
      </div>

      {/* Price & Validity */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price $*</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-gray-500">$</span>
            <input
              type="number"
              name="price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Validity Time*</label>
          <div className="relative">
            <input
              type="number"
              name="validityTime"
              min="1"
              value={formData.validityTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
            />
            <span className="absolute right-3 top-2.5 text-gray-500">days</span>
          </div>
        </div>
      </div>

      {/* Class Selection Section */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Class List*</h2>

        <div className="flex flex-wrap gap-2 mb-6">
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Enter class name"
            className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddClass}
            disabled={!newClassName.trim()}
            className="px-4 py-2 bg-[#A7997D] hover:bg-[#8d7c68] disabled:bg-gray-400 text-white rounded-md font-medium whitespace-nowrap"
          >
            Add New
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allClasses.map((className) => (
            <div key={className} className="flex items-center">
              <input
                type="checkbox"
                id={`class-${className.replace(/\s+/g, "-").toLowerCase()}`}
                checked={selectedClasses.includes(className)}
                onChange={() => toggleClassSelection(className)}
                className="mr-2 h-4 w-4 text-[#A7997D] border-gray-300 rounded focus:ring-2 focus:ring-[#A7997D]"
              />
              <label
                htmlFor={`class-${className.replace(/\s+/g, "-").toLowerCase()}`}
                className="text-sm"
              >
                {className}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-10">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-8 py-3 rounded-md font-medium ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#A7997D] hover:bg-[#8d7c68] text-white"
          }`}
        >
          {isLoading ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}