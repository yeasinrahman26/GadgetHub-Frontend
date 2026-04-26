import {
  Zap,
  Target,
  Heart,
  Users,
  Award,
  Globe,
  ShoppingBag,
  Headphones,
  Truck,
  Shield,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const team = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    description: "Tech enthusiast with 10+ years in e-commerce",
  },
  {
    name: "Sarah Chen",
    role: "Head of Products",
    description: "Curating the best gadgets from around the world",
  },
  {
    name: "Mike Rodriguez",
    role: "CTO",
    description: "Building seamless shopping experiences",
  },
  {
    name: "Emily Park",
    role: "Customer Success",
    description: "Ensuring every customer leaves happy",
  },
];

const milestones = [
  {
    year: "2020",
    title: "Founded",
    description: "GadgetHub was born with a mission to make tech accessible",
  },
  {
    year: "2021",
    title: "1K Products",
    description: "Reached our first 1,000 products milestone",
  },
  {
    year: "2022",
    title: "Global Shipping",
    description: "Expanded to ship worldwide to 50+ countries",
  },
  {
    year: "2023",
    title: "100K Customers",
    description: "Crossed 100,000 happy customers",
  },
  {
    year: "2024",
    title: "Award Winning",
    description: "Named Best Online Gadget Store",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative py-20 md:py-28">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="bg-primary rounded-lg p-2">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold">
                Gadget<span className="text-primary">Hub</span>
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                GadgetHub
              </span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              We are passionate about technology and dedicated to bringing you
              the latest and greatest gadgets at competitive prices. Our mission
              is to make cutting-edge technology accessible to everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center space-y-4">
                <div className="bg-primary/10 rounded-2xl p-4 w-fit mx-auto">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Our Mission</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  To democratize access to technology by offering premium
                  gadgets at fair prices with exceptional customer service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center space-y-4">
                <div className="bg-accent/10 rounded-2xl p-4 w-fit mx-auto">
                  <Globe className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold">Our Vision</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  To become the world&apos;s most trusted destination for
                  gadgets and tech accessories, known for quality and
                  reliability.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:shadow-lg transition-shadow">
              <CardContent className="p-8 text-center space-y-4">
                <div className="bg-emerald-500/10 rounded-2xl p-4 w-fit mx-auto">
                  <Heart className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold">Our Values</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Customer satisfaction, product quality, innovation, and
                  integrity guide everything we do at GadgetHub.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">
                500+
              </p>
              <p className="text-sm text-muted-foreground">Products</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">
                100K+
              </p>
              <p className="text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">Countries</p>
            </div>
            <div className="text-center space-y-2">
              <p className="text-4xl md:text-5xl font-bold text-primary">
                24/7
              </p>
              <p className="text-sm text-muted-foreground">Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Our Journey</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              From a small startup to a global tech store
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-6 pb-8 last:pb-0">
                {/* Line */}
                <div className="flex flex-col items-center">
                  <div className="bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center text-sm font-bold shrink-0">
                    {milestone.year.slice(-2)}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-4">
                  <p className="text-xs text-primary font-medium mb-1">
                    {milestone.year}
                  </p>
                  <h3 className="font-bold text-lg">{milestone.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              The passionate people behind GadgetHub
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card
                key={member.name}
                className="border-border/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className="bg-primary/10 rounded-full h-20 w-20 flex items-center justify-center mx-auto">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Shop With Us?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShoppingBag,
                title: "Curated Selection",
                desc: "Only the best gadgets make it to our store",
                color: "text-blue-500",
                bg: "bg-blue-500/10",
              },
              {
                icon: Truck,
                title: "Fast Shipping",
                desc: "Free shipping on orders over \$50",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10",
              },
              {
                icon: Shield,
                title: "Warranty",
                desc: "All products come with manufacturer warranty",
                color: "text-purple-500",
                bg: "bg-purple-500/10",
              },
              {
                icon: Headphones,
                title: "Expert Support",
                desc: "Our tech team is here to help 24/7",
                color: "text-orange-500",
                bg: "bg-orange-500/10",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="border-border/50 hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div className={`${item.bg} rounded-2xl p-3 w-fit mx-auto`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Get in Touch</h2>
              <p className="text-muted-foreground">
                Have questions? We would love to hear from you.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="bg-primary/10 rounded-full p-3">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-xs text-muted-foreground">
                    support@gadgethub.com
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="bg-primary/10 rounded-full p-3">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Phone</p>
                  <p className="text-xs text-muted-foreground">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="bg-primary/10 rounded-full p-3">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Address</p>
                  <p className="text-xs text-muted-foreground">
                    New York, NY 10001
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-muted-foreground mb-4">
                Ready to explore the latest gadgets?
              </p>
              <Link href="/items">
                <Button size="lg" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Start Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
