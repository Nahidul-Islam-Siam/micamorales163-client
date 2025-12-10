/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "antd";
import Image from "next/image";
import React from "react";

export default function ProfileInfo() {
  const user = {
    name: "Joohn Emily Carter",
    intro: "Lorem ipsum is their for default model text and a search for lorem ipsum will uncover many web sites.",
    email: "gianpampeh@gmail.com",
    phone: "+88017467950",
    address: "Dhaka, Bangladesh",
    avatar: "/avatar3.png", // Replace with real path
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>

      <div className="flex items-start gap-6">
        <Image
          width={64}
          height={64}
          src={user.avatar || "https://via.placeholder.com/64"}
          alt="Avatar"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-medium text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{user.intro}</p>
        </div>
        <Button type="text" icon={<span className="text-gray-500">✎</span>} />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-500">Contact</h4>
          <p className="text-gray-900">{user.phone}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Email</h4>
          <p className="text-gray-900">{user.email}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-gray-500">Address</h4>
          <p className="text-gray-900">{user.address}</p>
        </div>
      </div>
    </div>
  );
}