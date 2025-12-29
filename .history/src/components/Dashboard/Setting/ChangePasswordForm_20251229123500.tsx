"use client"

import { useResetPasswordMutation } from "@/redux/service/auth/authApi"
import type React from "react"

import { useState } from "react"

export default function ChangePassword() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
const [changePassword] = useResetPasswordMutation()
  const handleInputChange = (field: string, value: string) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = as(e: React.FormEvent) => {
    e.preventDefault()
    
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
            Current Password
          </label>
          <input
            type="password"
            id="current-password"
            value={passwords.current}
            onChange={(e) => handleInputChange("current", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            id="new-password"
            value={passwords.new}
            onChange={(e) => handleInputChange("new", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm new Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={passwords.confirm}
            onChange={(e) => handleInputChange("confirm", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#A7997D] cursor-pointer text-white px-6 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Update password
          </button>
        </div>
      </form>
    </div>
  )
}
