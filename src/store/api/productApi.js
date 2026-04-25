import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with filters
    getProducts: builder.query({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.search) searchParams.append("search", params.search);
        if (params?.category) searchParams.append("category", params.category);
        if (params?.brand) searchParams.append("brand", params.brand);
        if (params?.minPrice) searchParams.append("minPrice", params.minPrice);
        if (params?.maxPrice) searchParams.append("maxPrice", params.maxPrice);
        if (params?.rating) searchParams.append("rating", params.rating);
        if (params?.sort) searchParams.append("sort", params.sort);
        if (params?.page) searchParams.append("page", params.page);
        if (params?.limit) searchParams.append("limit", params.limit);

        return `/products?${searchParams.toString()}`;
      },
      providesTags: ["Product"],
    }),

    // Get single product
    getProduct: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    // Get related products
    getRelatedProducts: builder.query({
      query: (id) => `/products/${id}/related`,
      providesTags: ["Product"],
    }),

    // Create product (Mod/Admin)
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Update product (Mod/Admin)
    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    // Delete product (Admin)
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useGetRelatedProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
