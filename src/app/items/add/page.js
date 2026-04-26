"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateProductMutation } from "@/store/api/productApi";
import { useGetCategoriesQuery } from "@/store/api/categoryApi";
import { uploadImageToImgBB } from "@/lib/uploadImage";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PlusCircle,
  Loader2,
  ImagePlus,
  X,
  Plus,
  Trash2,
  Package,
  FileText,
  Tag,
  DollarSign,
  Layers,
  Settings2,
  Upload,
} from "lucide-react";
import Image from "next/image";

function AddProductContent() {
  const router = useRouter();
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetCategoriesQuery();

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

  // Images state
  const [images, setImages] = useState([]); // { file, preview, uploading, url }
  const [isUploading, setIsUploading] = useState(false);

  // Specs state
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);

  // Errors
  const [errors, setErrors] = useState({});

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handle category select
  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
    if (errors.category) setErrors((prev) => ({ ...prev, category: "" }));
  };

  // ==================== IMAGE HANDLING ====================

  // Handle image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: false,
      url: null,
    }));

    setImages((prev) => [...prev, ...newImages]);

    // Reset input
    e.target.value = "";
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => {
      const updated = [...prev];
      // Revoke preview URL to free memory
      if (updated[index].preview) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  // Upload all images to ImgBB
  const uploadAllImages = async () => {
    const uploadedUrls = [];

    for (let i = 0; i < images.length; i++) {
      const img = images[i];

      // Skip already uploaded
      if (img.url) {
        uploadedUrls.push(img.url);
        continue;
      }

      try {
        // Mark as uploading
        setImages((prev) => {
          const updated = [...prev];
          updated[i] = { ...updated[i], uploading: true };
          return updated;
        });

        const url = await uploadImageToImgBB(img.file);
        uploadedUrls.push(url);

        // Mark as uploaded
        setImages((prev) => {
          const updated = [...prev];
          updated[i] = { ...updated[i], uploading: false, url };
          return updated;
        });
      } catch (err) {
        toast.error(`Failed to upload image ${i + 1}`);
        throw err;
      }
    }

    return uploadedUrls;
  };

  // ==================== SPECS HANDLING ====================

  // Add new spec row
  const addSpec = () => {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  };

  // Remove spec row
  const removeSpec = (index) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  // Update spec
  const updateSpec = (index, field, value) => {
    setSpecs((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Convert specs array to object
  const getSpecsObject = () => {
    const obj = {};
    specs.forEach((spec) => {
      if (spec.key.trim() && spec.value.trim()) {
        obj[spec.key.trim()] = spec.value.trim();
      }
    });
    return obj;
  };

  // ==================== FORM VALIDATION ====================

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
    if (images.length === 0)
      newErrors.images = "At least one image is required";

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

      // Upload images first
      const imageUrls = await uploadAllImages();

      // Build product data
      const productData = {
        title: formData.title.trim(),
        shortDesc: formData.shortDesc.trim(),
        fullDesc: formData.fullDesc.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        brand: formData.brand.trim(),
        stock: parseInt(formData.stock),
        images: imageUrls,
        specs: getSpecsObject(),
      };

      await createProduct(productData).unwrap();

      toast.success("Product created successfully!");
      router.push("/items/manage");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create product");
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting = isCreating || isUploading;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <PlusCircle className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Add Product</h1>
          </div>
          <p className="text-muted-foreground">
            Fill in the details to add a new product to the store
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Enter the product title and descriptions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Product Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. iPhone 15 Pro Max"
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
                    <Label htmlFor="shortDesc">
                      Short Description{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="shortDesc"
                      name="shortDesc"
                      placeholder="Brief description for product cards..."
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
                      <p className="text-xs text-destructive">
                        {errors.shortDesc}
                      </p>
                    )}
                  </div>

                  {/* Full Description */}
                  <div className="space-y-2">
                    <Label htmlFor="fullDesc">Full Description</Label>
                    <Textarea
                      id="fullDesc"
                      name="fullDesc"
                      placeholder="Detailed product description..."
                      value={formData.fullDesc}
                      onChange={handleChange}
                      rows={5}
                      disabled={isSubmitting}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Images */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ImagePlus className="h-5 w-5 text-primary" />
                    Product Images
                  </CardTitle>
                  <CardDescription>
                    Upload up to 5 images. First image will be the main image.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Upload Area */}
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      errors.images
                        ? "border-destructive bg-destructive/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/30"
                    }`}
                  >
                    <input
                      type="file"
                      id="images"
                      accept="image/*"
                      multiple
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={isSubmitting || images.length >= 5}
                    />
                    <label
                      htmlFor="images"
                      className="cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className="bg-primary/10 rounded-full p-4">
                        <Upload className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Click to upload images</p>
                        <p className="text-sm text-muted-foreground">
                          PNG, JPG, WebP (max 5 images)
                        </p>
                      </div>
                    </label>
                  </div>

                  {errors.images && (
                    <p className="text-xs text-destructive">{errors.images}</p>
                  )}

                  {/* Image Previews */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden border group"
                        >
                          <Image
                            src={img.preview}
                            alt={`Preview ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="150px"
                          />

                          {/* Uploading overlay */}
                          {img.uploading && (
                            <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            </div>
                          )}

                          {/* Uploaded check */}
                          {img.url && (
                            <div className="absolute top-1 left-1">
                              <Badge className="bg-emerald-500 text-xs px-1.5 py-0.5">
                                ✓
                              </Badge>
                            </div>
                          )}

                          {/* Main image badge */}
                          {index === 0 && (
                            <Badge className="absolute bottom-1 left-1 text-xs px-1.5 py-0.5">
                              Main
                            </Badge>
                          )}

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={isSubmitting}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-primary" />
                    Specifications
                  </CardTitle>
                  <CardDescription>
                    Add product specifications (e.g. Display: 6.7 inch, RAM:
                    8GB)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        placeholder="Spec name (e.g. Display)"
                        value={spec.key}
                        onChange={(e) =>
                          updateSpec(index, "key", e.target.value)
                        }
                        className="flex-1"
                        disabled={isSubmitting}
                      />
                      <Input
                        placeholder="Value (e.g. 6.7 inch OLED)"
                        value={spec.value}
                        onChange={(e) =>
                          updateSpec(index, "value", e.target.value)
                        }
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
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Pricing & Stock */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Pricing & Stock
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price ($) <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                        className={`pl-10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
                          errors.price
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.price && (
                      <p className="text-xs text-destructive">{errors.price}</p>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="space-y-2">
                    <Label htmlFor="stock">
                      Stock Quantity <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className={`pl-10 ${
                          errors.stock
                            ? "border-destructive focus-visible:ring-destructive"
                            : ""
                        }`}
                        disabled={isSubmitting}
                      />
                    </div>
                    {errors.stock && (
                      <p className="text-xs text-destructive">{errors.stock}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Category & Brand */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tag className="h-5 w-5 text-primary" />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Category */}
                  <div className="space-y-2">
                    <Label>
                      Category <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                      disabled={isSubmitting || categoriesLoading}
                    >
                      <SelectTrigger
                        className={
                          errors.category
                            ? "border-destructive focus:ring-destructive"
                            : ""
                        }
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent className="bg-background p-2">
                        {categories.map((cat) => (
                          <SelectItem
                            className="py-2 border-b rounded-none hover:rounded-lg"
                            key={cat._id}
                            value={cat._id}
                          >
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-destructive">
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Brand */}
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="brand"
                        name="brand"
                        placeholder="e.g. Apple, Samsung"
                        value={formData.brand}
                        onChange={handleChange}
                        className="pl-10"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit */}
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-4">
                  {/* Preview Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Images</span>
                      <span>{images.length}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Specs</span>
                      <span>
                        {specs.filter((s) => s.key && s.value).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span>
                        {formData.price
                          ? `$${parseFloat(formData.price).toFixed(2)}`
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <Button
                    type="submit"
                    className="w-full gap-2"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isUploading
                          ? "Uploading Images..."
                          : "Creating Product..."}
                      </>
                    ) : (
                      <>
                        <PlusCircle className="h-4 w-4" />
                        Create Product
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddProductPage() {
  return (
    <ProtectedRoute allowedRoles={["mod", "admin"]}>
      <AddProductContent />
    </ProtectedRoute>
  );
}
