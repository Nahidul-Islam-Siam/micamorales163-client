/* eslint-disable @typescript-eslint/no-explicit-any */
// e.g., src/redux/api/classBookingApi.ts

import { baseApi } from "@/redux/api/baseApi";

// --- Class Time Slot ---
export interface ClassTimeSlot {
  id: string;
  startTime: string; // ISO datetime: "2025-12-30T18:00:00.000Z"
  endTime: string;   // ISO datetime: "2025-12-30T19:15:00.000Z"
  maxSpace: number | null;
  bookedSpace: number;
  classScheduleId: string;
  createdAt: string;
  updatedAt: string;
}

// --- Class Schedule ---
export interface ClassSchedule {
  id: string;
  dateTime: string; // ISO date: "2025-01-10T00:00:00.000Z"
  classOfferingId: string;
  createdAt: string;
  updatedAt: string;
}

// --- Class Offering ---
export interface ClassOffering {
  id: string;
  name: string;
  description: string;
  basicInfo: string;
  instructorName: string;
  instructorDescription: string;
  instructorImage: string | null;
  type: "SIGNATURE" | "MEMBERSHIP" | "EVENT"; // based on your data
  publicationStatus: "PUBLISHED" | "DRAFT";
  price: number;
  durationMinutes: number;
  maxSpace: number;
  image: string | null;
  detailsDescription: string;
  createdAt: string;
  updatedAt: string;
}

// --- Payment ---
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: "COMPLETED" | "PROCESSING" | "PENDING" | "FAILED";
  customerId: string;
  classBookingId: string;
  subscriptionTransactionId: string;
  createdAt: string;
  updatedAt: string;
}

// --- Customer ---
export interface Customer {
  id: string;
  firstName: string | null;
  lastName: string | null;
  address: string | null;
  description: string | null;
  gymGoal: string | null;
  preferredExperience: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// --- Main Booking Interface ---
export interface Booking {
  id: string;
  customerId: string;
  name: string; // booking name (not necessarily customer name)
  phoneNumber: string;
  email: string | null;
  bookingDate: string; // ISO datetime
  classOfferingId: string;
  classScheduleId: string;
  classTimeSlotId: string;
  numberOfPersonBook: number;
  status: "BOOKED" | "PROCESSING" | "CANCELLED" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
  payment: Payment | null;
  customer: Customer;
  classOffering: ClassOffering;
  classSchedule: ClassSchedule;
  classTimeSlot: ClassTimeSlot;
}

// --- API Response Wrapper ---
export interface BookingListResponse {
  message: string;
  success: boolean;
  meta: null;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPage: number;
    };
    result: Booking[]; // Note: it's "result", not "filterOnlyCustomerList"
  };
}

// Update the API endpoint
const classBookingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query<BookingListResponse, { searchTerm?: string; page?: number; limit?: number }>({
      query: ({ searchTerm, page, limit }) => ({
        url: "/class-booking",
        method: "GET",
        params: { searchTerm, page, limit },
      }),

      providesTags: ["booking"],
    }),

deleteBooking: builder.mutation<
  { success: boolean; message: string },
  string
>({
  query: (id) => ({
    url: `/class-booking/${id}`,
    method: "DELETE",
  }),

  invalidatesTags: ["booking"],
}),


    addBooking: builder.mutation<any, any>({
      query: (body) => ({
        url: "/class-booking/admin/booking",
        method: "POST",
        body,
      }),

      invalidatesTags: ["booking"],
    })
  }),
});

export const { useGetAllBookingsQuery, useAddBookingMutation, useDeleteBookingMutation } = classBookingApi;