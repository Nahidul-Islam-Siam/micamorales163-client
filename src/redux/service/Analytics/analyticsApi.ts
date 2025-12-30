/* eslint-disable @typescript-eslint/no-explicit-any */
// Inside your subscriptionApi.ts (or analyticsApi.ts)

import baseApi from "@/redux/api/baseApi";

// ======================
// Analytics Overview Types
// ======================

export interface AnalyticsOverviewData {
  totalRevenue: number;
  activeUsers: number;
  complatePayments: number; // (note: API typo — keep as-is)
  totalSubscriptions: number;
}

export interface AnalyticsOverviewResponse {
  message: string;
  success: boolean;
  meta: null;
  data: AnalyticsOverviewData;
}

// ======================
// Analytics Chart Types
// ======================

export interface ChartDataItem {
  category: string;
  value: number;
}

export interface AnalyticsChartData {
  dataRef: Record<string, any>; // or more specific if known
  heightRevenue: number;
  data: ChartDataItem[];
}

export interface AnalyticsChartResponse {
  message: string;
  success: boolean;
  meta: null;
  data: AnalyticsChartData;
}

// ======================
// API Slice
// ======================

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ... your existing subscription endpoints

    // ✅ Analytics Overview
    getAnalyticsOverview: builder.query<AnalyticsOverviewResponse, void>({
      query: () => ({
        url: "/analytics/overview",
        method: "GET",
      }),
    }),

    // ✅ Analytics Chart Data
    getAnalyticsChartData: builder.query<AnalyticsChartResponse, void>({
      query: () => ({
        url: "/analytics/charts",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

// ✅ Export all hooks
export const {
  // ... your subscription hooks
  useGetAnalyticsOverviewQuery,
  useGetAnalyticsChartDataQuery, // ✅ don't forget this!
} = subscriptionApi;