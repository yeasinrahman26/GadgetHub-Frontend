"use client";

import { useState } from "react";
import {
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} from "@/store/api/orderApi";
import { toast } from "react-toastify";
import Image from "next/image";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Package,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  User,
  Calendar,
  ShoppingCart,
  Filter,
} from "lucide-react";

const statusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const statusConfig = {
  Pending: { icon: Clock, color: "bg-yellow-500/10 text-yellow-600" },
  Processing: { icon: AlertCircle, color: "bg-blue-500/10 text-blue-600" },
  Shipped: { icon: Truck, color: "bg-purple-500/10 text-purple-600" },
  Delivered: {
    icon: CheckCircle2,
    color: "bg-emerald-500/10 text-emerald-600",
  },
  Cancelled: { icon: XCircle, color: "bg-red-500/10 text-red-600" },
};

function AdminOrdersContent() {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // Fetch all orders
  const { data, isLoading, isFetching } = useGetAllOrdersQuery({
    status: statusFilter,
    page,
    limit: 10,
  });

  const orders = data?.data || [];
  const pagination = data?.pagination || {};

  // Update status mutation
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update order status");
    }
  };

  // View order detail
  const viewOrder = (order) => {
    setSelectedOrder(order);
    setShowDetail(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Manage Orders</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage all customer orders
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filter Bar */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filter by Status:</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setStatusFilter("");
                    setPage(1);
                  }}
                >
                  All
                </Button>
                {statusOptions.map((status) => {
                  const config = statusConfig[status];
                  return (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setStatusFilter(status);
                        setPage(1);
                      }}
                      className="gap-1.5"
                    >
                      {status}
                    </Button>
                  );
                })}
              </div>

              {/* Results */}
              <p className="text-sm text-muted-foreground ml-auto">
                {pagination.total || 0} orders
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {(isLoading || isFetching) && (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isFetching && orders.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="bg-muted/50 rounded-full p-6 w-fit mx-auto">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No orders found</h3>
            <p className="text-muted-foreground">
              {statusFilter
                ? `No ${statusFilter} orders found.`
                : "No orders have been placed yet."}
            </p>
          </div>
        )}

        {/* Orders Table (Desktop) */}
        {!isLoading && !isFetching && orders.length > 0 && (
          <>
            <div className="hidden md:block">
              <Card className="border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => {
                      const config =
                        statusConfig[order.status] || statusConfig.Pending;

                      return (
                        <TableRow key={order._id} className="hover:bg-muted/20">
                          {/* Order ID */}
                          <TableCell>
                            <span className="font-mono text-xs">
                              #{order._id.slice(-8).toUpperCase()}
                            </span>
                          </TableCell>

                          {/* Customer */}
                          <TableCell>
                            <div className="space-y-0.5">
                              <p className="text-sm font-medium">
                                {order.userId?.name ||
                                  order.guestInfo?.name ||
                                  "Guest"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {order.userId?.email ||
                                  order.guestInfo?.email ||
                                  "—"}
                              </p>
                            </div>
                          </TableCell>

                          {/* Items */}
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {order.items.slice(0, 3).map((item, i) => (
                                <div
                                  key={i}
                                  className="relative w-8 h-8 rounded overflow-hidden bg-muted/30"
                                >
                                  <Image
                                    src={item.image || "/placeholder.png"}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                    sizes="32px"
                                  />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <span className="text-xs text-muted-foreground">
                                  +{order.items.length - 3}
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {/* Total */}
                          <TableCell>
                            <span className="font-semibold text-primary">
                              ${order.totalAmount?.toFixed(2)}
                            </span>
                          </TableCell>

                          {/* Status Dropdown */}
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(value) =>
                                handleStatusChange(order._id, value)
                              }
                              disabled={isUpdatingStatus}
                            >
                              <SelectTrigger className="w-[140px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background py-2">
                                {statusOptions.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>

                          {/* Date */}
                          <TableCell>
                            <span className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => viewOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Orders Cards (Mobile) */}
            <div className="md:hidden space-y-4">
              {orders.map((order) => {
                const config =
                  statusConfig[order.status] || statusConfig.Pending;

                return (
                  <Card key={order._id} className="border-border/50">
                    <CardContent className="p-4 space-y-3">
                      {/* Top Row */}
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <Badge className={`${config.color} text-xs`}>
                          {order.status}
                        </Badge>
                      </div>

                      {/* Customer */}
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm">
                          {order.userId?.name ||
                            order.guestInfo?.name ||
                            "Guest"}
                        </span>
                      </div>

                      {/* Items + Total */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          {order.items.length} items
                        </span>
                        <span className="font-bold text-primary">
                          ${order.totalAmount?.toFixed(2)}
                        </span>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Select
                          value={order.status}
                          onValueChange={(value) =>
                            handleStatusChange(order._id, value)
                          }
                          disabled={isUpdatingStatus}
                        >
                          <SelectTrigger className="flex-1 h-9 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => viewOrder(order)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === pagination.pages ||
                      Math.abs(p - page) <= 1,
                  )
                  .map((p, index, arr) => (
                    <div key={p} className="flex items-center">
                      {index > 0 && arr[index - 1] !== p - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <Button
                        variant={page === p ? "default" : "outline"}
                        size="icon"
                        onClick={() => setPage(p)}
                        className="h-9 w-9"
                      >
                        {p}
                      </Button>
                    </div>
                  ))}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={page >= pagination.pages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] bg-background overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order ID + Status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-sm bg-muted px-2 py-1 rounded w-fit">
                    #{selectedOrder._id}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
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
                    statusConfig[selectedOrder.status]?.color
                  } gap-1.5`}
                >
                  {selectedOrder.status}
                </Badge>
              </div>

              <Separator />

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" />
                  Customer Information
                </h3>
                <div className="bg-muted/30 rounded-lg p-4 text-sm space-y-1">
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.userId?.name ||
                      selectedOrder.guestInfo?.name ||
                      "—"}
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    {selectedOrder.userId?.email ||
                      selectedOrder.guestInfo?.email ||
                      "—"}
                  </p>
                  {selectedOrder.guestInfo?.phone && (
                    <p>
                      <strong>Phone:</strong> {selectedOrder.guestInfo.phone}
                    </p>
                  )}
                  {selectedOrder.guestId && (
                    <p>
                      <strong>Guest ID:</strong>{" "}
                      <span className="font-mono text-xs">
                        {selectedOrder.guestId}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  Items ({selectedOrder.items.length})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                        <Image
                          src={item.image || "/placeholder.png"}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">
                          {item.title}
                        </p>
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

              {/* Update Status */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">Update Status:</span>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(value) => {
                    handleStatusChange(selectedOrder._id, value);
                    setSelectedOrder({ ...selectedOrder, status: value });
                  }}
                  disabled={isUpdatingStatus}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isUpdatingStatus && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminOrdersContent />
    </ProtectedRoute>
  );
}
