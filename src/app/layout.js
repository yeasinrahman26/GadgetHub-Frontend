import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GadgetHub - Your One-Stop Gadget Store",
  description:
    "Discover the latest gadgets, smartphones, laptops, and tech accessories at GadgetHub. Best prices, fast shipping, and excellent customer service.",
  keywords: "gadgets, electronics, smartphones, laptops, tech accessories",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
