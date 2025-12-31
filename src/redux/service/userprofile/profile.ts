// e.g., src/redux/api/profileApi.ts

import { baseApi } from "@/redux/api/baseApi";
// types/profile.ts or inside your API file

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
}



export interface UserProfile {
  id: string;
  username: string;
  email: string;
  password: string; // you may omit this in UI, but it's in response
  description: string | null;
  Gender: "MALE" | "FEMALE" | "OTHERS";
  location: string | null;
  contactNo: string | null;
  avatars: string;
  status: string;
  role: string;
  lang: "ENG" | string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
}

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
const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<UpdateProfileResponse, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: formData,
        // ⚠️ Do NOT set Content-Type — browser sets multipart automatically
      }),
      invalidatesTags: ["profile"],
    }),
  }),
});

export const { useUpdateProfileMutation } = profileApi;