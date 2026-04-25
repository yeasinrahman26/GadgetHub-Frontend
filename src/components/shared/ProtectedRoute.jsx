"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    // Not logged in → redirect to login
    if (!userInfo) {
      router.push("/login");
      return;
    }

    // Logged in but doesn't have the required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(userInfo.role)) {
      router.push("/");
      return;
    }
  }, [userInfo, allowedRoles, router]);

  // Show loading while checking
  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Role check
  if (allowedRoles.length > 0 && !allowedRoles.includes(userInfo.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
}
