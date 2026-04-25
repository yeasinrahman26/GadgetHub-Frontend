import {
  Truck,
  Shield,
  Headphones,
  RotateCcw,
  CreditCard,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description:
      "Free shipping on orders over \$50. Fast delivery to your doorstep.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "Your payment information is always safe and encrypted.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Our customer support team is here to help you anytime.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "Not satisfied? Return within 30 days for a full refund.",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment",
    description:
      "Multiple payment options including cards and digital wallets.",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description: "All products are 100% genuine with manufacturer warranty.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <p className="text-sm font-medium text-primary uppercase tracking-wider">
            Why GadgetHub?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose Us</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            We are committed to providing the best shopping experience with
            premium quality products and exceptional service.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-border/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-6 space-y-4">
                {/* Icon */}
                <div
                  className={`${feature.bg} rounded-2xl p-3 w-fit group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold">{feature.title}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
