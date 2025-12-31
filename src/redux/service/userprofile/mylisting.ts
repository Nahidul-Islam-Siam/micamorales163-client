/* eslint-disable @typescript-eslint/no-explicit-any */
// e.g., src/redux/api/classOfferingApi.ts

import { baseApi } from "@/redux/api/baseApi";

// --- Class Time Slot ---
export interface ClassTimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  maxSpace: number | null;
  bookedSpace: number;
  classScheduleId: string;
  createdAt: string;
  updatedAt: string;
}

// --- Class Schedule ---
export interface ClassSchedule {
  id: string;
  dateTime: string;
  classOfferingId: string;
  createdAt: string;
  updatedAt: string;
  classTimeSlot: ClassTimeSlot[];
}

// --- Class Offering (main entity) ---
export interface ClassOffering {
  id: string;
  name: string;
  description: string;
  basicInfo: string;
  instructorName: string;
  instructorDescription: string;
  instructorImage: string | null;
  type: "MEMBERSHIP" | "SIGNATURE" | "EVENT"; // based on your data
  publicationStatus: "PUBLISHED" | "DRAFT"; // based on your data
  price: number;
  durationMinutes: number;
  maxSpace: number;
  image: string | null;
  detailsDescription: string;
  createdAt: string;
  updatedAt: string;
  schedules: ClassSchedule[];
}

// --- API Response Wrapper ---
export interface ClassOfferingListResponse {
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
    result: ClassOffering[]; // Note: it's "result", not "filterOnlyCustomerList"
  };
}

// Update the API endpoint name and return type
const classOfferingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Rename to reflect what it actually does
    getClassOfferings: builder.query<ClassOfferingListResponse, void>({
      query: () => ({
        url: "/class-type",
        method: "GET",
      }),
    }),
  }),
});

// Export the correct hook name
export const { useGetClassOfferingsQuery } = classOfferingApi;