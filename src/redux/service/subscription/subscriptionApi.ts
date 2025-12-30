import { baseApi } from "@/redux/api/baseApi";

// ======================
// Shared Types
// ======================

export interface CreateSubscriptionPayload {
  title: string;
  classLimit: number | null;
  creditAmount: number;
  price: number;
  validityTime: number;
  type: "UNLIMITED" | "EVENT" | "SIGNATURE" | "MEMBERSHIP";
  personLimit: number;
  classList: string[];
}

// ✅ New: Update payload allows optional fields
export interface UpdateSubscriptionPayload {
  title?: string;
  classLimit?: number | null;
  creditAmount?: number;
  price?: number;
  validityTime?: number;
  type?: "UNLIMITED" | "EVENT" | "SIGNATURE" | "MEMBERSHIP";
  personLimit?: number;
  classList?: string[];
}

export interface SubscriptionModel extends CreateSubscriptionPayload {
  id: string;
  adminId: string | null;
  createdAt: string;
  updatedAt: string;
}

// ======================
// API Response Types
// ======================

export interface GetAllSubscriptionModelsResponse {
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
    result: SubscriptionModel[];
  };
}

export interface SubscriptionActionResponse {
  message: string;
  success: boolean;
  meta: null;
  data: SubscriptionModel;
}

// ======================
// API Slice
// ======================

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubscriptionModels: builder.query<
      GetAllSubscriptionModelsResponse,
      { page: number; limit: number }
    >({
      query: ({ page, limit }) => ({
        url: "/subscription-model",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["subscriptionModel"],
    }),

    getSubsciptionModelById: builder.query<SubscriptionActionResponse, string>({
      query: (id) => ({
        url: `/subscription-model/${id}`,
        method: "GET",
      }),
      providesTags: ["subscriptionModel"],
    }),

    createSubscriptionModel: builder.mutation<
      SubscriptionActionResponse,
      CreateSubscriptionPayload
    >({
      query: (body) => ({
        url: "/subscription-model",
        method: "POST",
        body,
      }),
      invalidatesTags: ["subscriptionModel"],
    }),

    // ✅ Updated: cleaner arg type + correct payload
    updateSubscriptionModel: builder.mutation<
      SubscriptionActionResponse,
      { id: string; body: UpdateSubscriptionPayload } // ✅ only update fields
    >({
      query: ({ id, body }) => ({
        url: `/subscription-model/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["subscriptionModel"],
    }),

    deleteSubscriptionModel: builder.mutation<
      SubscriptionActionResponse,
      string
    >({
      query: (id) => ({
        url: `/subscription-model/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["subscriptionModel"],
    }),
  }),
  overrideExisting: false,
});

// ✅ Export all hooks
export const {
  useGetAllSubscriptionModelsQuery,
  useGetSubsciptionModelByIdQuery,
  useCreateSubscriptionModelMutation,
  useUpdateSubscriptionModelMutation, // ✅ don't forget this!
  useDeleteSubscriptionModelMutation,
} = subscriptionApi;