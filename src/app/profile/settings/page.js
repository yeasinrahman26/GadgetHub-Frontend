"use client";

import { useState } from "react";
import { useChangePasswordMutation } from "@/store/api/authApi";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
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
  Settings,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Save,
  User,
  Package,
  ShieldCheck,
} from "lucide-react";

function SettingsContent() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Validate
  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword === formData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      toast.success("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  // Password strength indicator
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

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage your account security</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div>
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Link href="/profile">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <User className="h-4 w-4 text-primary" />
                    My Profile
                  </Button>
                </Link>
                <Link href="/profile/orders">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Package className="h-4 w-4 text-primary" />
                    My Orders
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 bg-primary/10 text-primary"
                  disabled
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Change Password Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  Change Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className={`pl-10 pr-10 ${
                          errors.currentPassword
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.currentPassword && (
                      <p className="text-xs text-destructive">
                        {errors.currentPassword}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`pl-10 pr-10 ${
                          errors.newPassword
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="text-xs text-destructive">
                        {errors.newPassword}
                      </p>
                    )}

                    {/* Password Strength */}
                    {formData.newPassword && (
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
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
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
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
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

                  {/* Security Tips */}
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Password Tips</p>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                      <li>Use at least 6 characters</li>
                      <li>Include uppercase and lowercase letters</li>
                      <li>Add numbers and special characters</li>
                      <li>Don&apos;t reuse passwords from other sites</li>
                    </ul>
                  </div>

                  {/* Submit */}
                  <Button type="submit" disabled={isLoading} className="gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Changing Password...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Change Password
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSettingsPage() {
  return (
    <ProtectedRoute allowedRoles={["user", "mod", "admin"]}>
      <SettingsContent />
    </ProtectedRoute>
  );
}
