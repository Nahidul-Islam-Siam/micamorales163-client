/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

const contactUsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllContactUs: builder.query({
            query: ({ page, limit }) => ({
                url: "/contact-us",
                method: "GET",
                params: { page, limit },
            }),
            providesTags: ["ContactUs"],
            
        }),
                deleteContactUs: builder.mutation<any, string>({
            query: (id) => ({
                url: `/contact-us/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ContactUs"],
        }),

    }),
    overrideExisting: false,
});

export const {
    useGetAllContactUsQuery,
    useDeleteContactUsMutation,
} = contactUsApi;

export const { endpoints: contactUsEndpoints } = contactUsApi;
