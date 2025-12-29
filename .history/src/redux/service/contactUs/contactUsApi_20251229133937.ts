/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

interface LoginRequest {
  email: string;
  password: string;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
  
    forgatPassword: builder.mutation<any, { email: string }>({
      query: (user) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),
    resetPassword: builder.mutation({
      query: ({ user }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: user,

      }),
      invalidatesTags: ["auth"],
    }),
    changePassword: builder.mutation({
      query: (user) => ({
        url: "/auth/change-pass",
        method: "PATCH",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useForgatPasswordMutation,
  useResetPasswordMutation,
} = authApi;
export const { endpoints: authEndpoints } = authApi;
