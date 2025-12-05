/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import ProfileInfo from "./ProfileInfo";
import ChangePasswordForm from "./ChangePasswordForm";
import AdministratorList from "./AdministratorList";

export default function ProfileSettingsPage() {
  return (
    <div className="min-h-screen bg-[#F3F3F3] p-6">
      <div className=" mx-auto space-y-6">
        {/* Profile Info */}
        <ProfileInfo />

        {/* Change Password */}
        <ChangePasswordForm />

        {/* Administrator List */}
        <AdministratorList />
      </div>
    </div>
  );
}