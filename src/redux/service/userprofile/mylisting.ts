/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

// --- Class Time Slot (for CREATE payload - simplified) ---
export interface CreateClassTimeSlot {
  startTime: string; // "18:00" (HH:mm format)
  endTime: string;   // "19:15" (HH:mm format)
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

// --- Class Booking (from GET response) ---
export interface ClassBooking {
  id: string;
  customerId: string;
  name: string | null;
  phoneNumber: string | null;
  email: string | null;
  bookingDate: string;
  classOfferingId: string;
  classScheduleId: string | null;
  classTimeSlotId: string | null;
  numberOfPersonBook: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  classSchedule: any; // null in your response
  classTimeSlot: any; // null in your response
}

// --- Full Class Time Slot (from GET response) ---
// ⚠️ IMPORTANT: startTime/endTime are ISO datetime strings, NOT HH:mm
export interface ClassTimeSlot {
  id: string;
  startTime: string; // "2025-12-25T12:00:00.000Z" (full ISO datetime)
  endTime: string;   // "2025-12-25T13:15:00.000Z" (full ISO datetime)
  maxSpace: number | null;
  bookedSpace: number;
  classScheduleId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassSchedule {
  id: string;
  dateTime: string; // "2025-01-10T00:00:00.000Z"
  classOfferingId: string;
  createdAt: string;
  updatedAt: string;
  classTimeSlot: ClassTimeSlot[];
}

// --- Full Class Offering (response from API) ---
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
  classBooking: ClassBooking[]; // ✅ Added missing field
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

// Response for single class offering GET
export interface ClassOfferingResponse {
  message: string;
  success: boolean;
  meta: null;
  data: ClassOffering; // ✅ Single object, not array
}

// Response after create/update
export interface CreateClassOfferingResponse {
  message: string;
  success: boolean;
  data: ClassOffering;
}

// ✅ Response for delete operation
export interface DeleteClassOfferingResponse {
  message: string;
  success: boolean;
  meta: null;
  data: null; // Typically no data returned on delete
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

    // ✅ Updated: Returns ClassOfferingResponse (with .data wrapper)
    getClassOfferingById: builder.query<ClassOfferingResponse, string>({
      query: (id) => ({
        url: `/class-type/${id}`,
        method: "GET",
      }),
      providesTags: ["classOffering"],
    }),

    createClassOffering: builder.mutation<CreateClassOfferingResponse, FormData>({
      query: (formData) => ({
        url: "/class-type",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["classOffering"],
    }),

    updateClassOfferingById: builder.mutation<CreateClassOfferingResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/class-type/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["classOffering"],
    }),

    // ✅ Updated with proper response type
    deleteClassOfferingById: builder.mutation<DeleteClassOfferingResponse, string>({
      query: (id) => ({
        url: `/class-type/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["classOffering"],
    }),
  }),
});

export const {
  useGetClassOfferingsQuery,
  useGetClassOfferingByIdQuery,
  useCreateClassOfferingMutation,
  useUpdateClassOfferingByIdMutation,
  useDeleteClassOfferingByIdMutation,
} = classOfferingApi;