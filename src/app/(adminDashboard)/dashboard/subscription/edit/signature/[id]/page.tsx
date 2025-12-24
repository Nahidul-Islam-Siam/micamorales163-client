/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/subscription/edit/membership/[id]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

// Static class list (same as before)
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

// Mock data — in real app, fetch from API using `id`
const mockSubscriptionData = {
  "1": {
    subscriptionTitle: "4 Class Membership",
    numberOfClass: 4,
    numberOfCredit: 4,
    price: 40,
    validityTime: 30,
    selectedClasses: ["Hot Pilates", "Yoga Flow"],
  },
  "2": {
    subscriptionTitle: "Unlimited Monthly",
    numberOfClass: "Unlimited", // note: your backend may send string or number
    numberOfCredit: "Unlimited",
    price: 200,
    validityTime: 30,
    selectedClasses: ["HIIT Core", "Dance Cardio", "Meditation Hour"],
  },
};

export default function EditSignaturePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params as { id: string };

  // Initialize form state
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
  const [loading, setLoading] = useState(true);

  // Simulate data fetch on mount
  useEffect(() => {
    // In real app: fetch(`/api/subscription/membership/${id}`)
    const data = mockSubscriptionData[id as keyof typeof mockSubscriptionData];

    if (data) {
      setFormData({
        subscriptionTitle: data.subscriptionTitle,
        numberOfClass: data.numberOfClass === "Unlimited" ? -1 : Number(data.numberOfClass),
        numberOfCredit: data.numberOfCredit === "Unlimited" ? -1 : Number(data.numberOfCredit),
        price: data.price,
        validityTime: data.validityTime,
      });

      const existingClasses = data.selectedClasses || [];
      setSelectedClasses(existingClasses);

      // Extract custom classes (not in static list)
      const custom = existingClasses.filter((cls) => !staticClasses.includes(cls));
      setCustomClasses(custom);
    } else {
      // Handle not found
      console.warn("Subscription not found");
    }
    setLoading(false);
  }, [id]);

  // Handle "Unlimited" logic in UI (optional)
  const handleAddClass = () => {
    const name = newClassName.trim();
    if (name && !staticClasses.includes(name) && !customClasses.includes(name)) {
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
      [name]: name === "price" ? parseFloat(value) || 0 : parseInt(value) || 0,
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, subscriptionTitle: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map back "Unlimited" if needed (using -1 as marker)
    const payload = {
      ...formData,
      // If you use -1 for "Unlimited", convert back:
      numberOfClass: formData.numberOfClass === -1 ? "Unlimited" : formData.numberOfClass,
      numberOfCredit: formData.numberOfCredit === -1 ? "Unlimited" : formData.numberOfCredit,
      selectedClasses,
    };

    // ✅ TODO: Call your API to update subscription
    console.log("Updating subscription", id, payload);

    // Example API call:
    // await fetch(`/api/subscription/membership/${id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload),
    // });

    // Show success (optional)
    alert("Subscription updated successfully!");

    // Redirect back to list
    router.push("/dashboard/subscription");
  };

  const allClasses = [...staticClasses, ...customClasses];

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className=" mx-auto  p-6 ">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Membership Subscription</h1>

      <form onSubmit={handleSubmit} className="p-6 rounded-lg  space-y-6 ">
        {/* Subscription Plan Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Subscription Plan</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subscription Title*
            </label>
            <input
              type="text"
              value={formData.subscriptionTitle}
              onChange={handleTitleChange}
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
              value={formData.numberOfClass === -1 ? "" : formData.numberOfClass}
              onChange={handleChange}
              placeholder="Enter number (or leave blank for Unlimited)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
            />
            <div className="mt-1 text-xs text-gray-500">
              <label>
                <input
                  type="checkbox"
                  checked={formData.numberOfClass === -1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfClass: e.target.checked ? -1 : 1,
                    })
                  }
                  className="mr-1"
                />
                Unlimited
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number Of Credit*
            </label>
            <input
              type="number"
              name="numberOfCredit"
              min="1"
              value={formData.numberOfCredit === -1 ? "" : formData.numberOfCredit}
              onChange={handleChange}
              placeholder="Enter number (or leave blank for Unlimited)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#A7997D] focus:outline-none"
            />
            <div className="mt-1 text-xs text-gray-500">
              <label>
                <input
                  type="checkbox"
                  checked={formData.numberOfCredit === -1}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      numberOfCredit: e.target.checked ? -1 : 1,
                    })
                  }
                  className="mr-1"
                />
                Unlimited
              </label>
            </div>
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

        {/* Class Selection */}
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
              className="px-4 py-2 bg-[#A7997D] hover:bg-[#8d7c68] text-white rounded-md font-medium whitespace-nowrap"
            >
              Add New
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {allClasses.map((className) => (
              <div key={className} className="flex items-center">
                <input
                  type="checkbox"
                  id={`class-${className.replace(/\s+/g, '-').toLowerCase()}`}
                  checked={selectedClasses.includes(className)}
                  onChange={() => toggleClassSelection(className)}
                  className="mr-2 h-4 w-4 text-[#A7997D] border-gray-300 rounded focus:ring-2 focus:ring-[#A7997D]"
                />
                <label
                  htmlFor={`class-${className.replace(/\s+/g, '-').toLowerCase()}`}
                  className="text-sm"
                >
                  {className}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2 bg-[#A7997D] hover:bg-[#8d7c68] text-white rounded-md font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}