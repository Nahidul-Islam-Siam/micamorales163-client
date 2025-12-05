/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "antd";
import Image from "next/image";
import React from "react";

export default function AdministratorList() {
  const admins = [
    {
      key: "1",
      name: "Henry Jr.",
      email: "zain.anirudh@email.com",
      avatar: "/admin-avatar-1.png",
    },
    {
      key: "2",
      name: "Henry Jr.",
      email: "zain.anirudh@email.com",
      avatar: "/admin-avatar-2.png",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Administrator</h2>
        <Button
          type="primary"
          className="bg-[#A7997D] hover:bg-[#8d7c68] text-white px-4 py-1 rounded-full text-sm font-medium"
        >
          Assign Administrator
        </Button>
      </div>

      <div className="space-y-4">
        {admins.map((admin) => (
          <div
            key={admin.key}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Image
                width={48}
                height={48}
                src={admin.avatar || "https://via.placeholder.com/48"}
                alt="Admin"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium text-gray-900">{admin.name}</h3>
                <p className="text-sm text-gray-600">{admin.email}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="small" danger>Remove</Button>
              <Button size="small">Details</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}