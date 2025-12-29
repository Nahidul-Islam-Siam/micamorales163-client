/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { logout } from "../features/auth";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://62.72.7.35:9000/api/v1",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.token;

    if (token) {
      headers.set("Authorization", `${token}`);
    }

    return headers;
  },
  credentials: "include",
});

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    return result;
  },
  tagTypes: ["auth", "roofing", "window"],
  endpoints: () => ({}),
});

export default baseApi;
