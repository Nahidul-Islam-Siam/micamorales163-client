/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";



const contactUsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
  getAllContactUs
  
  }),
});

export const {
 
} = contactUsApi;
export const { endpoints: contactUsEndpoints } = contactUsApi;