"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useCreateAdminMutation,
  useGetAllAdminQuery,
  
} from "@/redux/service/auth/authApi";

import Image from "next/image";
import { useState } from "react";
import Swal from "sweetalert2";

export default function AdministratorSection() {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null);

  /* ================= API HOOKS ================= */
  const [createAdmin, { isLoading: isCreating }] =
    useCreateAdminMutation();

  const {
    data: adminResponse,
    isLoading: isAdminsLoading,
    isError,
  } = useGetAllAdminQuery({
    page: 1,
    limit: 10,
  });

  /* ================= MAP API DATA ================= */
  const administrators =
    adminResponse?.data?.filterOnlyCustomerList?.map((item: any) => ({
      id: item.id,
      name:
        item.admin?.firstName || item.admin?.lastName
          ? `${item.admin?.firstName ?? ""} ${item.admin?.lastName ?? ""}`.trim()
          : item.username,
      email: item.email,
      avatar: "/images/avatar.png",
      raw: item,
    })) || [];

  /* ================= FORM STATE ================= */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  /* ================= CREATE ADMIN ================= */
 const handleAssign = async () => {
  if (
    !formData.name ||
    !formData.email ||
    !formData.phoneNumber ||
    !formData.password ||
    formData.password.length < 6 ||
    formData.password !== formData.confirmPassword
  ) {
    Swal.fire(
      "Error",
      "Please fill all required fields correctly",
      "error"
    );
    return;
  }

  const [firstName, ...rest] = formData.name.trim().split(" ");
  const lastName = rest.join(" ");

  const payload = {
    username: formData.email.split("@")[0],
    email: formData.email,              // ✅ REQUIRED
    contactNo: formData.phoneNumber,    // ✅ REQUIRED (NOT NULL)
    password: formData.password,        // ✅ REQUIRED (>=6)
    lang: "ENG",
    description: "Administrator user",
    admin: {
      firstName: firstName || "",
      lastName: lastName || "",
    },
  };

  try {
    await createAdmin({ body:payload}).unwrap();

    Swal.fire(
      "Success",
      "Administrator assigned successfully",
      "success"
    );

    setIsAssignModalOpen(false);
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      password: "",
      confirmPassword: "",
    });
  } catch (error: any) {
    Swal.fire(
      "Error",
      error?.data?.message || "Failed to assign administrator",
      "error"
    );
  }
};


  /* ================= MODALS ================= */
  const handleDetailsClick = (admin: any) => {
    setSelectedAdmin(admin);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedAdmin(null);
  };

  const handleRemoveClick = (admin: any) => {
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
        console.log("Deleting record:", admin.id);
        Swal.fire("Deleted!", "The record has been deleted.", "success");
      }
    });
  };

  /* ================= RENDER ================= */
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-2">
        <h3 className="text-lg font-semibold text-gray-900">
          Administrators
        </h3>
        <button
          onClick={handleAssignClick}
          className="bg-[#A7997D] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 w-full md:w-auto justify-center"
        >
          + Assign Administrator
        </button>
      </div>

      {/* Admin Cards */}
      {isAdminsLoading ? (
        <p className="text-sm text-gray-500">
          Loading administrators...
        </p>
      ) : isError ? (
        <p className="text-sm text-red-500">
          Failed to load administrators
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {administrators.map((admin: any) => (
            <div
              key={admin.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-4"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={admin.avatar}
                  alt={admin.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h4 className="font-medium text-gray-900">
                    {admin.name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {admin.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDetailsClick(admin)}
                  className="px-4 py-2 text-sm border rounded-md"
                >
                  Details
                </button>
                <button
                  onClick={() => handleRemoveClick(admin)}
                  className="px-4 py-2 text-sm border rounded-md"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Assign Administrator Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 relative">
            <h3 className="text-2xl font-semibold mb-6 text-center">
              Assign Administrator
            </h3>

            <div className="space-y-4">
              {[
                "name",
                "email",
                "phoneNumber",
                "address",
                "password",
                "confirmPassword",
              ].map((field) => (
                <input
                  key={field}
                  type={
                    field.includes("password") ? "password" : "text"
                  }
                  name={field}
                  value={(formData as any)[field]}
                  onChange={handleInputChange}
                  placeholder={field}
                  className="w-full px-3 py-2 border rounded-md"
                />
              ))}
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={handleCancelAssign}
                className="px-6 py-2 border rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAssign}
                disabled={isCreating}
                className="px-6 py-2 bg-[#A7997D] text-white rounded-md"
              >
                {isCreating ? "Assigning..." : "Assign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <button
              onClick={closeProfileModal}
              className="float-right"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold">
              {selectedAdmin?.name}
            </h3>
            <p>{selectedAdmin?.email}</p>
          </div>
        </div>
      )}
    </div>
  );
}
