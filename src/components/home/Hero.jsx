"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ShoppingBag,
  Zap,
  Truck,
  Shield,
  Sparkles,
} from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center py-20 md:py-32 space-y-8">
          {/* Badge */}
          <Badge
            variant="secondary"
            className="px-4 py-1.5 text-sm gap-2 animate-pulse"
          >
            <Sparkles className="h-3.5 w-3.5" />
            New Arrivals Just Dropped
          </Badge>

          {/* Heading */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Discover the <span className="text-primary">Latest Gadgets</span>
              <br />
              That Define{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Tomorrow
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our curated collection of cutting-edge smartphones,
              laptops, wearables, and accessories. Premium quality at prices you
              will love.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/items">
              <Button size="lg" className="gap-2 px-8 text-base">
                <ShoppingBag className="h-5 w-5" />
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 px-8 text-base"
              >
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 pt-8">
            <div className="flex flex-col items-center gap-2">
              <div className="bg-primary/10 rounded-full p-3">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">500+</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Products
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-primary/10 rounded-full p-3">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">24hr</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Fast Delivery
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="bg-primary/10 rounded-full p-3">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <p className="text-2xl md:text-3xl font-bold">100%</p>
              <p className="text-xs md:text-sm text-muted-foreground">
                Secure Payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
