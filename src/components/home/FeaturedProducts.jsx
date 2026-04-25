"use client";

import { useGetProductsQuery } from "@/store/api/productApi";
import ProductCard from "@/components/products/ProductCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function FeaturedProducts() {
  // Fetch latest 8 products sorted by newest
  const { data, isLoading, error } = useGetProductsQuery({
    limit: 8,
    sort: "-createdAt",
  });

  const products = data?.data || [];

  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <p className="text-sm font-medium text-primary uppercase tracking-wider">
                Trending Now
              </p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Featured Products
            </h2>
            <p className="text-muted-foreground max-w-md">
              Check out our latest and most popular gadgets handpicked just for
              you.
            </p>
          </div>
          <Link href="/items">
            <Button variant="outline" className="gap-2">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              Failed to load products. Please try again later.
            </p>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No products available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
