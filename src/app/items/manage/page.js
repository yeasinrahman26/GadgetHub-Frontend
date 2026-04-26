"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/store/api/productApi";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import EditProductModal from "@/components/products/EditProductModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutList,
  PlusCircle,
  Search,
  X,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
  Star,
  AlertTriangle,
} from "lucide-react";

function ManageProductsContent() {
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.role === "admin";

  // Search & pagination
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("-createdAt");

  // Edit modal
  const [editProduct, setEditProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch products
  const { data, isLoading, isFetching } = useGetProductsQuery({
    search,
    sort,
    page,
    limit: 10,
  });

  const products = data?.data || [];
  const pagination = data?.pagination || {};

  // Delete mutation
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Debounced search
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    clearTimeout(window._searchTimeout);
    window._searchTimeout = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);
    }, 500);
  };

  // Clear search
  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // Handle edit
  const handleEdit = (product) => {
    setEditProduct(product);
    setShowEditModal(true);
  };

  // Handle delete click
  const handleDeleteClick = (product) => {
    setDeleteTarget(product);
    setShowDeleteDialog(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteProduct(deleteTarget._id).unwrap();
      toast.success(`"${deleteTarget.title}" deleted successfully`);
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete product");
    }
  };

  // Check if user can edit/delete a product
  const canEdit = (product) => {
    if (isAdmin) return true;
    // Mods can only edit their own products
    return product.createdBy?._id === userInfo?._id;
  };

  const canDelete = (product) => {
    if (isAdmin) return true;
    // Mods can only delete their own products
    return product.createdBy?._id === userInfo?._id;
  };

  // Stock badge
  const getStockBadge = (stock) => {
    if (stock <= 0) return <Badge variant="destructive">Out of Stock</Badge>;
    if (stock <= 5)
      return (
        <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">
          Low: {stock}
        </Badge>
      );
    return (
      <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
        {stock}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <LayoutList className="h-6 w-6 text-primary" />
                <h1 className="text-3xl font-bold">Manage Products</h1>
              </div>
              <p className="text-muted-foreground">
                View, edit, and manage all products
              </p>
            </div>
            <Link href="/items/add">
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters Bar */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="pl-10 h-10"
                />
                {searchInput && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort */}
              <Select
                value={sort}
                onValueChange={(value) => {
                  setSort(value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] h-10">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-background py-2">
                  <SelectItem value="-createdAt">Newest First</SelectItem>
                  <SelectItem value="createdAt">Oldest First</SelectItem>
                  <SelectItem value="price">Price: Low → High</SelectItem>
                  <SelectItem value="-price">Price: High → Low</SelectItem>
                  <SelectItem value="title">Name: A → Z</SelectItem>
                  <SelectItem value="-title">Name: Z → A</SelectItem>
                  <SelectItem value="-stock">Stock: High → Low</SelectItem>
                  <SelectItem value="stock">Stock: Low → High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results count */}
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {pagination.total
                  ? `${pagination.total} product${
                      pagination.total !== 1 ? "s" : ""
                    } found`
                  : "No products found"}
              </p>
              {search && (
                <button
                  onClick={clearSearch}
                  className="text-sm text-primary hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Loading */}
        {(isLoading || isFetching) && (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isFetching && products.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="bg-muted/50 rounded-full p-6 w-fit mx-auto">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No products found</h3>
            <p className="text-muted-foreground">
              {search
                ? "Try adjusting your search query."
                : "Start by adding your first product."}
            </p>
            {!search && (
              <Link href="/items/add">
                <Button className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Desktop Table */}
        {!isLoading && !isFetching && products.length > 0 && (
          <>
            {/* Table (Desktop) */}
            <div className="hidden md:block">
              <Card className="border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[80px]">Image</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product._id} className="hover:bg-muted/20">
                        {/* Image */}
                        <TableCell>
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted/30">
                            <Image
                              src={product.images?.[0] || "/placeholder.png"}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                        </TableCell>

                        {/* Title + Brand */}
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-sm line-clamp-1 max-w-[250px]">
                              {product.title}
                            </p>
                            {product.brand && (
                              <p className="text-xs text-muted-foreground">
                                {product.brand}
                              </p>
                            )}
                          </div>
                        </TableCell>

                        {/* Category */}
                        <TableCell>
                          <Badge variant="secondary" className="text-xs">
                            {product.category?.name || "—"}
                          </Badge>
                        </TableCell>

                        {/* Price */}
                        <TableCell>
                          <span className="font-semibold text-primary">
                            ${product.price?.toFixed(2)}
                          </span>
                        </TableCell>

                        {/* Stock */}
                        <TableCell>{getStockBadge(product.stock)}</TableCell>

                        {/* Rating */}
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">
                              {product.averageRating?.toFixed(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({product.totalReviews})
                            </span>
                          </div>
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {/* View */}
                            <Link href={`/items/${product._id}`}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>

                            {/* Edit */}
                            {canEdit(product) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            )}

                            {/* Delete */}
                            {canDelete(product) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteClick(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Cards (Mobile) */}
            <div className="md:hidden space-y-4">
              {products.map((product) => (
                <Card key={product._id} className="border-border/50">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                        <Image
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="font-medium text-sm line-clamp-1">
                          {product.title}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {product.category?.name || "—"}
                          </Badge>
                          {product.brand && (
                            <span className="text-xs text-muted-foreground">
                              {product.brand}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-primary text-sm">
                            ${product.price?.toFixed(2)}
                          </span>
                          {getStockBadge(product.stock)}
                        </div>

                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">
                            {product.averageRating?.toFixed(1)} (
                            {product.totalReviews})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Actions */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                      <Link href={`/items/${product._id}`} className="flex-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-1"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>
                      </Link>

                      {canEdit(product) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 gap-1"
                          onClick={() => handleEdit(product)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      )}

                      {canDelete(product) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(product)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Product
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>&quot;{deleteTarget?.title}&quot;</strong>? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteTarget && (
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                <Image
                  src={deleteTarget.images?.[0] || "/placeholder.png"}
                  alt={deleteTarget.title}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="font-medium text-sm line-clamp-1">
                  {deleteTarget.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${deleteTarget.price?.toFixed(2)} · Stock:{" "}
                  {deleteTarget.stock}
                </p>
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
                  Delete Product
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      {showEditModal && editProduct && (
        <EditProductModal
          product={editProduct}
          open={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditProduct(null);
          }}
        />
      )}
    </div>
  );
}

export default function ManageProductsPage() {
  return (
    <ProtectedRoute allowedRoles={["mod", "admin"]}>
      <ManageProductsContent />
    </ProtectedRoute>
  );
}
