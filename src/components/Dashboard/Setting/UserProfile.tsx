"use client";

import Image from "next/image";
import {
  FiPhone as PhoneIcon,
  FiMail as MailIcon,
  FiMapPin as MapPinIcon,
} from "react-icons/fi";

export default function UserProfile() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-12 shadow-sm relative">
      {/* Edit Icon - Top Right */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
        aria-label="Edit profile"
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
        {/* Left Side: Avatar */}
        <div className="flex-shrink-0">
          <Image
            src="/images/avatar.png" // Replace with actual image path
            alt="Joohn Emily Carter"
            width={100}
            height={100}
            className="rounded-full object-cover border border-gray-200"
          />
        </div>

        {/* Middle: Name + Introduction */}
        <div className="flex-1 flex flex-col md:flex-row gap-6 w-full">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Joohn Emily Carter
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
              Introduction:
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem ipsum as their for default model text, and a search for
              &rsquo;lorem ipsum&rsquo; will uncover many web for site.
            </p>
          </div>

          {/* Right Side: Contact Info */}
          <div className="flex flex-col gap-3 md:w-64 w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-black" />
                <span className="text-sm text-black font-semibold">
                  Contact
                </span>
              </div>
              <span className="text-sm text-gray-600">+84 0373467950</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-black" />
                <span className="text-sm text-black font-semibold">Email</span>
              </div>
              <span className="text-sm text-gray-600">
                giangbanganh@gmail.com
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-black" />
                <span className="text-sm text-gray-700 font-semibold">
                  Address
                </span>
              </div>
              <span className="text-sm text-gray-600">Dhaka, Bangladesh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
