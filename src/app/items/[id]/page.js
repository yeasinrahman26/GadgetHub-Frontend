"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetProductQuery, useGetRelatedProductsQuery } from "@/store/api/productApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/slices/cartSlice";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ProductCard from "@/components/products/ProductCard";
import ReviewSection from "@/components/products/ReviewSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Star,
  Minus,
  Plus,
  ChevronLeft,
  Package,
  Truck,
  Shield,
  RotateCcw,
  Check,
  AlertTriangle,
} from "lucide-react";

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Fetch product
  const { data, isLoading, error } = useGetProductQuery(id);
  const product = data?.data;

  // Fetch related products
  const { data: relatedData, isLoading: relatedLoading } =
    useGetRelatedProductsQuery(id, {
      skip: !product,
    });
  const relatedProducts = relatedData?.data || [];

  // Handle quantity change
  const increaseQty = () => {
    if (quantity < (product?.stock || 1)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
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
        quantity,
        stock: product.stock,
      })
    );

    toast.success(`${product.title} added to cart!`);
  };

  // Render stars
  const renderStars = (rating, size = "h-4 w-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-muted text-muted"
        }`}
      />
    ));
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Error
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto" />
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <p className="text-muted-foreground">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/items">
            <Button className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/items"
              className="hover:text-primary transition-colors"
            >
              Shop
            </Link>
            <span>/</span>
            {product.category?.name && (
              <>
                <Link
                  href={`/items?category=${product.category._id}`}
                  className="hover:text-primary transition-colors"
                >
                  {product.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {product.title}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Left - Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border">
              <Image
                src={product.images?.[selectedImage] || "/placeholder.png"}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {/* Stock badge */}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <Badge variant="destructive" className="text-lg px-4 py-2">
                    Out of Stock
                  </Badge>
                </div>
              )}

              {product.stock > 0 && product.stock <= 5 && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  Only {product.stock} left!
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images?.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === index
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right - Product Info */}
          <div className="space-y-6">
            {/* Category & Brand */}
            <div className="flex items-center gap-2 flex-wrap">
              {product.category?.name && (
                <Link href={`/items?category=${product.category._id}`}>
                  <Badge variant="secondary">{product.category.name}</Badge>
                </Link>
              )}
              {product.brand && (
                <Badge className="bg-emerald-600 rounded-xl ">
                  {product.brand}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {renderStars(product.averageRating)}
              </div>
              <span className="text-sm text-muted-foreground">
                {product.averageRating?.toFixed(1)} ({product.totalReviews}{" "}
                {product.totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Price */}
            <div className="space-y-1">
              <p className="text-3xl md:text-4xl font-bold text-primary">
                ${product.price?.toFixed(2)}
              </p>
            </div>

            {/* Short Description */}
            {product.shortDesc && (
              <p className="text-muted-foreground leading-relaxed">
                {product.shortDesc}
              </p>
            )}

            <Separator />

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 0 ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm text-emerald-500 font-medium">
                    In Stock ({product.stock} available)
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-sm text-destructive font-medium">
                    Out of Stock
                  </span>
                </>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Quantity Selector */}
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={decreaseQty}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-r-none"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-14 text-center text-sm font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={increaseQty}
                    disabled={quantity >= product.stock}
                    className="h-10 w-10 rounded-l-none"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="flex-1 gap-2  text-white"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
              </div>
            )}

            <Separator />

            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Truck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-xs text-muted-foreground">
                    Orders over \$50
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Warranty</p>
                  <p className="text-xs text-muted-foreground">
                    1 Year Guarantee
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-primary/10 rounded-lg p-2">
                  <RotateCcw className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Easy Returns</p>
                  <p className="text-xs text-muted-foreground">
                    30 Day Returns
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-primary/10 rounded-lg p-2">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Secure Package</p>
                  <p className="text-xs text-muted-foreground">Safe Delivery</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs - Description, Specs, Reviews */}
        <Tabs defaultValue="description" className="mb-16 flex-col">
          <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="specs"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Specifications
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
            >
              Reviews ({product.totalReviews})
            </TabsTrigger>
          </TabsList>

          {/* Description Tab */}
          <TabsContent value="description" className="pt-6">
            <div className="max-w-3xl">
              {product.fullDesc ? (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {product.fullDesc}
                </p>
              ) : (
                <p className="text-muted-foreground">
                  No detailed description available for this product.
                </p>
              )}
            </div>
          </TabsContent>

          {/* Specs Tab */}
          <TabsContent value="specs" className="pt-6">
            {product.specs && Object.keys(product.specs).length > 0 ? (
              <div className="max-w-2xl">
                <div className="rounded-lg border overflow-hidden">
                  {Object.entries(product.specs).map(([key, value], index) => (
                    <div
                      key={key}
                      className={`flex ${
                        index % 2 === 0 ? "bg-muted/30" : "bg-background"
                      }`}
                    >
                      <div className="w-1/3 px-4 py-3 font-medium text-sm border-r">
                        {key}
                      </div>
                      <div className="w-2/3 px-4 py-3 text-sm text-muted-foreground">
                        {value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                No specifications available for this product.
              </p>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="pt-6">
            <ReviewSection
              productId={product._id}
              averageRating={product.averageRating}
              totalReviews={product.totalReviews}
            />
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Link href={`/items?category=${product.category?._id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  View More
                  <ChevronLeft className="h-4 w-4 rotate-180" />
                </Button>
              </Link>
            </div>

            {relatedLoading ? (
              <LoadingSpinner size="lg" className="py-10" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedProducts.slice(0, 4).map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}