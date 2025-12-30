/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { UpdateSubscriptionPayload, useGetSubsciptionModelByIdQuery, useUpdateSubscriptionModelMutation } from "@/redux/service/subscription/subscriptionApi";
import Swal from "sweetalert2";

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

export default function EditUnlimitedPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  const { data: singleData, isLoading, isError } = useGetSubsciptionModelByIdQuery(id);
const [updateSubscription] = useUpdateSubscriptionModelMutation();
  // ✅ Only numbers — no null
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

  useEffect(() => {
    if (singleData?.success && singleData.data) {
      const apiData = singleData.data;

      const classLimit = typeof apiData.classLimit === "number" ? apiData.classLimit : 0;
      const creditAmount = apiData.creditAmount ?? 0;

      setFormData({
        subscriptionTitle: apiData.title,
        numberOfClass: classLimit,
        numberOfCredit: creditAmount,
        price: apiData.price,
        validityTime: apiData.validityTime,
      });

      const classes = apiData.classList || [];
      setSelectedClasses(classes);

      const custom = classes.filter((cls) => !staticClasses.includes(cls));
      setCustomClasses(custom);
    }
  }, [singleData]);

  const handleAddClass = () => {
    const name = newClassName.trim();
    if (name && !staticClasses.includes(name) && !customClasses.includes(name)) {
      setCustomClasses((prev) => [...prev, name]);
      setSelectedClasses((prev) => [...prev, name]);
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
      [name]: name === "price" ? parseFloat(value) || 0 : parseInt(value) || 0,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, subscriptionTitle: e.target.value }));
  };



const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const updatePayload: UpdateSubscriptionPayload = {
    title: formData.subscriptionTitle,
    classLimit: formData.numberOfClass, // number (since no unlimited)
    creditAmount: formData.numberOfCredit,
    price: formData.price,
    validityTime: formData.validityTime,
    classList: selectedClasses,
  };

  try {
    const res = await updateSubscription({ id, body: updatePayload }).unwrap();
    if (res.success) {
      Swal.fire("Success", res?.message || "Subscription updated successfully", "success");
      router.push("/dashboard/subscription");
    } else {
      Swal.fire("Error", res?.message || "Update failed", "error");
    }
  } catch (err: any) {
    Swal.fire("Error", err?.data?.message || "Update failed", "error");
  }
};

  const allClasses = [...staticClasses, ...customClasses];

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load subscription.</div>;
  }

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Unlimited Subscription</h1>

      <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-sm space-y-6">
        {/* Subscription Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subscription Title*
          </label>
          <input
            type="text"
            value={formData.subscriptionTitle}
            onChange={handleTitleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D]"
            required
          />
        </div>

        {/* Number of Class & Credit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number Of Class*
            </label>
            <input
              type="number"
              name="numberOfClass"
              min="0"
              value={formData.numberOfClass}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number Of Credit*
            </label>
            <input
              type="number"
              name="numberOfCredit"
              min="0"
              value={formData.numberOfCredit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D]"
              required
            />
          </div>
        </div>

        {/* Price & Validity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D]"
                required
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D]"
                required
              />
              <span className="absolute right-3 top-2.5 text-gray-500">days</span>
            </div>
          </div>
        </div>

        {/* Class Selection */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Class List*</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="Enter class name"
              className="flex-1 min-w-[200px] px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D]"
            />
            <button
              type="button"
              onClick={handleAddClass}
              disabled={!newClassName.trim()}
              className="px-4 py-2 bg-[#A7997D] text-white rounded-md disabled:bg-gray-400"
            >
              Add New
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {allClasses.map((className) => (
              <div key={className} className="flex items-center">
                <input
                  type="checkbox"
                  id={`class-${className.replace(/\s+/g, "-").toLowerCase()}`}
                  checked={selectedClasses.includes(className)}
                  onChange={() => toggleClassSelection(className)}
                  className="mr-2 h-4 w-4 text-[#A7997D] rounded focus:ring-[#A7997D]"
                />
                <label htmlFor={`class-${className.replace(/\s+/g, "-").toLowerCase()}`} className="text-sm">
                  {className}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2 bg-[#A7997D] text-white rounded-md hover:bg-[#8d7c68]"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}