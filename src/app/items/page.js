"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetProductsQuery } from "@/store/api/productApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import ProductCard from "@/components/products/ProductCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  LayoutGrid,
  Star,
} from "lucide-react";

export default function ItemsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter states from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    brand: searchParams.get("brand") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    rating: searchParams.get("rating") || "",
    sort: searchParams.get("sort") || "-createdAt",
    page: parseInt(searchParams.get("page")) || 1,
  });

  // Search input (debounced)
  const [searchInput, setSearchInput] = useState(filters.search);

  // Fetch products
  const { data, isLoading, isFetching } = useGetProductsQuery({
    ...filters,
    limit: 12,
  });

  // Fetch categories for filter
  const { data: categoriesData } = useGetCategoriesQuery();

  const products = data?.data || [];
  const pagination = data?.pagination || {};
  const categories = categoriesData?.data || [];

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.rating) params.set("rating", filters.rating);
    if (filters.sort && filters.sort !== "-createdAt")
      params.set("sort", filters.sort);
    if (filters.page > 1) params.set("page", filters.page);

    const queryString = params.toString();
    router.push(`/items${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    });
  }, [filters, router]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      rating: "",
      sort: "-createdAt",
      page: 1,
    });
  };

  // Check if any filters are active
  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.brand ||
    filters.minPrice ||
    filters.maxPrice ||
    filters.rating;

  // Count active filters
  const activeFilterCount = [
    filters.category,
    filters.brand,
    filters.minPrice || filters.maxPrice,
    filters.rating,
  ].filter(Boolean).length;

  // Sort options
  const sortOptions = [
    { value: "-createdAt", label: "Newest First" },
    { value: "createdAt", label: "Oldest First" },
    { value: "price", label: "Price: Low to High" },
    { value: "-price", label: "Price: High to Low" },
    { value: "-averageRating", label: "Highest Rated" },
    { value: "title", label: "Name: A to Z" },
    { value: "-title", label: "Name: Z to A" },
  ];

  // Rating options
  const ratingOptions = [
    { value: "4", label: "4★ & above" },
    { value: "3", label: "3★ & above" },
    { value: "2", label: "2★ & above" },
    { value: "1", label: "1★ & above" },
  ];

  // Filter sidebar content (shared between desktop & mobile)
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Category
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => handleFilterChange("category", "")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !filters.category
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-accent/50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => handleFilterChange("category", cat._id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.category === cat._id
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent/50"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Price Range
        </h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            className="h-9"
            min="0"
          />
          <span className="text-muted-foreground text-sm">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            className="h-9"
            min="0"
          />
        </div>
      </div>

      <Separator />

      {/* Brand */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Brand
        </h3>
        <Input
          type="text"
          placeholder="Filter by brand..."
          value={filters.brand}
          onChange={(e) => handleFilterChange("brand", e.target.value)}
          className="h-9"
        />
      </div>

      <Separator />

      {/* Rating */}
      <div className="space-y-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Rating
        </h3>
        <div className="space-y-1">
          <button
            onClick={() => handleFilterChange("rating", "")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
              !filters.rating
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-accent/50"
            }`}
          >
            All Ratings
          </button>
          {ratingOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleFilterChange("rating", option.value)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                filters.rating === option.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "hover:bg-accent/50"
              }`}
            >
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < parseInt(option.value)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-muted text-muted"
                    }`}
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => {
            clearFilters();
            setMobileFiltersOpen(false);
          }}
        >
          <X className="h-4 w-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Shop</h1>
          </div>
          <p className="text-muted-foreground">
            Discover our wide range of gadgets and tech accessories
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Top Bar - Search + Sort + Filter Toggle */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 h-10"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {/* Sort */}
            <Select
              value={filters.sort}
              onValueChange={(value) => handleFilterChange("sort", value)}
            >
              <SelectTrigger className="w-[180px] h-10">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile Filter Toggle */}
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden gap-2 h-10 relative"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Filters Tags */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Active:</span>

            {filters.search && (
              <Badge variant="secondary" className="gap-1">
                Search: {filters.search}
                <button
                  onClick={() => {
                    setSearchInput("");
                    handleFilterChange("search", "");
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.category && (
              <Badge variant="secondary" className="gap-1">
                Category:{" "}
                {categories.find((c) => c._id === filters.category)?.name ||
                  filters.category}
                <button onClick={() => handleFilterChange("category", "")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.brand && (
              <Badge variant="secondary" className="gap-1">
                Brand: {filters.brand}
                <button onClick={() => handleFilterChange("brand", "")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(filters.minPrice || filters.maxPrice) && (
              <Badge variant="secondary" className="gap-1">
                Price: ${filters.minPrice || "0"} - ${filters.maxPrice || "∞"}
                <button
                  onClick={() => {
                    handleFilterChange("minPrice", "");
                    handleFilterChange("maxPrice", "");
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.rating && (
              <Badge variant="secondary" className="gap-1">
                Rating: {filters.rating}★+
                <button onClick={() => handleFilterChange("rating", "")}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            <button
              onClick={clearFilters}
              className="text-xs text-primary hover:underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-20 space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary">{activeFilterCount}</Badge>
                )}
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {pagination.total
                  ? `Showing ${(pagination.page - 1) * pagination.limit + 1}-${Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )} of ${pagination.total} products`
                  : "No products found"}
              </p>
              <div className="flex items-center gap-1 text-muted-foreground">
                <LayoutGrid className="h-4 w-4" />
              </div>
            </div>

            {/* Loading */}
            {(isLoading || isFetching) && (
              <div className="py-20">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Products */}
            {!isLoading && !isFetching && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !isFetching && products.length === 0 && (
              <div className="text-center py-20 space-y-4">
                <div className="bg-muted/50 rounded-full p-6 w-fit mx-auto">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search or filters to find what you are
                  looking for.
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={pagination.page <= 1}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: prev.page - 1,
                    }))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {/* Page Numbers */}
                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first, last, current, and neighbors
                    return (
                      page === 1 ||
                      page === pagination.pages ||
                      Math.abs(page - pagination.page) <= 1
                    );
                  })
                  .map((page, index, arr) => (
                    <div key={page} className="flex items-center">
                      {/* Ellipsis */}
                      {index > 0 && arr[index - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={
                          pagination.page === page ? "default" : "outline"
                        }
                        size="icon"
                        onClick={() =>
                          setFilters((prev) => ({ ...prev, page }))
                        }
                        className="h-9 w-9"
                      >
                        {page}
                      </Button>
                    </div>
                  ))}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      page: prev.page + 1,
                    }))
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
