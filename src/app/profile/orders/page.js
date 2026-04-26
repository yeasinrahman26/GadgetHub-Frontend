"use client";

import { useState } from "react";
import { useGetMyOrdersQuery } from "@/store/api/orderApi";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Package,
  ShoppingBag,
  MapPin,
  Calendar,
  ChevronRight,
  Eye,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

function OrdersContent() {
  const { data, isLoading } = useGetMyOrdersQuery();
  const orders = data?.data || [];

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Status config
  const getStatusConfig = (status) => {
    const configs = {
      Pending: {
        icon: Clock,
        color: "bg-yellow-500/10 text-yellow-600",
        step: 1,
      },
      Processing: {
        icon: AlertCircle,
        color: "bg-blue-500/10 text-blue-600",
        step: 2,
      },
      Shipped: {
        icon: Truck,
        color: "bg-purple-500/10 text-purple-600",
        step: 3,
      },
      Delivered: {
        icon: CheckCircle2,
        color: "bg-emerald-500/10 text-emerald-600",
        step: 4,
      },
      Cancelled: {
        icon: XCircle,
        color: "bg-red-500/10 text-red-600",
        step: 0,
      },
    };
    return configs[status] || configs.Pending;
  };

  // Status steps for tracker
  const statusSteps = ["Pending", "Processing", "Shipped", "Delivered"];

  // View order detail
  const viewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">My Orders</h1>
            {orders.length > 0 && (
              <Badge variant="secondary">{orders.length}</Badge>
            )}
          </div>
          <p className="text-muted-foreground">Track and manage your orders</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Empty State */}
        {orders.length === 0 && (
          <div className="text-center py-20 space-y-6">
            <div className="bg-muted/50 rounded-full p-8 w-fit mx-auto">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">No Orders Yet</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You have not placed any orders yet. Start shopping to see your
                orders here!
              </p>
            </div>
            <Link href="/items">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        )}

        {/* Orders List */}
        {orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = getStatusConfig(order.status);
              const StatusIcon = config.icon;

              return (
                <Card
                  key={order._id}
                  className="border-border/50 hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4 sm:p-6">
                    {/* Top Row - Order ID, Date, Status */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            Order
                          </p>
                          <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </div>
                      </div>

                      <Badge className={`${config.color} gap-1.5`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {order.status}
                      </Badge>
                    </div>

                    {/* Items Preview */}
                    <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
                      {order.items.slice(0, 4).map((item, index) => (
                        <div
                          key={index}
                          className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted/30 shrink-0 border"
                        >
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                          {item.quantity > 1 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                              {item.quantity}
                            </Badge>
                          )}
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-16 h-16 rounded-lg bg-muted/50 flex items-center justify-center shrink-0 border">
                          <span className="text-sm font-medium text-muted-foreground">
                            +{order.items.length - 4}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length}{" "}
                          {order.items.length === 1 ? "item" : "items"}
                        </p>
                        <p className="font-bold text-primary text-lg">
                          ${order.totalAmount?.toFixed(2)}
                        </p>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => viewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh]  bg-background overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded w-fit">
                    #{selectedOrder._id}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on{" "}
                    {new Date(selectedOrder.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
                <Badge
                  className={`${
                    getStatusConfig(selectedOrder.status).color
                  } gap-1.5`}
                >
                  {selectedOrder.status}
                </Badge>
              </div>

              {/* Status Tracker */}
              {selectedOrder.status !== "Cancelled" && (
                <div className="bg-muted/30 rounded-xl p-6">
                  <h3 className="font-semibold text-sm mb-4">Order Progress</h3>
                  <div className="flex items-center justify-between">
                    {statusSteps.map((step, index) => {
                      const currentStep = getStatusConfig(
                        selectedOrder.status,
                      ).step;
                      const isCompleted = index + 1 <= currentStep;
                      const isCurrent = index + 1 === currentStep;

                      return (
                        <div
                          key={step}
                          className="flex flex-col items-center relative flex-1"
                        >
                          {/* Line */}
                          {index > 0 && (
                            <div
                              className={`absolute top-4 right-1/2 w-full h-0.5 -z-10 ${
                                isCompleted ? "bg-primary" : "bg-muted"
                              }`}
                            />
                          )}

                          {/* Circle */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                              isCompleted
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                            } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                          >
                            {isCompleted ? "✓" : index + 1}
                          </div>

                          {/* Label */}
                          <span
                            className={`text-xs mt-2 ${
                              isCompleted
                                ? "text-primary font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cancelled notice */}
              {selectedOrder.status === "Cancelled" && (
                <div className="bg-destructive/10 rounded-xl p-4 flex items-center gap-3">
                  <XCircle className="h-5 w-5 text-destructive shrink-0" />
                  <p className="text-sm text-destructive">
                    This order has been cancelled.
                  </p>
                </div>
              )}

              <Separator />

              {/* Items */}
              <div>
                <h3 className="font-semibold text-sm mb-3">
                  Items ({selectedOrder.items.length})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/items/${item.productId}`}
                          className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ${item.price?.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold text-sm shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Shipping Address
                </h3>
                <div className="bg-muted/30 rounded-lg p-4 text-sm">
                  <p>{selectedOrder.shippingAddress?.street}</p>
                  <p>
                    {selectedOrder.shippingAddress?.city},{" "}
                    {selectedOrder.shippingAddress?.zip}
                  </p>
                  <p>{selectedOrder.shippingAddress?.country}</p>
                </div>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-bold text-xl text-primary">
                  ${selectedOrder.totalAmount?.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function ProfileOrdersPage() {
  return (
    <ProtectedRoute allowedRoles={["user", "mod", "admin"]}>
      <OrdersContent />
    </ProtectedRoute>
  );
}
