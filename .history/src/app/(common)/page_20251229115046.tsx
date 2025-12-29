"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/logo/logo.png";
import Link from "next/link";
import { useLoginUserMutation } from "@/redux/service/auth/authApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      const result = await loginUser({
        email,
        password,
      }).unwrap();

      if (result?.success) {
        const { access_token, refresh_token } = res.data.data;
        dispatch(setUser({ user: null, access_token, refresh_token }));

        Cookies.set("token", access_token);
      }

      // Redirect to dashboard or home page
      router.push("/dashboard");
      toast.success(result.message)
    } catch (err) {
      setError(err?.data?.message || "Login failed. Please try again.");
      console.error("Login error:", err);
    }
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
            Welcome Back
          </h2>
          <p className="text-sm md:text-base text-[#6B7280]">
            Please sign in to access your dashboard.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full pl-10 text-[#848484] pr-4 py-2.5 placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors rounded-[14px] border border-[#E5E5E5]"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs md:text-base text-[#6B7280] mb-3">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border border-gray-300 rounded accent-gray-400 cursor-pointer"
              />
              <span className="ml-2 text-gray-600 md:text-base">Remember Me</span>
            </label>
            <Link
              href="/forget-password"
              className="text-[#A7997D] md:text-base hover:text-gray-700 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#A7997D] text-white rounded-lg hover:bg-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="text-center mt-6 text-xs md:text-base hover:text-gray-700">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#A7997D] hover:text-gray-700 transition-colors"
          >
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;