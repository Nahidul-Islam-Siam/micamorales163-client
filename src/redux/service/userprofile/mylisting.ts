/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// --- Class Time Slot (for CREATE payload - simplified) ---
export interface CreateClassTimeSlot {
  startTime: string; // "18:00"
  endTime: string;   // "19:15"
  maxSpace?: number; // optional, inherited from class
}

// --- Class Schedule (for CREATE payload) ---
export interface CreateClassSchedule {
  dateTime: string; // ISO date: "2025-01-10T00:00:00.000Z"
  classTimeSlot: CreateClassTimeSlot[];
}

// --- Main payload for creating a class offering ---
export interface CreateClassOfferingPayload {
  name: string;
  description: string;
  instructorName: string;
  instructorDescription: string;
  type: "MEMBERSHIP" | "SIGNATURE" | "EVENT";
  price: number;
  durationMinutes: number;
  maxSpace: number;
  detailsDescription: string;
  schedules: CreateClassSchedule[];
}

// --- Full Class Offering (response from API) ---
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

export interface ClassSchedule {
  id: string;
  dateTime: string;
  classOfferingId: string;
  createdAt: string;
  updatedAt: string;
  classTimeSlot: ClassTimeSlot[];
}

export interface ClassOffering {
  id: string;
  name: string;
  description: string;
  basicInfo: string;
  instructorName: string;
  instructorDescription: string;
  instructorImage: string | null;
  type: "MEMBERSHIP" | "SIGNATURE" | "EVENT";
  publicationStatus: "PUBLISHED" | "DRAFT";
  price: number;
  durationMinutes: number;
  maxSpace: number;
  image: string | null;
  detailsDescription: string;
  createdAt: string;
  updatedAt: string;
  schedules: ClassSchedule[];
}

// --- API Response Wrappers ---
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
    result: ClassOffering[];
  };
}

// Response after create (adjust based on your actual API response)
export interface CreateClassOfferingResponse {
  message: string;
  success: boolean;
  data: ClassOffering;
}

// --- API Endpoints ---
const classOfferingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClassOfferings: builder.query<ClassOfferingListResponse, void>({
      query: () => ({
        url: "/class-type",
        method: "GET",
      }),
      providesTags: ["classOffering"],
    }),

    // ✅ Properly typed mutation
    createClassOffering: builder.mutation<CreateClassOfferingResponse, FormData>({
      query: (formData) => ({
        url: "/class-type",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["classOffering"],
    }),
  }),
});

export const { useGetClassOfferingsQuery, useCreateClassOfferingMutation } = classOfferingApi;