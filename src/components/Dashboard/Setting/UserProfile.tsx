/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import {
  FiPhone as PhoneIcon,
  FiMail as MailIcon,
  FiMapPin as MapPinIcon,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import {
  useGetmeQuery,
  useUpdateGetMeMutation,
} from "@/redux/service/auth/authApi";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const userId = useSelector((state: RootState) => state.auth);
  console.log("auth", userId);

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
  const introduction = admin?.description ?? user?.description ?? "";
  const username = user?.username ?? "";
  const gender = user?.gender ?? "MALE";

  const avatars = user?.avatar;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    introduction: "",
    username: "",
    gender: "MALE" as "MALE" | "FEMALE" | "OTHERS",
    profileImage: null as File | null,
  });

  useEffect(() => {
    if (user && admin) {
      setFormData({
        name: `${admin.firstName} ${admin.lastName}`,
        email: user.email ?? "",
        contact: user.contactNo ?? "",
        address: admin.location ?? user.location ?? "",
        introduction: admin.description ?? user.description ?? "",
        username: user.username ?? "",
        gender: (user.gender as "MALE" | "FEMALE" | "OTHERS") || "MALE",
        profileImage: null,
      });
    }
  }, [user, admin]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        profileImage: e.target.files![0],
      }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE (FIXED PAYLOAD) ================= */
  const handleSave = async () => {
    if (!id || !user) return;

    const [firstName, ...rest] = formData.name.trim().split(" ");
    const lastName = rest.join(" ");

    const payload = {
      username: user.username,
      description: formData.introduction || null,
      gender: user.gender,
      location: formData.address || null,
      contactNo: formData.contact || null,
      admin: {
        firstName: firstName || "",
        lastName: lastName || "",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-12 shadow-sm relative">
      {/* Edit Icon */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
        aria-label="Edit profile"
        onClick={() => setIsEditing(true)}
      >
        ✎
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
              {fullName}
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              Introduction:
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {introduction}
            </p>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-3 md:w-64 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-black" />
                <span className="text-sm font-semibold">
                  Contact
                </span>
              </div>
              <span className="text-sm text-gray-600">{contact}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-black" />
                <span className="text-sm font-semibold">
                  Email
                </span>
              </div>
              <span className="text-sm text-gray-600">{email}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-black" />
                <span className="text-sm font-semibold">
                  Address
                </span>
              </div>
              <span className="text-sm text-gray-600">{address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal (DESIGN UNCHANGED) */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAFBFB] rounded-2xl shadow-xl max-w-4xl w-full p-4 py-9">
            <h3 className="text-xl font-semibold text-center mb-6">
              Edit Profile
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {["name", "email", "contact", "address", "username"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-3">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field as keyof typeof formData] as string}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border px-3 py-2"
                  />
                </div>
              ))}

              {/* Gender Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-[#7F7F84]/50 bg-[#FAFBFB] px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A7997D]"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            {/* Profile Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#A7997D] file:text-white hover:file:bg-[#94856a]"
              />
            </div>

            {/* Introduction */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">
                Introduction
              </label>
              <textarea
                name="introduction"
                value={formData.introduction}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-lg border px-3 py-2"
              />
            </div>

            <div className="flex justify-center space-x-8">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md"
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