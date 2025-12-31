/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

interface LoginRequest {
  email: string;
  password: string;
}

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (user) => ({
        url: "/auth/register",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),

         getme: builder.query({
            query: ({ page, limit }) => ({
                url: "/auth/get-me",
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["auth"],
          }),


      updateGetMe: builder.mutation({
      query: ({id,body}) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body
      }),
      invalidatesTags: ["auth"],
    }),

    
    loginUser: builder.mutation<any, LoginRequest>({
      query: (user) => ({
        url: "/auth/login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["auth"],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["auth"],
    }),
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

  
    createAdmin: builder.mutation({
      query: ({ body }) => ({
        url: "/users/create-admin",
        method: "POST",
        body

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
  useGetmeQuery,
  useUpdateGetMeMutation,
  useCreateAdminMutation
} = authApi;
export const { endpoints: authEndpoints } = authApi;
