"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useResetPasswordMutation } from "@/store/api/authApi";
import { toast } from "react-toastify";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Zap,
  CheckCircle2,
  LogIn,
  KeyRound,
} from "lucide-react";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate
  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Password strength
  const getPasswordStrength = (password) => {
    if (!password) return { label: "", color: "", width: "0%" };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { label: "Very Weak", color: "bg-red-500", width: "20%" },
      { label: "Weak", color: "bg-orange-500", width: "40%" },
      { label: "Fair", color: "bg-yellow-500", width: "60%" },
      { label: "Good", color: "bg-blue-500", width: "80%" },
      { label: "Strong", color: "bg-emerald-500", width: "100%" },
    ];

    return levels[Math.min(strength, 4)];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await resetPassword({
        token,
        data: { password: formData.password },
      }).unwrap();

      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to reset password. Link may be expired.",
      );
    }
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

        <Card className="w-full max-w-md border-border/50 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Success Icon */}
              <div className="bg-emerald-500/10 rounded-full p-6 w-fit mx-auto">
                <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Password Reset!</h2>
                <p className="text-muted-foreground text-sm">
                  Your password has been reset successfully. You can now login
                  with your new password.
                </p>
              </div>

              {/* Login Button */}
              <Link href="/login" className="block">
                <Button size="lg" className="w-full gap-2">
                  <LogIn className="h-4 w-4" />
                  Go to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Form
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 -z-10" />

      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="text-center space-y-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center justify-center gap-2 mb-2"
          >
            <div className="bg-primary rounded-lg p-2">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
          </Link>

          <div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription className="mt-2">
              Enter your new password below
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}

              {/* Strength indicator */}
              {formData.password && (
                <div className="space-y-1">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} rounded-full transition-all duration-300`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strength:{" "}
                    <span className="font-medium">
                      {passwordStrength.label}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${
                    errors.confirmPassword
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full gap-2"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Reset Password
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
