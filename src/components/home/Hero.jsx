"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  ArrowRight,
  ShoppingBag,
  Zap,
  Truck,
  Shield,
  Sparkles,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
  Monitor,
  Tablet,
  Speaker,
  Cpu,
  ChevronDown,
  Grid3X3,
} from "lucide-react";



const categoryStyles = [
  { color: "#3b82f6", gradient: "from-blue-500/20 to-blue-600/20" },
  { color: "#8b5cf6", gradient: "from-purple-500/20 to-purple-600/20" },
  { color: "#10b981", gradient: "from-emerald-500/20 to-emerald-600/20" },
  { color: "#f97316", gradient: "from-orange-500/20 to-orange-600/20" },
  { color: "#ec4899", gradient: "from-pink-500/20 to-pink-600/20" },
  { color: "#06b6d4", gradient: "from-cyan-500/20 to-cyan-600/20" },
  { color: "#ef4444", gradient: "from-red-500/20 to-red-600/20" },
  { color: "#f59e0b", gradient: "from-amber-500/20 to-amber-600/20" },
];

// ─── Morphing Blob SVG ────────────────────────────────
function MorphBlob({ className, color, delay = 0 }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.5, delay }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          fill={color}
          animate={{
            d: [
              "M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.6C64.8,54.1,53.8,64.5,41,71.8C28.2,79.1,14.1,83.3,-0.7,84.5C-15.6,85.7,-31.1,83.9,-44.2,76.9C-57.3,69.9,-68,57.7,-75.4,43.8C-82.8,29.9,-86.9,14.9,-86.6,0.2C-86.3,-14.6,-81.5,-29.2,-73.5,-41.6C-65.5,-54,-54.2,-64.2,-41.2,-72C-28.2,-79.7,-14.1,-85,0.7,-86.2C15.5,-87.4,30.6,-83.5,44.7,-76.4Z",
              "M39.5,-67.5C52.9,-60.2,66.8,-53.2,75.2,-41.9C83.6,-30.6,86.5,-15.3,85.4,-0.6C84.4,14.1,79.3,28.2,71.5,40.5C63.7,52.8,53.1,63.3,40.5,70.3C27.9,77.3,13.9,80.8,-0.5,81.6C-14.9,82.4,-29.9,80.5,-42.6,73.8C-55.4,67.1,-66,55.5,-73.2,42.1C-80.5,28.7,-84.4,14.4,-83.9,0.3C-83.4,-13.8,-78.4,-27.6,-70.7,-39.4C-63,-51.2,-52.5,-61,-40.3,-68.9C-28.1,-76.8,-14,-82.8,-0.1,-82.6C13.8,-82.4,27.7,-76,39.5,-67.5Z",
              "M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C87,14.6,81.4,29.1,73.1,41.6C64.8,54.1,53.8,64.5,41,71.8C28.2,79.1,14.1,83.3,-0.7,84.5C-15.6,85.7,-31.1,83.9,-44.2,76.9C-57.3,69.9,-68,57.7,-75.4,43.8C-82.8,29.9,-86.9,14.9,-86.6,0.2C-86.3,-14.6,-81.5,-29.2,-73.5,-41.6C-65.5,-54,-54.2,-64.2,-41.2,-72C-28.2,-79.7,-14.1,-85,0.7,-86.2C15.5,-87.4,30.6,-83.5,44.7,-76.4Z",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          transform="translate(100 100)"
        />
      </svg>
    </motion.div>
  );
}

// ─── Animated Counter ─────────────────────────────────
function AnimatedCounter({ value, suffix, duration = 2 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000 });
  const displayValue = useTransform(springValue, (v) => Math.floor(v));

  if (isInView) {
    motionValue.set(value);
  }

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
}

// ─── Parallax Floating Icon ──────────────────────────
function FloatingIcon({ Icon, color, x, y, size = 24, scrollYProgress }) {
  const yFloat = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -150 - Math.random() * 100],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.8, 1],
    [0.15, 0.25, 0.15, 0],
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
  );

  return (
    <motion.div
      className="absolute hidden lg:block"
      style={{ top: y, left: x, y: yFloat, opacity, rotate }}
    >
      <Icon size={size} style={{ color }} />
    </motion.div>
  );
}

// ─── Category Card (Real Data) ────────────────────────
function CategoryCard({ category, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const style = categoryStyles[index % categoryStyles.length];
  const hasImage =
    category.image &&
    category.image !== "" &&
    !category.image.includes("example.com");

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <Link href={`/items?category=${category._id}`}>
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <Card className="group h-full overflow-hidden border-border/50 cursor-pointer bg-card/50 backdrop-blur-sm relative">
            {/* Hover glow */}
            <motion.div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: `radial-gradient(circle at 50% 50%, ${style.color}15, transparent 70%)`,
              }}
            />

            {/* Top accent line */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-full z-10"
              style={{ background: style.color }}
              initial={{ scaleX: 0 }}
              whileHover={{ scaleX: 1 }}
              transition={{ duration: 0.3 }}
            />

            <CardContent className="p-5 md:p-6 flex flex-col items-center text-center space-y-3 relative z-10">
              {/* Category Image / Fallback */}
              <motion.div
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden bg-gradient-to-br ${style.gradient} flex items-center justify-center`}
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
                style={{ border: `1px solid ${style.color}20` }}
              >
                {hasImage ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="80px"
                  />
                ) : (
                  <Grid3X3
                    className="h-7 w-7 md:h-8 md:w-8"
                    style={{ color: style.color }}
                  />
                )}
              </motion.div>

              {/* Name */}
              <h3 className="font-semibold text-sm md:text-base group-hover:text-primary transition-colors">
                {category.name}
              </h3>

              {/* Description (if exists) */}
              {category.description && (
                <p className="text-xs text-muted-foreground line-clamp-1 hidden md:block">
                  {category.description}
                </p>
              )}

              {/* Arrow */}
              <motion.div
                className="text-muted-foreground group-hover:text-primary transition-colors"
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
              >
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── Stat Card ────────────────────────────────────────
function StatCard({ icon: Icon, value, suffix, label, gradient, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center gap-3 p-6"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        type: "spring",
        stiffness: 100,
      }}
    >
      <motion.div
        className={`bg-gradient-to-br ${gradient} rounded-2xl p-3 shadow-lg`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon className="h-5 w-5 text-white" />
      </motion.div>
      <div className="text-center">
        <p className="text-3xl md:text-4xl font-bold">
          <AnimatedCounter value={value} suffix={suffix} />
        </p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════
// ─── MAIN HERO COMPONENT ─────────────────────────────
// ═══════════════════════════════════════════════════════
export default function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Fetch real categories
  const {
    data,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetCategoriesQuery();
  const categories = data?.data || [];

  // Parallax transforms
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const scaleHero = useTransform(scrollYProgress, [0, 0.4], [1, 0.95]);

  // Floating icon configs
  const floatingConfigs = [
    { Icon: Smartphone, color: "#3b82f680", x: "8%", y: "12%", size: 28 },
    { Icon: Laptop, color: "#8b5cf680", x: "85%", y: "18%", size: 32 },
    { Icon: Watch, color: "#ec489980", x: "12%", y: "65%", size: 22 },
    { Icon: Headphones, color: "#f9731680", x: "88%", y: "60%", size: 26 },
    { Icon: Camera, color: "#10b98180", x: "5%", y: "40%", size: 20 },
    { Icon: Gamepad2, color: "#ef444480", x: "92%", y: "38%", size: 24 },
    { Icon: Monitor, color: "#06b6d480", x: "18%", y: "85%", size: 22 },
    { Icon: Tablet, color: "#f59e0b80", x: "78%", y: "82%", size: 24 },
  ];

  return (
    <div ref={containerRef}>
      {/* ─── SCENE 1: Immersive Hero ──────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background layers with parallax */}
        <motion.div className="absolute inset-0" style={{ y: bgY }}>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.03] via-background to-background" />

          {/* Morphing blobs */}
          <MorphBlob
            className="w-[500px] h-[500px] -top-20 -left-20 opacity-30 dark:opacity-20"
            color="hsl(var(--primary) / 0.08)"
            delay={0}
          />
          <MorphBlob
            className="w-[600px] h-[600px] -bottom-40 -right-20 opacity-30 dark:opacity-20"
            color="hsl(var(--accent) / 0.08)"
            delay={0.3}
          />
          <MorphBlob
            className="w-[400px] h-[400px] top-1/3 left-1/2 -translate-x-1/2 opacity-20 dark:opacity-10"
            color="hsl(var(--primary) / 0.06)"
            delay={0.6}
          />

          {/* Dot grid */}
          <div
            className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle, currentColor 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </motion.div>

        {/* Floating parallax icons */}
        {floatingConfigs.map((config, i) => (
          <FloatingIcon key={i} {...config} scrollYProgress={scrollYProgress} />
        ))}

        {/* Hero content */}
        <motion.div
          className="container mx-auto px-4 relative z-10 text-center"
          style={{ y: textY, opacity: opacityHero, scale: scaleHero }}
        >
          <motion.div className="flex flex-col items-center  space-y-8 py-20">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge
                variant="secondary"
                className="px-5 py-2 text-sm gap-2  "
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                The Future of Tech Shopping
                <Sparkles className="h-3.5 w-3.5 text-accent" />
              </Badge>
            </motion.div>

            {/* Headline — word by word blur reveal */}
            <div className="max-w-5xl space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05]">
                {["Discover", "the", "Latest"].map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-[0.3em]"
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                  >
                    {word}
                  </motion.span>
                ))}
                <br />
                <motion.span
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"
                  initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  Gadgets
                </motion.span>
              </h1>

              <motion.p
                className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                Premium smartphones, laptops, wearables & accessories —{" "}
                <span className="text-foreground font-medium">
                  curated for you
                </span>
              </motion.p>
            </div>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <Link href="/items">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    size="lg"
                    className="gap-2 px-10 py-6 text-base rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Start Shopping
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </motion.span>
                  </Button>
                </motion.div>
              </Link>
              <Link href="/about">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 px-10 py-6 text-base rounded-full border-primary/20"
                  >
                    Our Story
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="pt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
            >
              <motion.div
                className="flex flex-col items-center gap-2 text-muted-foreground/40 cursor-pointer"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                onClick={() =>
                  document
                    .getElementById("categories-section")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <span className="text-[10px] uppercase tracking-[0.25em] font-medium">
                  Explore
                </span>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
      </section>

      {/* ─── SCENE 2: Categories from API ─────────────── */}
      <section
        id="categories-section"
        className="relative py-20 md:py-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section header */}
          <motion.div
            className="text-center mb-16 space-y-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <motion.div
              className="flex items-center justify-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Grid3X3 className="h-4 w-4 text-primary" />
              <motion.span
                className="text-xs uppercase tracking-[0.3em] text-primary font-semibold"
                initial={{ letterSpacing: "0.1em" }}
                whileInView={{ letterSpacing: "0.3em" }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                Browse Categories
              </motion.span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Perfect Gadget
              </span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Browse through our carefully curated categories to discover
              exactly what you need
            </p>
          </motion.div>

          {/* Loading */}
          {categoriesLoading && (
            <div className="py-20">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {/* Error */}
          {categoriesError && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-muted-foreground">
                Failed to load categories. Please try again later.
              </p>
            </motion.div>
          )}

          {/* Categories Grid — Real Data */}
          {!categoriesLoading && !categoriesError && categories.length > 0 && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
                {categories.map((category, index) => (
                  <CategoryCard
                    key={category._id}
                    category={category}
                    index={index}
                  />
                ))}
              </div>

              {/* View All */}
              <motion.div
                className="text-center mt-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
              >
                <Link href="/items">
                  <motion.div
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                    whileHover={{ x: 5 }}
                  >
                    View All Products
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </Link>
              </motion.div>
            </>
          )}

          {/* Empty */}
          {!categoriesLoading &&
            !categoriesError &&
            categories.length === 0 && (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <Grid3X3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No categories available yet.
                </p>
              </motion.div>
            )}
        </div>
      </section>

      {/* ─── SCENE 3: Stats Count Up ─────────────────── */}
      {/* <section className="relative py-20 md:py-32 overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.03] to-background" />
  <MorphBlob
    className="w-[400px] h-[400px] top-0 right-0 opacity-20 dark:opacity-10"
    color="hsl(var(--primary) / 0.06)"
    delay={0}
  />

  <div className="container mx-auto px-4 relative z-10">
   
    <motion.div
      className="text-center mb-16 space-y-4"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
        Why GadgetHub
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
        Trusted by{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Thousands
        </span>
      </h2>
    </motion.div>

  
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} index={index} />
      ))}
    </div>

   
    <motion.div
      className="text-center mt-20"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <h3 className="text-2xl md:text-3xl font-bold">
          Ready to upgrade your tech?
        </h3>
        <p className="text-muted-foreground">
          Join thousands of happy customers who found their perfect gadgets at
          GadgetHub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link href="/items">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                className="gap-2 px-10 py-6 text-base rounded-full shadow-xl shadow-primary/25"
              >
                <ShoppingBag className="h-5 w-5" />
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </Link>
          <Link href="/register">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 px-10 py-6 text-base rounded-full border-primary/20"
              >
                <Sparkles className="h-4 w-4" />
                Create Account
              </Button>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.div>
  </div>
</section>; */}
    </div>
  );
}
