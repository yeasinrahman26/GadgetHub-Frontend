"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import {
  useGetProductReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} from "@/store/api/reviewApi";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Loader2,
  Trash2,
  MessageSquarePlus,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import LoadingSpinner from "../shared/LoadingSpinner";

export default function ReviewSection({
  productId,
  averageRating,
  totalReviews,
}) {
  const { userInfo } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Fetch reviews
  const { data, isLoading } = useGetProductReviewsQuery(productId);
  const reviews = data?.data || [];

  // Mutations
  const [createReview, { isLoading: isCreating }] = useCreateReviewMutation();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  // Check if user already reviewed
  const hasReviewed = reviews.some(
    (review) => review.userId?._id === userInfo?._id,
  );

  // Handle submit review
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      await createReview({
        productId,
        rating,
        comment: comment.trim(),
      }).unwrap();

      toast.success("Review submitted successfully!");
      setRating(0);
      setComment("");
      setShowForm(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to submit review");
    }
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review deleted successfully");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete review");
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

  // Render stars
  const renderStars = (value, size = "h-4 w-4") => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${size} ${
          i < Math.round(value)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-muted text-muted"
        }`}
      />
    ));
  };

  // Rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
    return { star, count, percentage };
  });

  return (
    <div className="space-y-8">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Average Rating */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-5xl font-bold">
            {averageRating?.toFixed(1) || "0.0"}
          </p>
          <div className="flex items-center gap-1">
            {renderStars(averageRating, "h-5 w-5")}
          </div>
          <p className="text-sm text-muted-foreground">
            Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3">
              <span className="text-sm w-8 text-right">{star}★</span>
              <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Write Review Button / Form */}
      {userInfo ? (
        hasReviewed ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-4">
            <AlertCircle className="h-4 w-4" />
            You have already reviewed this product.
          </div>
        ) : (
          <div>
            {!showForm ? (
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <MessageSquarePlus className="h-4 w-4" />
                Write a Review
              </Button>
            ) : (
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <h3 className="font-semibold text-lg">Write a Review</h3>

                    {/* Star Rating Input */}
                    <div className="space-y-2">
                      <Label>Your Rating</Label>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setRating(i + 1)}
                            onMouseEnter={() => setHoverRating(i + 1)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`h-7 w-7 ${
                                i < (hoverRating || rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-muted text-muted"
                              }`}
                            />
                          </button>
                        ))}
                        {rating > 0 && (
                          <span className="text-sm text-muted-foreground ml-2">
                            {rating === 1 && "Poor"}
                            {rating === 2 && "Fair"}
                            {rating === 3 && "Good"}
                            {rating === 4 && "Very Good"}
                            {rating === 5 && "Excellent"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                      <Label htmlFor="comment">Your Review</Label>
                      <Textarea
                        id="comment"
                        placeholder="Share your experience with this product..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        disabled={isCreating}
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={isCreating}
                        className="gap-2"
                      >
                        {isCreating ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowForm(false);
                          setRating(0);
                          setComment("");
                        }}
                        disabled={isCreating}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        )
      ) : (
        <div className="bg-muted/50 rounded-lg p-6 text-center space-y-3">
          <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Please log in to write a review.
          </p>
          <Link href="/login">
            <Button variant="outline" size="sm">
              Login to Review
            </Button>
          </Link>
        </div>
      )}

      <Separator />

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">
          Customer Reviews ({reviews.length})
        </h3>

        {isLoading && <LoadingSpinner className="py-10" />}

        {!isLoading && reviews.length === 0 && (
          <div className="text-center py-10 space-y-2">
            <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </p>
          </div>
        )}

        {!isLoading &&
          reviews.map((review) => (
            <Card key={review._id} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* User Info + Review */}
                  <div className="flex gap-4 flex-1">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(review.userId?.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2 flex-1">
                      {/* Name + Date */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm">
                          {review.userId?.name || "Anonymous"}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating, "h-3.5 w-3.5")}
                      </div>

                      {/* Comment */}
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  </div>

                  {/* Delete Button */}
                  {(userInfo?._id === review.userId?._id ||
                    userInfo?.role === "admin") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => handleDeleteReview(review._id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}
