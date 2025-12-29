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
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  
  const [changePassword, { isLoading }] = useResetPasswordMutation()

  const handleInputChange = (field: string, value: string) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear errors when user types
    setError("")
    setSuccess("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    // Validation
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setError("All fields are required")
      return
    }

    if (passwords.new !== passwords.confirm) {
      setError("New passwords do not match")
      return
    }

    if (passwords.new.length < 6) {
      setError("New password must be at least 6 characters long")
      return
    }

    try {
      const payload = {
        prePassword: passwords.current,
        newPassword: passwords.new,
      }
      
      const res = await changePassword(payload).unwrap()
      console.log(res)
      setSuccess("Password updated successfully!")
      
      // Reset form
      setPasswords({
        current: "",
        new: "",
        confirm: "",
      })
    } catch (error: any) {
      console.log(error)
      setError(error?.data?.message || "Failed to update password. Please try again.")
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-600 text-sm">
          {success}
        </div>
      )}

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
            disabled={isLoading}
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#A7997D] cursor-pointer text-white px-6 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#978975]"
          >
            {isLoading ? "Updating..." : "Update password"}
          </button>
        </div>
      </form>
    </div>
  )
}