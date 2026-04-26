"use client";

import { useState, useEffect } from "react";
import { useUpdateProductMutation } from "@/store/api/productApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import { toast } from "react-toastify";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Trash2, X, Upload, Save } from "lucide-react";

export default function EditProductModal({ product, open, onClose }) {
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    shortDesc: "",
    fullDesc: "",
    price: "",
    category: "",
    brand: "",
    stock: "",
  });

  // Images - existing URLs + new file uploads
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Specs
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  // Errors
  const [errors, setErrors] = useState({});

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || "",
        shortDesc: product.shortDesc || "",
        fullDesc: product.fullDesc || "",
        price: product.price?.toString() || "",
        category: product.category?._id || "",
        brand: product.brand || "",
        stock: product.stock?.toString() || "",
      });

      setExistingImages(product.images || []);
      setNewImages([]);

      // Convert specs object to array
      if (product.specs && Object.keys(product.specs).length > 0) {
        const specsArray = Object.entries(product.specs).map(
          ([key, value]) => ({ key, value }),
        );
        setSpecs(specsArray);
      } else {
        setSpecs([{ key: "", value: "" }]);
      }
    }
  }, [product]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle category change
  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
  };

  // ==================== IMAGE HANDLING ====================

  const totalImages = existingImages.length + newImages.length;

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (totalImages + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const newImgs = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((prev) => [...prev, ...newImgs]);
    e.target.value = "";
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const uploadNewImages = async () => {
    const uploadedUrls = [];

    for (const img of newImages) {
      try {
        const url = await uploadImageToImgBB(img.file);
        uploadedUrls.push(url);
      } catch (err) {
        toast.error("Failed to upload an image");
        throw err;
      }
    }

    return uploadedUrls;
  };

  // ==================== SPECS ====================

  const addSpec = () => setSpecs((prev) => [...prev, { key: "", value: "" }]);

  const removeSpec = (index) =>
    setSpecs((prev) => prev.filter((_, i) => i !== index));

  const updateSpec = (index, field, value) => {
    setSpecs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const getSpecsObject = () => {
    const obj = {};
    specs.forEach((spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        obj[spec.key.trim()] = spec.value.trim();
      }
    });
    return obj;
  };

  // ==================== VALIDATION ====================

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.shortDesc.trim())
      newErrors.shortDesc = "Short description is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.stock || parseInt(formData.stock) < 0)
      newErrors.stock = "Valid stock is required";
    if (totalImages === 0) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== SUBMIT ====================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setIsUploading(true);

      // Upload new images
      let allImageUrls = [...existingImages];
      if (newImages.length > 0) {
        const newUrls = await uploadNewImages();
        allImageUrls = [...allImageUrls, ...newUrls];
      }

      const productData = {
        title: formData.title.trim(),
        shortDesc: formData.shortDesc.trim(),
        fullDesc: formData.fullDesc.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand.trim(),
        stock: parseInt(formData.stock),
        images: allImageUrls,
        specs: getSpecsObject(),
      };

      await updateProduct({ id: product._id, data: productData }).unwrap();

      toast.success("Product updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update product");
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting = isUpdating || isUploading;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="max-w-3xl bg-background border border-gray-600
       max-h-[90vh]     overflow-y-auto rounded-lg p-6"
      >
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Basic Information
            </h3>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="edit-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={
                  errors.title
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-shortDesc">
                Short Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="edit-shortDesc"
                name="shortDesc"
                value={formData.shortDesc}
                onChange={handleChange}
                rows={2}
                className={
                  errors.shortDesc
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }
                disabled={isSubmitting}
              />
              {errors.shortDesc && (
                <p className="text-xs text-destructive">{errors.shortDesc}</p>
              )}
            </div>

            {/* Full Description */}
            <div className="space-y-2">
              <Label htmlFor="edit-fullDesc">Full Description</Label>
              <Textarea
                id="edit-fullDesc"
                name="fullDesc"
                value={formData.fullDesc}
                onChange={handleChange}
                rows={4}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <Separator />

          {/* Price, Stock, Category, Brand */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Pricing & Organization
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="edit-price">
                  Price ($) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  className={
                    errors.price
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                  disabled={isSubmitting}
                />
                {errors.price && (
                  <p className="text-xs text-destructive">{errors.price}</p>
                )}
              </div>

              {/* Stock */}
              <div className="space-y-2">
                <Label htmlFor="edit-stock">
                  Stock <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className={
                    errors.stock
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }
                  disabled={isSubmitting}
                />
                {errors.stock && (
                  <p className="text-xs text-destructive">{errors.stock}</p>
                )}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={handleCategoryChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className={
                      errors.category
                        ? "border-destructive focus:ring-destructive"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background py-2">
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-destructive">{errors.category}</p>
                )}
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Label htmlFor="edit-brand">Brand</Label>
                <Input
                  id="edit-brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Images */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Images ({totalImages}/5)
              </h3>
            </div>

            {/* Existing + New images */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {/* Existing */}
              {existingImages.map((url, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative aspect-square rounded-lg overflow-hidden border group"
                >
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                  {index === 0 && (
                    <Badge className="absolute bottom-1 left-1 text-xs px-1.5 py-0.5">
                      Main
                    </Badge>
                  )}
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isSubmitting}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* New uploads */}
              {newImages.map((img, index) => (
                <div
                  key={`new-${index}`}
                  className="relative aspect-square rounded-lg overflow-hidden border border-dashed border-primary/50 group"
                >
                  <Image
                    src={img.preview}
                    alt={`New ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                  <Badge className="absolute bottom-1 left-1 bg-primary/80 text-xs px-1.5 py-0.5">
                    New
                  </Badge>
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={isSubmitting}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Upload button */}
              {totalImages < 5 && (
                <label
                  htmlFor="edit-images"
                  className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">
                    Add
                  </span>
                  <input
                    type="file"
                    id="edit-images"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </label>
              )}
            </div>

            {errors.images && (
              <p className="text-xs text-destructive">{errors.images}</p>
            )}
          </div>

          <Separator />

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
              Specifications
            </h3>

            {specs.map((spec, index) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  placeholder="Spec name"
                  value={spec.key}
                  onChange={(e) => updateSpec(index, "key", e.target.value)}
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Input
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) => updateSpec(index, "value", e.target.value)}
                  className="flex-1"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => removeSpec(index)}
                  disabled={specs.length <= 1 || isSubmitting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={addSpec}
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
              Add Specification
            </Button>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isUploading ? "Uploading..." : "Saving..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
