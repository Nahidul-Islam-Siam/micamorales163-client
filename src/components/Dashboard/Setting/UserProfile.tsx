/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import {
  FiPhone as PhoneIcon,
  FiMail as MailIcon,
  FiMapPin as MapPinIcon,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import { useGetmeQuery, useUpdateGetMeMutation } from "@/redux/service/auth/authApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const userId = useSelector((state: RootState) => state.auth);
  console.log("auth", userId)



  const { data, isLoading } = useGetmeQuery({});
  const [updateGetMe, { isLoading: isUpdating }] =
    useUpdateGetMeMutation();


  const user = data?.data;
  const admin = data?.data?.admin;

  const fullName = admin
    ? `${admin.firstName} ${admin.lastName}`
    : "";

  const id = user?.id;

  const email = user?.email ?? "";
  const contact = user?.contactNo ?? "";
  const address = admin?.location ?? user?.location ?? "";
  const introduction =
    admin?.description ?? user?.description ?? "";

  const avatars = user?.avatar;


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    introduction: "",
  });

  useEffect(() => {
    if (user && admin) {
      setFormData({
        name: `${admin.firstName} ${admin.lastName}`,
        email: user.email ?? "",
        contact: user.contactNo ?? "",
        address: admin.location ?? user.location ?? "",
        introduction:
          admin.description ?? user.description ?? "",
      });
    }
  }, [user, admin]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!id) return;

    const [firstName, ...rest] = formData.name.trim().split(" ");
    const lastName = rest.join(" ");

    const payload = {
      username: user?.username,
      email: formData.email,
      description: formData.introduction || null,
      gender: user?.gender,
      location: formData.address || null,
      contactNo: formData.contact || null,
      customer: {
        firstName: firstName || "",
        lastName: lastName || "",
        address: formData.address || null,
        description: formData.introduction || null,
        gymGoal: null,
        preferredExperience: null,
      },
    };

    try {
      await updateGetMe({
        id,
        body: payload,
      }).unwrap();

      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };


  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-12 shadow-sm relative">
      {/* Edit Icon */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
        aria-label="Edit profile"
        onClick={() => setIsEditing(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="17"
          height="20"
          viewBox="0 0 17 20"
          fill="none"
        >
          <path
            d="M9.31548 3.1074L13.2369 7.44086M1.32422 19.2283H15.9249M1.639 14.7796L2.07737 11.4048C2.10096 11.1844 2.19308 10.9799 2.33791 10.8264L10.9321 1.30426C11.0425 1.17944 11.1802 1.08836 11.3318 1.03985C11.4834 0.991337 11.6437 0.987043 11.7972 1.02738C12.5902 1.26063 13.3111 1.72784 13.8833 2.37925C14.4751 3.01189 14.9005 3.81091 15.114 4.69082C15.1469 4.86114 15.1412 5.03785 15.0975 5.20515C15.0537 5.37245 14.9732 5.52513 14.8632 5.64954L6.26996 15.1717C6.1218 15.3234 5.93706 15.424 5.73822 15.4614L2.68203 15.9462C2.53967 15.9675 2.39479 15.9519 2.25879 15.9006C2.1228 15.8494 1.99939 15.7638 1.89829 15.6508C1.79718 15.5377 1.72115 15.4001 1.67615 15.249C1.63116 15.0978 1.61844 14.9371 1.639 14.7796Z"
            stroke="#11111B"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Image
            src={avatars || "/avatar3.png"}
            alt={fullName}
            width={100}
            height={100}
            className="rounded-full object-cover border border-gray-200"
          />
        </div>

        {/* Info */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 w-full">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {isLoading ? "Loading..." : fullName}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              Introduction:
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {isLoading ? "Loading..." : introduction}
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-3 md:w-64 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-black" />
                <span className="text-sm text-black font-semibold">
                  Contact
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {contact}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-black" />
                <span className="text-sm text-black font-semibold">
                  Email
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {email}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-black" />
                <span className="text-sm text-gray-700 font-semibold">
                  Address
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {address}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal (UNCHANGED DESIGN) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAFBFB] rounded-2xl shadow-xl max-w-4xl w-full p-4 py-9 relative">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
              Edit Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {["name", "contact", "email", "address"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={(formData as any)[field]}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-[#7F7F84]/50 bg-[#FAFBFB] px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7997D]"
                  />
                </div>
              ))}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Introduction
              </label>
              <textarea
                name="introduction"
                value={formData.introduction}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-[#7F7F84]/50 bg-[#FAFBFB] focus:outline-none focus:ring-2 focus:ring-[#A7997D]"
              />
            </div>

            <div className="flex justify-center space-x-8">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="px-4 py-2 bg-[#A7997D] text-white rounded-md"
              >
                {isUpdating ? "Saving..." : "Change"}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
