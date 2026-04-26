import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import ShopByCategory from "@/components/home/ShopByCategory";
import DealsSection from "@/components/home/DealsSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      {/* <ShopByCategory /> */}
      <DealsSection />
      <WhyChooseUs />
    </>
  );
}
