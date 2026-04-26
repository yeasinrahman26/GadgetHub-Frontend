"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Target,
  Globe,
  Heart,
  ShoppingBag,
  Truck,
  Shield,
  Headphones,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// ─── Data ────────────────────────────────────────────────────────────────────

const team = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    initials: "AJ",
    description:
      "Tech enthusiast with 10+ years in e-commerce. Obsessed with building things that last.",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    name: "Sarah Chen",
    role: "Head of Products",
    initials: "SC",
    description:
      "Curates the world's best gadgets with an eye for quality, value, and what's truly next.",
    gradient: "from-orange-400 to-amber-500",
  },
  {
    name: "Mike Rodriguez",
    role: "CTO",
    initials: "MR",
    description:
      "Builds the seamless shopping experiences that make customers come back again and again.",
    gradient: "from-emerald-400 to-green-600",
  },
  {
    name: "Emily Park",
    role: "Customer Success",
    initials: "EP",
    description:
      "Ensures every customer walks away happy — because that's the only acceptable outcome.",
    gradient: "from-purple-500 to-violet-700",
  },
];

const milestones = [
  {
    year: "2020",
    title: "Founded",
    description:
      "GadgetHub was born from a mission to make cutting-edge tech accessible to everyone.",
    accent: false,
  },
  {
    year: "2021",
    title: "1,000 Products",
    description:
      "Crossed our first major product milestone — 1,000 hand-tested, curated gadgets.",
    accent: false,
  },
  {
    year: "2022",
    title: "Global Shipping",
    description:
      "Expanded our logistics network to reach 50+ countries worldwide.",
    accent: false,
  },
  {
    year: "2023",
    title: "100K Customers",
    description:
      "A hundred thousand people trusted us with their tech purchases.",
    accent: false,
  },
  {
    year: "2024",
    title: "Award Winning",
    description:
      "Named Best Online Gadget Store — recognition earned through relentless customer focus.",
    accent: true,
  },
];

const stats = [
  { num: "500+", label: "Products" },
  { num: "100K+", label: "Customers" },
  { num: "50+", label: "Countries" },
  { num: "24/7", label: "Support" },
];

const whyUs = [
  {
    icon: ShoppingBag,
    title: "Curated Selection",
    desc: "Every product is tested and approved by our team. Only the best gadgets make the cut.",
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    desc: "Free shipping on orders over \$50. Express delivery to 50+ countries worldwide.",
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Shield,
    title: "Full Warranty",
    desc: "All products come with manufacturer warranty. Buy with total confidence.",
    color: "text-purple-500 dark:text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    desc: "Our tech team is available 24/7. Real humans, real expertise — not chatbots.",
    color: "text-orange-500 dark:text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4 py-20 md:py-28">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow orbs */}
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-[400px] h-[400px] rounded-full bg-accent/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Est. 2020 · Award-Winning Store
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.95]">
            We Sell the{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Future
            </span>
            <span className="block  [-webkit-text-stroke:1px_hsl(var(--muted-foreground)/0.15)]">
              Today
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            GadgetHub is your gateway to cutting-edge technology. We curate,
            test, and deliver the world&apos;s best gadgets — so you always stay
            ahead of the curve.
          </p>

          <div className="flex gap-3 justify-center flex-wrap pt-2">
            <Button
              asChild
              size="lg"
              className="gap-2 rounded-lg font-medium shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
            >
              <Link href="/items">
                <ShoppingBag className="h-4 w-4" />
                Shop Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 rounded-lg font-medium transition-all hover:-translate-y-0.5"
            >
              <a href="#story">
                Our Story
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────── */}
      <div className="bg-muted/50 border-y border-border py-10 px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                {s.num}
              </p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MISSION / VALUES ─────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <Badge
              variant="secondary"
              className="bg-accent/10 border border-accent/25 text-accent uppercase tracking-wider text-xs px-3"
            >
              What Drives Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Built on <span className="text-primary">Purpose</span>
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Every decision at GadgetHub is rooted in three core pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: Target,
                iconColor: "text-primary",
                iconBg: "bg-primary/10 border-primary/25",
                topBar: "from-primary to-transparent",
                title: "Our Mission",
                desc: "Democratize access to technology by offering premium gadgets at fair prices, backed by exceptional customer service that never sleeps.",
              },
              {
                icon: Globe,
                iconColor: "text-accent",
                iconBg: "bg-accent/10 border-accent/25",
                topBar: "from-accent to-transparent",
                title: "Our Vision",
                desc: "To become the world's most trusted gadget destination — where innovation meets accessibility, and quality is never compromised.",
              },
              {
                icon: Heart,
                iconColor: "text-emerald-500 dark:text-emerald-400",
                iconBg: "bg-emerald-500/10 border-emerald-500/25",
                topBar: "from-emerald-500 to-transparent",
                title: "Our Values",
                desc: "Customer obsession, radical transparency, continuous innovation, and integrity — these aren't buzzwords, they're how we operate.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="relative bg-card border border-border rounded-2xl p-7 overflow-hidden group hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.topBar}`}
                />
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${card.iconBg}`}
                >
                  <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────────────────── */}
      <section
        id="story"
        className="py-20 px-4 bg-muted/50 border-y border-border"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden border border-border aspect-[4/3] relative bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?w=700&auto=format&fit=crop"
                alt="Tech workspace"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-background border border-border rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl">
              <span className="text-3xl font-extrabold text-primary font-mono">
                4+
              </span>
              <span className="text-xs text-muted-foreground leading-tight">
                Years of
                <br />
                innovation
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-5">
            <Badge
              variant="secondary"
              className="bg-accent/10 border border-accent/25 text-accent uppercase tracking-wider text-xs px-3"
            >
              Our Story
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              From Garage to <span className="text-primary">Global</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">
              It started in 2020 with a simple frustration — finding quality
              gadgets online was too expensive, too slow, or too risky. Three
              engineers decided to change that.
            </p>
            <p className="text-muted-foreground leading-relaxed text-sm">
              We built GadgetHub with one obsession: making it effortless to
              discover, trust, and own the tech that changes your world. No
              gimmicks, no fake reviews — just honest curation.
            </p>
            <div className="space-y-2 pt-1">
              {[
                "100,000+ happy customers worldwide",
                "50+ countries with express delivery",
                "Award-winning customer support",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="flex gap-3 flex-wrap pt-2">
              <Button
                asChild
                className="gap-2 rounded-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
              >
                <Link href="/items">
                  <ShoppingBag className="h-4 w-4" />
                  View Products
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="gap-2 rounded-lg transition-all hover:-translate-y-0.5"
              >
                <a href="#team">Meet the Team</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <Badge
              variant="secondary"
              className="bg-accent/10 border border-accent/25 text-accent uppercase tracking-wider text-xs px-3"
            >
              Milestones
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Our <span className="text-accent">Journey</span>
            </h2>
            <p className="text-muted-foreground">
              From a bold idea to a global tech store.
            </p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-border via-primary/50 to-border md:left-1/2 md:-translate-x-px" />

            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex gap-6 md:gap-0 ${
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 pb-2 pl-14 md:pl-0 ${
                      i % 2 === 0
                        ? "md:pr-12 md:text-right"
                        : "md:pl-12 md:text-left"
                    }`}
                  >
                    <p
                      className={`text-sm font-bold mb-0.5 ${
                        m.accent ? "text-accent" : "text-primary"
                      }`}
                    >
                      {m.year}
                    </p>
                    <h3 className="font-bold text-lg">{m.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 flex items-center justify-center">
                    <div
                      className={`w-10 h-10 rounded-full bg-background border-2 flex items-center justify-center ${
                        m.accent ? "border-accent" : "border-primary"
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          m.accent ? "bg-accent" : "bg-primary"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────────── */}
      <section
        id="team"
        className="py-20 px-4 bg-muted/50 border-y border-border"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <Badge
              variant="secondary"
              className="bg-primary/10 border border-primary/25 text-primary uppercase tracking-wider text-xs px-3"
            >
              The People
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Meet the <span className="text-primary">Team</span>
            </h2>
            <p className="text-muted-foreground">
              The passionate humans who make GadgetHub possible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-card border border-border rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                {/* Avatar */}
                <div className="relative w-[72px] h-[72px] mx-auto mb-4">
                  <div
                    className={`w-full h-full rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-extrabold text-xl`}
                  >
                    {member.initials}
                  </div>
                  <div className="absolute inset-[-3px] rounded-full border border-primary/25" />
                </div>
                <h3 className="font-bold text-base">{member.name}</h3>
                <p className="text-xs text-primary font-medium mt-0.5 mb-2">
                  {member.role}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 space-y-3">
            <Badge
              variant="secondary"
              className="bg-accent/10 border border-accent/25 text-accent uppercase tracking-wider text-xs px-3"
            >
              Why GadgetHub
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Shop With <span className="text-accent">Confidence</span>
            </h2>
            <p className="text-muted-foreground">
              Four reasons 100,000+ customers choose us — and keep coming back.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whyUs.map((item) => (
              <div
                key={item.title}
                className="bg-card border border-border rounded-2xl p-6 hover:-translate-y-1 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-4 ${item.bg}`}
                >
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <h4 className="font-bold text-sm mb-1.5">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-muted/50 border-t border-border">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-3">
            <Badge
              variant="secondary"
              className="bg-primary/10 border border-primary/25 text-primary uppercase tracking-wider text-xs px-3"
            >
              Get in Touch
            </Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              We&apos;d Love to <span className="text-primary">Hear</span> From
              You
            </h2>
            <p className="text-muted-foreground">
              Questions? Suggestions? We respond within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Mail, label: "Email", value: "support@gadgethub.com" },
              { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
              { icon: MapPin, label: "Address", value: "New York, NY 10001" },
            ].map((c) => (
              <div
                key={c.label}
                className="bg-card border border-border rounded-xl p-5 flex flex-col items-center gap-3"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center">
                  <c.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
                    {c.label}
                  </p>
                  <p className="text-sm font-medium">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="space-y-4">
            <p className="text-muted-foreground">
              Ready to explore the latest gadgets?
            </p>
            <Button
              asChild
              size="lg"
              className="gap-2 rounded-lg shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 text-base px-8"
            >
              <Link href="/items">
                <ShoppingBag className="h-5 w-5" />
                Start Shopping Now
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}