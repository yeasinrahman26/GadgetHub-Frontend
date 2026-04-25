import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Flame, Clock, Percent, Gift } from "lucide-react";

export default function DealsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/5 rounded-full" />

          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-300" />
                <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/80">
                  Limited Time Offer
                </p>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
                Hot Deals of
                <br />
                the Season 🔥
              </h2>

              <p className="text-primary-foreground/80 text-lg max-w-md">
                Get up to 40% off on selected gadgets. Do not miss out on these
                incredible offers before they are gone!
              </p>

              <Link href="/items">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 px-8 text-base font-semibold"
                >
                  Shop Deals
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Right - Feature Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 hover:bg-white/15 transition-colors">
                <div className="bg-white/20 rounded-xl p-2.5 w-fit">
                  <Percent className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">Up to 40% Off</h3>
                <p className="text-sm text-primary-foreground/70">
                  Massive discounts on top brands
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 hover:bg-white/15 transition-colors">
                <div className="bg-white/20 rounded-xl p-2.5 w-fit">
                  <Clock className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">Flash Sales</h3>
                <p className="text-sm text-primary-foreground/70">
                  Daily deals you cannot miss
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 hover:bg-white/15 transition-colors">
                <div className="bg-white/20 rounded-xl p-2.5 w-fit">
                  <Gift className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">Free Gifts</h3>
                <p className="text-sm text-primary-foreground/70">
                  Bonus accessories included
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 space-y-3 hover:bg-white/15 transition-colors">
                <div className="bg-white/20 rounded-xl p-2.5 w-fit">
                  <Flame className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">New Drops</h3>
                <p className="text-sm text-primary-foreground/70">
                  Latest gadgets just arrived
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
