/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";



const contactUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
  getAllContactUs: builder.query<any, void>({
      query: () => ({
        url: "/contact-us",
        method: "GET",
      }),
  
  }),
});

export const {
 
} = contactUsApi;
export const { endpoints: contactUsEndpoints } = contactUsApi;