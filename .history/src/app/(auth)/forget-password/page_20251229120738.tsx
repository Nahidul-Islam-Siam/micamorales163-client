"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo/logo.png";
import Link from "next/link";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 font-normal flex items-center justify-center text-[#4E4E4A] rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-lg p-10 shadow-sm">
        {/* Logo/Brand */}
        <div className="flex justify-center mb-6">
          <Image src={logo} alt="Logo" width={100} height={100} />
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-normal mb-2">
            Forgot Your Password?
          </h2>
          <p className="text-sm md:text-base text-[#6B7280]">
            Enter your email address to receive a reset link.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-xs md:text-base text-[#6B7280] mb-3">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-[#848484] placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors rounded-[14px] border border-[#E5E5E5]"
              />
            </div>
          </div>

          {/* Send Reset Link Button */}
          <button
            type="submit"
            className="w-full py-2.5  bg-[#A7997D] text-white rounded-[16px] border-2 border-[#E5E5E5]
 hover:bg-[#9a8c75] transition-all duration-200"
          >
            Send Reset Link
          </button>

          {/* Back to Login Link */}
          <div className="w-full text-sm md:text-base text-[#6B7280] py-2.5 border-2   rounded-[16px] hover:bg-[#9a8c75] transition-all duration-200 ">
            <Link
              href="/"
              className="flex items-center justify-center text-[#A7997D] md:text-base hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
