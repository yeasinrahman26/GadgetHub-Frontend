"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Package,
  Settings,
  PlusCircle,
  LayoutList,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function UserDropdown() {
  const [mounted, setMounted] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
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

  // Don't render anything until client-side to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="hidden md:flex items-center gap-2 px-2 py-1.5">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="hidden md:block h-4 w-16 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  const isMod = userInfo?.role === "mod" || userInfo?.role === "admin";
  const isAdmin = userInfo?.role === "admin";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden md:flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-accent/50 outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src={userInfo?.avatar} alt={userInfo?.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {getInitials(userInfo?.name)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden md:inline-block text-sm font-medium max-w-[100px] truncate">
          {userInfo?.name}
        </span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 z-[100] bg-background">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo?.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground capitalize">
              Role: {userInfo?.role}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          <User className="mr-2 h-4 w-4" />
          My Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/profile/orders")}
        >
          <Package className="mr-2 h-4 w-4" />
          My Orders
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => router.push("/profile/settings")}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>

        {isMod && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/items/add")}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Product
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/items/manage")}
            >
              <LayoutList className="mr-2 h-4 w-4" />
              Manage Products
            </DropdownMenuItem>
          </>
        )}

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push("/admin")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Admin Dashboard
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
