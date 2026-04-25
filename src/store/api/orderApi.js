import { apiSlice } from "./apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Create order (User or Guest)
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/orders",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Order"],
    }),

    // Get user's orders
    getMyOrders: builder.query({
      query: () => "/orders",
      providesTags: ["Order"],
    }),

    // Get guest orders
    getGuestOrders: builder.query({
      query: (guestId) => `/orders/guest/${guestId}`,
      providesTags: ["Order"],
    }),

    // Get single order
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    // Get all orders (Admin)
    getAllOrders: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.status) searchParams.append("status", params.status);
        if (params?.page) searchParams.append("page", params.page);
        if (params?.limit) searchParams.append("limit", params.limit);
        return `/orders/all?${searchParams.toString()}`;
      },
      providesTags: ["Order"],
    }),

    // Update order status (Admin)
    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/orders/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useGetGuestOrdersQuery,
  useGetOrderQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;
