"use client";

import { useSelector } from "react-redux";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Zap } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";
import UserDropdown from "./UserDropdown";
import MobileNav from "./MobileNav";

export default function Navbar() {
  const { userInfo } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartItemCount);
  const pathname = usePathname();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/items" },
    { label: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95
     backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-2">
            <MobileNav />

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-1.5">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold hidden sm:inline-block">
                Gadget<span className="text-primary">Hub</span>
              </span>
            </Link>
          </div>

          {/* Center: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right: Theme + Cart + Auth */}
          <div className="flex items-center gap-1">
            {/* Theme Toggle (Desktop) */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Cart */}
            <Link href="/checkout">
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground">
                    {cartCount > 99 ? "99+" : cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth */}
            {userInfo ? (
              <UserDropdown />
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
