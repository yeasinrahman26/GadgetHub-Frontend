"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "@/store/slices/cartSlice";
import { useCreateOrderMutation } from "@/store/api/orderApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Loader2,
  CheckCircle2,
  Package,
} from "lucide-react";

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartItemCount);

  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();

  const [step, setStep] = useState("cart"); // cart | shipping | success
  const [orderResult, setOrderResult] = useState(null);

  // Guest info
  const [guestInfo, setGuestInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // Shipping address
  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    zip: "",
    country: "",
  });

  // Form errors
  const [errors, setErrors] = useState({});

  // Shipping cost
  const shippingCost = cartTotal >= 50 ? 0 : 4.99;
  const totalAmount = cartTotal + shippingCost;

  // Handle guest info change
  const handleGuestChange = (e) => {
    const { name, value } = e.target;
    setGuestInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle shipping change
  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate shipping form
  const validateForm = () => {
    const newErrors = {};

    // Guest info validation (only if not logged in)
    if (!userInfo) {
      if (!guestInfo.name.trim()) newErrors.name = "Name is required";
      if (!guestInfo.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!guestInfo.phone.trim()) newErrors.phone = "Phone is required";
    }

    // Shipping validation
    if (!shippingAddress.street.trim())
      newErrors.street = "Street address is required";
    if (!shippingAddress.city.trim()) newErrors.city = "City is required";
    if (!shippingAddress.zip.trim()) newErrors.zip = "ZIP code is required";
    if (!shippingAddress.country.trim())
      newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    // Build order data
    const orderData = {
      items: cartItems.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      shippingAddress,
    };

    // Add guest info if not logged in
    if (!userInfo) {
      // Generate a guestId or get from localStorage
      let guestId = localStorage.getItem("guestId");
      if (!guestId) {
        guestId =
          "guest_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("guestId", guestId);
      }
      orderData.guestId = guestId;
      orderData.guestInfo = guestInfo;
    }

    try {
      const res = await createOrder(orderData).unwrap();
      setOrderResult(res.data);
      setStep("success");
      dispatch(clearCart());
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to place order");
    }
  };

  // ==================== CART VIEW ====================
  if (step === "cart") {
    // Empty cart
    if (cartItems.length === 0) {
      return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
          <div className="text-center space-y-6">
            <div className="bg-muted/50 rounded-full p-8 w-fit mx-auto">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
              <p className="text-muted-foreground max-w-md">
                Looks like you have not added any items to your cart yet. Start
                shopping to find amazing gadgets!
              </p>
            </div>
            <Link href="/items">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Shopping Cart</h1>
              <Badge variant="secondary">{cartCount} items</Badge>
            </div>
            <p className="text-muted-foreground">
              Review your items and proceed to checkout
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <Card key={item.productId} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <Link href={`/items/${item.productId}`}>
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0 space-y-2">
                        {/* Title + Remove */}
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/items/${item.productId}`}
                            className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.title}
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                            onClick={() =>
                              dispatch(removeFromCart(item.productId))
                            }
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Price */}
                        <p className="text-primary font-bold">
                          ${item.price?.toFixed(2)}
                        </p>

                        {/* Quantity + Subtotal */}
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          {/* Quantity Controls */}
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-r-none"
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    productId: item.productId,
                                    quantity: item.quantity - 1,
                                  }),
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-10 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-l-none"
                              onClick={() =>
                                dispatch(
                                  updateQuantity({
                                    productId: item.productId,
                                    quantity: item.quantity + 1,
                                  }),
                                )
                              }
                              disabled={item.quantity >= (item.stock || 99)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Subtotal */}
                          <p className="font-semibold text-sm">
                            Subtotal: ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Clear Cart */}
              <div className="flex items-center justify-between">
                <Link href="/items">
                  <Button variant="outline" className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="gap-2 text-destructive hover:text-destructive"
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to clear your cart?",
                      )
                    ) {
                      dispatch(clearCart());
                      toast.success("Cart cleared");
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="border-border/50 sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items breakdown */}
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground truncate max-w-[60%]">
                          {item.title} × {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Subtotal */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-emerald-500 font-medium">
                          FREE
                        </span>
                      ) : (
                        `
$$
{shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  {/* Free shipping notice */}
                  {shippingCost > 0 && (
                    <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                      Add ${(50 - cartTotal).toFixed(2)} more for free shipping!
                    </p>
                  )}

                  <Separator />

                  {/* Total */}
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={() => setStep("shipping")}
                  >
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  {/* Login hint for guests */}
                  {!userInfo && (
                    <p className="text-xs text-center text-muted-foreground">
                      <Link
                        href="/login"
                        className="text-primary hover:underline"
                      >
                        Login
                      </Link>{" "}
                      for faster checkout and order tracking
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== SHIPPING/CHECKOUT VIEW ====================
  if (step === "shipping") {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-muted/30 border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold">Checkout</h1>
            </div>
            <p className="text-muted-foreground">
              Fill in your details to complete the order
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">
                ✓
              </div>
              <span className="text-sm font-medium">Cart</span>
            </div>
            <div className="h-px w-12 bg-primary" />
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">
                2
              </div>
              <span className="text-sm font-medium">Checkout</span>
            </div>
            <div className="h-px w-12 bg-muted" />
            <div className="flex items-center gap-2">
              <div className="bg-muted text-muted-foreground rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">
                3
              </div>
              <span className="text-sm text-muted-foreground">
                Confirmation
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Info (only if not logged in) */}
              {!userInfo && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={guestInfo.name}
                          onChange={handleGuestChange}
                          className={`pl-10 ${
                            errors.name
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          disabled={isOrdering}
                        />
                      </div>
                      {errors.name && (
                        <p className="text-xs text-destructive">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={guestInfo.email}
                          onChange={handleGuestChange}
                          className={`pl-10 ${
                            errors.email
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          disabled={isOrdering}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={guestInfo.phone}
                          onChange={handleGuestChange}
                          className={`pl-10 ${
                            errors.phone
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          disabled={isOrdering}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-destructive">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Logged in user info */}
              {userInfo && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-primary" />
                      Contact Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 bg-muted/50 rounded-lg p-4">
                      <div className="bg-primary/10 rounded-full p-3">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{userInfo.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {userInfo.email}
                        </p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        Logged In
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Shipping Address */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Street */}
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      name="street"
                      placeholder="123 Main Street, Apt 4B"
                      value={shippingAddress.street}
                      onChange={handleShippingChange}
                      className={
                        errors.street
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                      disabled={isOrdering}
                    />
                    {errors.street && (
                      <p className="text-xs text-destructive">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  {/* City + ZIP */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="New York"
                        value={shippingAddress.city}
                        onChange={handleShippingChange}
                        className={
                          errors.city
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                        disabled={isOrdering}
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        name="zip"
                        placeholder="10001"
                        value={shippingAddress.zip}
                        onChange={handleShippingChange}
                        className={
                          errors.zip
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }
                        disabled={isOrdering}
                      />
                      {errors.zip && (
                        <p className="text-xs text-destructive">{errors.zip}</p>
                      )}
                    </div>
                  </div>

                  {/* Country */}
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      placeholder="United States"
                      value={shippingAddress.country}
                      onChange={handleShippingChange}
                      className={
                        errors.country
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }
                      disabled={isOrdering}
                    />
                    {errors.country && (
                      <p className="text-xs text-destructive">
                        {errors.country}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setStep("cart")}
                  disabled={isOrdering}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Cart
                </Button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <Card className="border-border/50 sticky top-20">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                          <Image
                            src={item.image || "/placeholder.png"}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                            {item.quantity}
                          </Badge>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ${item.price?.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-emerald-500 font-medium">
                          FREE
                        </span>
                      ) : (
                        `
$$
{shippingCost.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">
                      ${totalAmount.toFixed(2)}
                    </span>
                  </div>

                  {/* Place Order */}
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handlePlaceOrder}
                    disabled={isOrdering}
                  >
                    {isOrdering ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Place Order — ${totalAmount.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By placing your order, you agree to our Terms of Service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== SUCCESS VIEW ====================
  if (step === "success") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-lg">
          {/* Success Icon */}
          <div className="bg-emerald-500/10 rounded-full p-6 w-fit mx-auto">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Order Placed Successfully!</h2>
            <p className="text-muted-foreground">
              Thank you for your purchase. Your order has been received and is
              being processed.
            </p>
          </div>

          {/* Order Details */}
          {orderResult && (
            <Card className="border-border/50 text-left">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono font-medium text-xs">
                    {orderResult._id}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium">
                    ${orderResult.totalAmount?.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">{orderResult.status}</Badge>
                </div>

                {/* Guest ID notice */}
                {orderResult.guestId && (
                  <div className="bg-muted/50 rounded-lg p-3 mt-3">
                    <p className="text-xs text-muted-foreground">
                      <strong>Guest Order ID:</strong>{" "}
                      <span className="font-mono">{orderResult.guestId}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Save this ID to track your order later.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {userInfo ? (
              <Link href="/profile/orders">
                <Button className="gap-2">
                  <Package className="h-4 w-4" />
                  View My Orders
                </Button>
              </Link>
            ) : null}
            <Link href="/items">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
