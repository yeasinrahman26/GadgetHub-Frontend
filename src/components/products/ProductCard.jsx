"use client";

import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Eye } from "lucide-react";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error("Product is out of stock");
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        title: product.title,
        price: product.price,
        image: product.images?.[0] || "/placeholder.png",
        quantity: 1,
        stock: product.stock,
      }),
    );

    toast.success(`${product.title} added to cart!`);
  };

  // Render stars
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3.5 w-3.5 ${
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-muted text-muted"
        }`}
      />
    ));
  };

  return (
    <Link href={`/items/${product._id}`}>
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 border-border/50">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Image
            src={product.images?.[0] || "/placeholder.png"}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Out of stock overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                Out of Stock
              </Badge>
            </div>
          )}

          {/* Hover overlay with quick view */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-2"
            >
              <Eye className="h-4 w-4" />
              Quick View
            </Button>
          </div>

          {/* Category badge */}
          {product.category?.name && (
            <Badge className="absolute top-3 left-3 bg-primary/90 hover:bg-primary text-primary-foreground text-xs">
              {product.category.name}
            </Badge>
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 space-y-2">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
            {product.title}
          </h3>

          {/* Short Description */}
          {product.shortDesc && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {product.shortDesc}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center">
              {renderStars(product.averageRating)}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.totalReviews})
            </span>
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-primary">
            ${product.price?.toFixed(2)}
          </p>
        </CardContent>

        {/* Add to Cart */}
        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="w-full gap-2"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
            {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
