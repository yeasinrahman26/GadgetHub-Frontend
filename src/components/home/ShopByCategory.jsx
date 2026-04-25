"use client";

import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Grid3X3 } from "lucide-react";

export default function ShopByCategory() {
  const { data, isLoading, error } = useGetCategoriesQuery();

  const categories = data?.data || [];

  // Fallback icons/colors for categories without images
  const fallbackGradients = [
    "from-blue-500/20 to-blue-600/20",
    "from-purple-500/20 to-purple-600/20",
    "from-emerald-500/20 to-emerald-600/20",
    "from-orange-500/20 to-orange-600/20",
    "from-pink-500/20 to-pink-600/20",
    "from-cyan-500/20 to-cyan-600/20",
  ];

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="flex items-center justify-center gap-2">
            <Grid3X3 className="h-5 w-5 text-primary" />
            <p className="text-sm font-medium text-primary uppercase tracking-wider">
              Browse Categories
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Shop by Category</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Find exactly what you are looking for by browsing our product
            categories.
          </p>
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
            <p className="text-muted-foreground">Failed to load categories.</p>
          </div>
        )}

        {/* Categories Grid */}
        {!isLoading && !error && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link key={category._id} href={`/items?category=${category._id}`}>
                <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 border-border/50 cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                    {/* Category Image */}
                    <div
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br ${
                        fallbackGradients[index % fallbackGradients.length]
                      } flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                    >
                      {category.image &&
                      category.image !== "" &&
                      !category.image.includes("example.com") ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      ) : (
                        <Grid3X3 className="h-8 w-8 text-primary" />
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>

                    {/* Arrow */}
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && !error && categories.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">
              No categories available yet.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
