"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  Home,
  ShoppingBag,
  Info,
  User,
  Package,
  Settings,
  PlusCircle,
  LayoutList,
  LayoutDashboard,
  LogIn,
  UserPlus,
  LogOut,
  ShoppingCart,
  Zap,
} from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const cartCount = useSelector(selectCartItemCount);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path) => {
    router.push(path);
    setOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    setOpen(false);
    router.push("/");
  };

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isMod = userInfo?.role === "mod" || userInfo?.role === "admin";
  const isAdmin = userInfo?.role === "admin";

  const NavItem = ({ icon: Icon, label, path, badge, variant }) => (
    <button
      onClick={() => handleNavigate(path)}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-colors
        ${
          pathname === path
            ? "bg-primary/10 text-primary font-medium"
            : "hover:bg-accent/50"
        }
        ${variant === "destructive" ? "text-destructive hover:bg-destructive/10" : ""}
      `}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1 text-left">{label}</span>
      {badge > 0 && (
        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 ">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-0 bg-background ">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-primary  rounded-lg p-1.5">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">
              Gadget<span className="text-primary">Hub</span>
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full overflow-y-auto pb-20">
          {/* User Info */}
          {userInfo && (
            <div className="px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userInfo?.avatar} alt={userInfo?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(userInfo?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{userInfo?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {userInfo?.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <div className="px-3 py-3">
            <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Menu
            </p>
            <NavItem icon={Home} label="Home" path="/" />
            <NavItem icon={ShoppingBag} label="Shop" path="/items" />
            <NavItem icon={Info} label="About" path="/about" />
            <NavItem
              icon={ShoppingCart}
              label="Cart"
              path="/checkout"
              badge={cartCount}
            />
          </div>

          <Separator />

          {/* User Navigation */}
          {userInfo ? (
            <>
              <div className="px-3 py-3">
                <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </p>
                <NavItem icon={User} label="My Profile" path="/profile" />
                <NavItem
                  icon={Package}
                  label="My Orders"
                  path="/profile/orders"
                />
                <NavItem
                  icon={Settings}
                  label="Settings"
                  path="/profile/settings"
                />
              </div>

              {/* Mod/Admin */}
              {isMod && (
                <>
                  <Separator />
                  <div className="px-3 py-3">
                    <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Management
                    </p>
                    <NavItem
                      icon={PlusCircle}
                      label="Add Product"
                      path="/items/add"
                    />
                    <NavItem
                      icon={LayoutList}
                      label="Manage Products"
                      path="/items/manage"
                    />
                  </div>
                </>
              )}

              {isAdmin && (
                <>
                  <Separator />
                  <div className="px-3 py-3">
                    <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Admin
                    </p>
                    <NavItem
                      icon={LayoutDashboard}
                      label="Dashboard"
                      path="/admin"
                    />
                  </div>
                </>
              )}

              <Separator />

              {/* Logout */}
              <div className="px-3 py-3">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="px-3 py-3">
              <p className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Account
              </p>
              <NavItem icon={LogIn} label="Login" path="/login" />
              <NavItem icon={UserPlus} label="Register" path="/register" />
            </div>
          )}

          {/* Theme Toggle */}
          <Separator />
          <div className="px-6 py-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Theme</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
