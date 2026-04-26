"use client";

import { useState } from "react";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/store/api/userApi";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
  Users,
  Search,
  X,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Crown,
  UserCheck,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Filter,
} from "lucide-react";

const roleConfig = {
  admin: { icon: Crown, color: "bg-red-500/10 text-red-500", label: "Admin" },
  mod: {
    icon: ShieldCheck,
    color: "bg-purple-500/10 text-purple-500",
    label: "Moderator",
  },
  user: {
    icon: UserCheck,
    color: "bg-blue-500/10 text-blue-500",
    label: "User",
  },
};

function AdminUsersContent() {
  const { userInfo } = useSelector((state) => state.auth);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch users
  const { data, isLoading, isFetching } = useGetUsersQuery({
    search,
    role: roleFilter,
    page,
    limit: 10,
  });

  const users = data?.data || [];
  const pagination = data?.pagination || {};

  // Mutations
  const [updateUserRole, { isLoading: isUpdatingRole }] =
    useUpdateUserRoleMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Debounced search
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    clearTimeout(window._userSearchTimeout);
    window._userSearchTimeout = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);
    }, 500);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  // Handle role change
  const handleRoleChange = async (userId, newRole) => {
    if (userId === userInfo?._id) {
      toast.error("You cannot change your own role");
      return;
    }

    try {
      await updateUserRole({ id: userId, role: newRole }).unwrap();
      toast.success(`User role updated to ${newRole}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update role");
    }
  };

  // Handle delete
  const handleDeleteClick = (user) => {
    if (user._id === userInfo?._id) {
      toast.error("You cannot delete your own account");
      return;
    }
    setDeleteTarget(user);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteUser(deleteTarget._id).unwrap();
      toast.success(`User "${deleteTarget.name}" deleted`);
      setShowDeleteDialog(false);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
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

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Manage Users</h1>
          </div>
          <p className="text-muted-foreground">
            View, manage roles, and delete users
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <Card className="border-border/50 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
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

              {/* Role Filter */}
              <Select
                value={roleFilter}
                onValueChange={(value) => {
                  setRoleFilter(value === "all" ? "" : value);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[150px] h-10">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent className="bg-background py-2">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="mod">Moderators</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <p className="text-sm text-muted-foreground mt-3">
              {pagination.total || 0} users found
            </p>
          </CardContent>
        </Card>

        {/* Loading */}
        {(isLoading || isFetching) && (
          <div className="py-20">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isFetching && users.length === 0 && (
          <div className="text-center py-20 space-y-4">
            <div className="bg-muted/50 rounded-full p-6 w-fit mx-auto">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No users found</h3>
            <p className="text-muted-foreground">
              {search
                ? "Try adjusting your search."
                : "No users registered yet."}
            </p>
          </div>
        )}

        {/* Users Table (Desktop) */}
        {!isLoading && !isFetching && users.length > 0 && (
          <>
            <div className="hidden md:block">
              <Card className="border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30">
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const isCurrentUser = user._id === userInfo?._id;
                      const config = roleConfig[user.role] || roleConfig.user;

                      return (
                        <TableRow key={user._id} className="hover:bg-muted/20">
                          {/* User */}
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                  src={user.avatar}
                                  alt={user.name}
                                />
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {getInitials(user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">
                                  {user.name}
                                  {isCurrentUser && (
                                    <span className="text-xs text-muted-foreground ml-1.5">
                                      (You)
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          {/* Email */}
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {user.email}
                            </span>
                          </TableCell>

                          {/* Role */}
                          <TableCell>
                            <Select
                              value={user.role}
                              onValueChange={(value) =>
                                handleRoleChange(user._id, value)
                              }
                              disabled={isCurrentUser || isUpdatingRole}
                            >
                              <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-background py-2">
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="mod">Moderator</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>

                          {/* Joined */}
                          <TableCell>
                            <span className="text-xs text-muted-foreground">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(user)}
                              disabled={isCurrentUser}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </div>

            {/* Users Cards (Mobile) */}
            <div className="md:hidden space-y-4">
              {users.map((user) => {
                const isCurrentUser = user._id === userInfo?._id;
                const config = roleConfig[user.role] || roleConfig.user;

                return (
                  <Card key={user._id} className="border-border/50">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0 space-y-2">
                          <div>
                            <p className="font-medium text-sm">
                              {user.name}
                              {isCurrentUser && (
                                <span className="text-xs text-muted-foreground ml-1.5">
                                  (You)
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.email}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(user.createdAt).toLocaleDateString()}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-1">
                            <Select
                              value={user.role}
                              onValueChange={(value) =>
                                handleRoleChange(user._id, value)
                              }
                              disabled={isCurrentUser || isUpdatingRole}
                            >
                              <SelectTrigger className="flex-1 h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="mod">Moderator</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive gap-1"
                              onClick={() => handleDeleteClick(user)}
                              disabled={isCurrentUser}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
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
                  onClick={() => setPage((p) => p - 1)}
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
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md bg-background">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>&quot;{deleteTarget?.name}&quot;</strong>? This will
              permanently remove their account and all associated data.
            </DialogDescription>
          </DialogHeader>

          {deleteTarget && (
            <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {getInitials(deleteTarget.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{deleteTarget.name}</p>
                <p className="text-xs text-muted-foreground">
                  {deleteTarget.email} · {deleteTarget.role}
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
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminUsersContent />
    </ProtectedRoute>
  );
}
