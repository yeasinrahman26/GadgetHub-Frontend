"use client";

import { useGetDashboardStatsQuery } from "@/store/api/userApi";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  ArrowRight,
  UserCheck,
  ShieldCheck,
  Crown,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  BarChart3,
  FolderOpen,
} from "lucide-react";

function DashboardContent() {
  const { data, isLoading, error } = useGetDashboardStatsQuery();
  const stats = data?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold">Failed to load dashboard</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  // Order status config
  const orderStatusConfig = {
    Pending: { icon: Clock, color: "text-yellow-600", bg: "bg-yellow-500/10" },
    Processing: {
      icon: AlertCircle,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    Shipped: { icon: Truck, color: "text-purple-600", bg: "bg-purple-500/10" },
    Delivered: {
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
    },
    Cancelled: { icon: XCircle, color: "text-red-600", bg: "bg-red-500/10" },
  };

  // Role config
  const roleConfig = {
    admin: { icon: Crown, color: "text-red-500", bg: "bg-red-500/10" },
    mod: {
      icon: ShieldCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    user: { icon: UserCheck, color: "text-blue-500", bg: "bg-blue-500/10" },
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <LayoutDashboard className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Overview of your store performance
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">{stats?.totalUsers || 0}</p>
                </div>
                <div className="bg-blue-500/10 rounded-2xl p-3">
                  <Users className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-3">
                <Link href="/admin/users">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs p-0 h-auto text-primary hover:text-primary"
                  >
                    View all users
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Total Products */}
          <Card className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold">
                    {stats?.totalProducts || 0}
                  </p>
                </div>
                <div className="bg-emerald-500/10 rounded-2xl p-3">
                  <Package className="h-6 w-6 text-emerald-500" />
                </div>
              </div>
              <div className="mt-3">
                <Link href="/items/manage">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs p-0 h-auto text-primary hover:text-primary"
                  >
                    Manage products
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Total Orders */}
          <Card className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <p className="text-3xl font-bold">
                    {stats?.totalOrders || 0}
                  </p>
                </div>
                <div className="bg-purple-500/10 rounded-2xl p-3">
                  <ShoppingCart className="h-6 w-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-3">
                <Link href="/admin/orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs p-0 h-auto text-primary hover:text-primary"
                  >
                    View all orders
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Total Revenue */}
          <Card className="border-border/50 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-3xl font-bold">
                    ${stats?.totalRevenue?.toLocaleString() || "0"}
                  </p>
                </div>
                <div className="bg-orange-500/10 rounded-2xl p-3">
                  <DollarSign className="h-6 w-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-emerald-500">
                <TrendingUp className="h-3 w-3" />
                <span>All time revenue</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Second Row - Breakdowns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Status Breakdown */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Order Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.orderStatusStats &&
              Object.keys(stats.orderStatusStats).length > 0 ? (
                Object.entries(stats.orderStatusStats).map(
                  ([status, count]) => {
                    const config = orderStatusConfig[status] || {
                      icon: AlertCircle,
                      color: "text-gray-600",
                      bg: "bg-gray-500/10",
                    };
                    const StatusIcon = config.icon;
                    const percentage =
                      stats.totalOrders > 0
                        ? ((count / stats.totalOrders) * 100).toFixed(1)
                        : 0;

                    return (
                      <div key={status} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`${config.bg} rounded-lg p-1.5`}>
                              <StatusIcon
                                className={`h-4 w-4 ${config.color}`}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold">{count}</span>
                            <span className="text-xs text-muted-foreground">
                              ({percentage}%)
                            </span>
                          </div>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              status === "Pending"
                                ? "bg-yellow-500"
                                : status === "Processing"
                                  ? "bg-blue-500"
                                  : status === "Shipped"
                                    ? "bg-purple-500"
                                    : status === "Delivered"
                                      ? "bg-emerald-500"
                                      : "bg-red-500"
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  },
                )
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No orders yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* User Roles Breakdown */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                User Roles Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats?.roleStats && Object.keys(stats.roleStats).length > 0 ? (
                Object.entries(stats.roleStats).map(([role, count]) => {
                  const config = roleConfig[role] || {
                    icon: UserCheck,
                    color: "text-gray-500",
                    bg: "bg-gray-500/10",
                  };
                  const RoleIcon = config.icon;
                  const percentage =
                    stats.totalUsers > 0
                      ? ((count / stats.totalUsers) * 100).toFixed(1)
                      : 0;

                  return (
                    <div key={role} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`${config.bg} rounded-lg p-1.5`}>
                            <RoleIcon className={`h-4 w-4 ${config.color}`} />
                          </div>
                          <span className="text-sm font-medium capitalize">
                            {role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold">{count}</span>
                          <span className="text-xs text-muted-foreground">
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            role === "admin"
                              ? "bg-red-500"
                              : role === "mod"
                                ? "bg-purple-500"
                                : "bg-blue-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No users yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/admin/orders">
                <Card className="border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-purple-500/10 rounded-xl p-2.5 group-hover:scale-110 transition-transform">
                      <ShoppingCart className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Manage Orders</p>
                      <p className="text-xs text-muted-foreground">
                        Update order status
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/users">
                <Card className="border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-blue-500/10 rounded-xl p-2.5 group-hover:scale-110 transition-transform">
                      <Users className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Manage Users</p>
                      <p className="text-xs text-muted-foreground">
                        Roles & permissions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/admin/categories">
                <Card className="border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-emerald-500/10 rounded-xl p-2.5 group-hover:scale-110 transition-transform">
                      <FolderOpen className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Categories</p>
                      <p className="text-xs text-muted-foreground">
                        Add & edit categories
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link href="/items/add">
                <Card className="border-border/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="bg-orange-500/10 rounded-xl p-2.5 group-hover:scale-110 transition-transform">
                      <Package className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Add Product</p>
                      <p className="text-xs text-muted-foreground">
                        List new product
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardContent />
    </ProtectedRoute>
  );
}
