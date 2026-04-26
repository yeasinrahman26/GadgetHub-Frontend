"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/store/api/categoryApi";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import { toast } from "react-toastify";
import Image from "next/image";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Upload,
  X,
  AlertTriangle,
  ImageIcon,
  Grid3X3,
  Calendar,
  Save,
} from "lucide-react";

function CategoriesContent() {
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.data || [];

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Open create form
  const openCreateForm = () => {
    setEditTarget(null);
    setFormData({ name: "", description: "" });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (category) => {
    setEditTarget(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
    });
    setImageFile(null);
    setImagePreview(category.image || null);
    setErrors({});
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setFormData({ name: "", description: "" });
    if (imageFile && imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle image select
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    // Revoke old preview if it was a file preview
    if (imageFile && imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  // Remove image
  const removeImage = () => {
    if (imageFile && imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    // If editing, clear existing image too
    setImagePreview(null);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsUploading(true);

      let imageUrl = "";

      // If editing and no new file, keep old image
      if (editTarget && !imageFile) {
        imageUrl = imagePreview || editTarget.image || "";
      }

      // Upload new image if selected
      if (imageFile) {
        try {
          imageUrl = await uploadImageToImgBB(imageFile);
        } catch (err) {
          toast.error("Failed to upload image");
          setIsUploading(false);
          return;
        }
      }

      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        image: imageUrl,
      };

      if (editTarget) {
        // Update
        await updateCategory({
          id: editTarget._id,
          data: categoryData,
        }).unwrap();
        toast.success("Category updated successfully!");
      } else {
        // Create
        await createCategory(categoryData).unwrap();
        toast.success("Category created successfully!");
      }

      closeForm();
    } catch (err) {
      toast.error(err?.data?.message || "Operation failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (category) => {
    setDeleteTarget(category);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCategory(deleteTarget._id).unwrap();
      toast.success(`Category "${deleteTarget.name}" deleted`);
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(
        err?.data?.message ||
          "Failed to delete category. It may have products.",
      );
    }
  };

  const isSubmitting = isCreating || isUpdating || isUploading;

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <FolderOpen className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Manage Categories</h1>
              </div>
              <p className="text-muted-foreground">
                Add, edit, and delete product categories
              </p>
            </div>
            <Button className="gap-2" onClick={openCreateForm}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="bg-muted/50 rounded-full p-6 w-fit mx-auto">
              <FolderOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No categories yet</h3>
            <p className="text-muted-foreground">
              Start by creating your first product category.
            </p>
            <Button className="gap-2" onClick={openCreateForm}>
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </div>
        )}

        {/* Categories Grid */}
        {categories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card
                key={category._id}
                className="border-border/50 group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-video bg-muted/30 overflow-hidden">
                  {category.image &&
                  category.image !== "" &&
                  !category.image.includes("example.com") ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Grid3X3 className="h-12 w-12 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => openEditForm(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleDeleteClick(category)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4 space-y-2">
                  {/* Name */}
                  <h3 className="font-semibold text-lg">{category.name}</h3>

                  {/* Description */}
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(category.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex items-center gap-2 pt-2 sm:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => openEditForm(category)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteClick(category)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Form Dialog */}
      <Dialog open={showForm} onOpenChange={closeForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              {editTarget ? "Edit Category" : "Add Category"}
            </DialogTitle>
            <DialogDescription>
              {editTarget
                ? "Update the category details below."
                : "Fill in the details to create a new category."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="cat-name">
                Category Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="cat-name"
                name="name"
                placeholder="e.g. Smartphones"
                value={formData.name}
                onChange={handleChange}
                className={
                  errors.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                name="description"
                placeholder="Brief description of the category..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            {/* Image */}
            <div className="space-y-2">
              <Label>Category Image</Label>

              {imagePreview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border group/img">
                  <Image
                    src={imagePreview}
                    alt="Category preview"
                    fill
                    className="object-cover"
                    sizes="500px"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity"
                    disabled={isSubmitting}
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Change image button */}
                  <label
                    htmlFor="cat-image"
                    className="absolute bottom-2 right-2 bg-secondary text-secondary-foreground rounded-lg px-3 py-1.5 text-xs font-medium cursor-pointer opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center gap-1"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    Change
                    <input
                      type="file"
                      id="cat-image"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 hover:bg-muted/30 transition-colors">
                  <input
                    type="file"
                    id="cat-image-upload"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor="cat-image-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <div className="bg-primary/10 rounded-full p-3">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Click to upload image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG, WebP (max 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              )}
            </div>

            {/* Actions */}
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeForm}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isUploading
                      ? "Uploading..."
                      : editTarget
                        ? "Saving..."
                        : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editTarget ? "Save Changes" : "Create Category"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Category
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>&quot;{deleteTarget?.name}&quot;</strong>? This action
              cannot be undone. Categories with existing products cannot be
              deleted.
            </DialogDescription>
          </DialogHeader>

          {deleteTarget && (
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                {deleteTarget.image &&
                !deleteTarget.image.includes("example.com") ? (
                  <Image
                    src={deleteTarget.image}
                    alt={deleteTarget.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Grid3X3 className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{deleteTarget.name}</p>
                {deleteTarget.description && (
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {deleteTarget.description}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Category
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminCategoriesPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <CategoriesContent />
    </ProtectedRoute>
  );
}
