/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

const contactUsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllContactUs: builder.query<any, void>({
            query: ({ page, limit }) => ({
                url: 
                method: "GET",
            }),
            
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllContactUsQuery,
} = contactUsApi;

export const { endpoints: contactUsEndpoints } = contactUsApi;
