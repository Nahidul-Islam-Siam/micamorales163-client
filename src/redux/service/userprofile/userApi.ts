/* eslint-disable @typescript-eslint/no-explicit-any */
// e.g., src/redux/api/profileApi.ts

import { baseApi } from "@/redux/api/baseApi";
// types/profile.ts or inside your API file

// --- Booking (from customer.bookings) ---
export interface ClassOffering {
  id: string;
  name: string;
  description: string;
  basicInfo: string;
  instructorName: string;
  instructorDescription: string;
  instructorImage: string | null;
  type: string;
  publicationStatus: string;
  price: number;
  durationMinutes: number;
  maxSpace: number;
  image: string | null;
  detailsDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  customerId: string;
  name: string;
  phoneNumber: string;
  bookingDate: string;
  classOfferingId: string;
  classScheduleId: string;
  classTimeSlotId: string;
  numberOfPersonBook: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  classOffering: ClassOffering;
}

// --- Payment (from customer.payments) ---
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerId: string;
  classBookingId: string | null;
  subscriptionTransactionId: string;
  createdAt: string;
  updatedAt: string;
}

// --- Customer (nested inside user) ---
export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  address: string | null;
  description: string | null;
  gymGoal: string | null;
  preferredExperience: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  bookings: Booking[];
  reviews: any[]; // you can define Review interface later if needed
  payments: Payment[];
  creditBanks: any[]; // define later if needed
}

// --- User Profile (top-level user object) ---
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  password: string; // ⚠️ usually not exposed in real apps, but present in your response
  description: string | null;
  gender: "MALE" | "FEMALE" | "OTHERS"; // note: lowercase 'gender', not 'Gender'
  location: string | null;
  contactNo: string | null;
  avatars: string | null; // can be null (see response)
  status: string;
  role: string;
  lang: string; // e.g., "ENG"
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
}

// --- API Response Wrapper ---
export interface UserListResponse {
  message: string;
  success: boolean;
  meta: null; // or define proper Meta if used elsewhere
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    filterOnlyCustomerList: UserProfile[];
  };
}

// --- For updating profile (request body) ---
export interface UpdateProfileRequestBody {
  username: string;
  email: string;
  description: string | null;
  gender: "MALE" | "FEMALE" | "OTHERS";
  location: string | null;
  contactNo: string | null;
  customer: {
    firstName: string;
    lastName: string;
    address: string | null;
    description: string | null;
    gymGoal: string | null;
    preferredExperience: string | null;
  };
}

export interface UpdateProfilePayload {
  data: UpdateProfileRequestBody;
  profileImage?: File;
}

export interface UpdateProfileResponse {
  message: string;
  success: boolean;
  meta: null;
  data: UserProfile;
}
const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
getAllUserList: builder.query<UserListResponse, void>({
  query: () => ({
    url: "/users",
    method: "GET",
  }),
}),
  }),
});

export const { useGetAllUserListQuery } = userApi;