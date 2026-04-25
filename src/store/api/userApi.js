import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all users (Admin)
    getUsers: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params?.search) searchParams.append("search", params.search);
        if (params?.role) searchParams.append("role", params.role);
        if (params?.page) searchParams.append("page", params.page);
        if (params?.limit) searchParams.append("limit", params.limit);
        return `/users?${searchParams.toString()}`;
      },
      providesTags: ["User"],
    }),

    // Update user role (Admin)
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),

    // Delete user (Admin)
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // Get dashboard stats (Admin)
    getDashboardStats: builder.query({
      query: () => "/users/stats",
      providesTags: ["User", "Product", "Order"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
  useGetDashboardStatsQuery,
} = userApi;
