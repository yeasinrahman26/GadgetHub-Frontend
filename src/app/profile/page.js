"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useGetMeQuery, useUpdateProfileMutation } from "@/store/api/authApi";
import { setCredentials } from "@/store/slices/authSlice";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Image from "next/image";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Mail,
  Camera,
  Loader2,
  Save,
  Shield,
  Package,
  Settings,
  Calendar,
  Pencil,
  X,
} from "lucide-react";

function ProfileContent() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Fetch fresh user data
  const { data, isLoading } = useGetMeQuery();
  const user = data?.data;

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  // Avatar
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Errors
  const [errors, setErrors] = useState({});

  // Update mutation
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  // Initialize form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle avatar select
  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  // Remove avatar preview
  const removeAvatarPreview = () => {
    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarFile(null);
    setAvatarPreview(null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    removeAvatarPreview();
    setErrors({});
  };

  // Validate
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      let avatarUrl = user?.avatar || "";

      // Upload new avatar if selected
      if (avatarFile) {
        setIsUploadingAvatar(true);
        try {
          avatarUrl = await uploadImageToImgBB(avatarFile);
        } catch (err) {
          toast.error("Failed to upload avatar");
          setIsUploadingAvatar(false);
          return;
        }
        setIsUploadingAvatar(false);
      }

      const updateData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        avatar: avatarUrl,
      };

      const res = await updateProfile(updateData).unwrap();

      // Update Redux store with new user data
      dispatch(
        setCredentials({
          ...userInfo,
          name: res.data.name,
          email: res.data.email,
          avatar: res.data.avatar,
        }),
      );

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      removeAvatarPreview();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  // Get initials
  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Role badge color
  const getRoleBadge = (role) => {
    const variants = {
      admin: "bg-red-500/10 text-red-500",
      mod: "bg-purple-500/10 text-purple-500",
      user: "bg-blue-500/10 text-blue-500",
    };
    return (
      <Badge className={`${variants[role] || variants.user} capitalize`}>
        {role}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const isSubmitting = isUpdating || isUploadingAvatar;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <User className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">My Profile</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your account information
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Profile Card */}
          <div className="space-y-6">
            {/* Profile Summary */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={avatarPreview || user?.avatar}
                        alt={user?.name}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>

                    {isEditing && (
                      <label
                        htmlFor="avatar"
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
                      >
                        <Camera className="h-4 w-4" />
                        <input
                          type="file"
                          id="avatar"
                          accept="image/*"
                          onChange={handleAvatarSelect}
                          className="hidden"
                          disabled={isSubmitting}
                        />
                      </label>
                    )}
                  </div>

                  {/* Avatar preview remove button */}
                  {avatarPreview && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-destructive hover:text-destructive gap-1"
                      onClick={removeAvatarPreview}
                    >
                      <X className="h-3 w-3" />
                      Remove new photo
                    </Button>
                  )}

                  {/* Name & Email */}
                  <div className="space-y-1">
                    <h2 className="text-xl font-bold">{user?.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>

                  {/* Role */}
                  {getRoleBadge(user?.role)}

                  {/* Joined date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined{" "}
                    {new Date(user?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <Link href="/profile/orders">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Package className="h-4 w-4 text-primary" />
                    My Orders
                  </Button>
                </Link>
                <Link href="/profile/settings">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Settings className="h-4 w-4 text-primary" />
                    Change Password
                  </Button>
                </Link>
                <Link href="/items">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <Shield className="h-4 w-4 text-primary" />
                    Browse Shop
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Right - Profile Form */}
          <div className="lg:col-span-2">
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      {isEditing
                        ? "Update your personal information"
                        : "View your account details"}
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {isEditing ? (
                  // Edit Form
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`pl-10 ${
                            errors.name
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          disabled={isSubmitting}
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
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`pl-10 ${
                            errors.email
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }`}
                          disabled={isSubmitting}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-destructive">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Role (read-only) */}
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm capitalize">{user?.role}</span>
                        <span className="text-xs text-muted-foreground">
                          (Cannot be changed)
                        </span>
                      </div>
                    </div>

                    <Separator />

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {isUploadingAvatar
                              ? "Uploading avatar..."
                              : "Saving..."}
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={cancelEditing}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  // View Mode
                  <div className="space-y-6">
                    {/* Name */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Full Name
                      </p>
                      <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user?.name}</span>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Email Address
                      </p>
                      <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{user?.email}</span>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Role
                      </p>
                      <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium capitalize">
                          {user?.role}
                        </span>
                      </div>
                    </div>

                    {/* Joined */}
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        Member Since
                      </p>
                      <div className="flex items-center gap-3 bg-muted/30 rounded-lg p-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(user?.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute allowedRoles={["user", "mod", "admin"]}>
      <ProfileContent />
    </ProtectedRoute>
  );
}
