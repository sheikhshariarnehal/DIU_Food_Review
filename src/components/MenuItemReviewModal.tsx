"use client";

import { useState, useEffect } from "react";
import { StarRating } from "./StarRating";
import { SafeImage } from "./ui/SafeImage";
import {
  submitMenuItemReview,
  updateMenuItemReview,
  deleteMenuItemReview,
  getMenuItemReviews,
} from "@/app/actions/menu_reviews";
import type { MenuItemWithRating } from "@/lib/types/database";
import { formatDistanceToNow } from "@/lib/utils/date";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageSquare, Star, Loader2, Send, Trash2, Edit3, UtensilsCrossed } from "lucide-react";

interface MenuItemReviewItem {
  id: string;
  menu_item_id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
  profiles?: {
    full_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

interface MenuItemReviewModalProps {
  item: MenuItemWithRating;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string | null;
  isStudent?: boolean;
  onReviewSubmitted?: () => void;
}

export function MenuItemReviewModal({
  item,
  open,
  onOpenChange,
  currentUserId,
  isStudent = false,
  onReviewSubmitted,
}: MenuItemReviewModalProps) {
  const [reviews, setReviews] = useState<MenuItemReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userBody, setUserBody] = useState("");
  const [userReviewId, setUserReviewId] = useState<string | null>(null);

  // Fetch reviews when modal opens
  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    async function loadReviews() {
      setLoading(true);
      const data = await getMenuItemReviews(item.id);
      if (isMounted) {
        setReviews(data as MenuItemReviewItem[]);

        // Check if current student has reviewed
        if (currentUserId) {
          const myReview = (data as MenuItemReviewItem[]).find(
            (r) => r.user_id === currentUserId
          );
          if (myReview) {
            setUserReviewId(myReview.id);
            setUserRating(myReview.rating);
            setUserBody(myReview.body || "");
          } else {
            setUserReviewId(null);
            setUserRating(5);
            setUserBody("");
          }
        }
        setLoading(false);
      }
    }

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [open, item.id, currentUserId]);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : item.avg_rating ?? 0;
  const reviewCount = reviews.length;

  async function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!userRating || userRating < 1 || userRating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    setSubmitting(true);
    if (userReviewId) {
      const res = await updateMenuItemReview(
        userReviewId,
        userRating,
        userBody,
        item.shop_id
      );
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Review updated successfully!");
        onReviewSubmitted?.();
        const updated = await getMenuItemReviews(item.id);
        setReviews(updated as MenuItemReviewItem[]);
      }
    } else {
      const res = await submitMenuItemReview(
        item.id,
        userRating,
        userBody,
        item.shop_id
      );
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Review submitted! Thank you.");
        onReviewSubmitted?.();
        const updated = await getMenuItemReviews(item.id);
        setReviews(updated as MenuItemReviewItem[]);
        const myReview = (updated as MenuItemReviewItem[]).find(
          (r) => r.user_id === currentUserId
        );
        if (myReview) {
          setUserReviewId(myReview.id);
        }
      }
    }
    setSubmitting(false);
  }

  async function handleDeleteReview() {
    if (!userReviewId) return;
    setSubmitting(true);
    const res = await deleteMenuItemReview(userReviewId, item.shop_id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Review removed");
      setUserReviewId(null);
      setUserBody("");
      setUserRating(5);
      onReviewSubmitted?.();
      const updated = await getMenuItemReviews(item.id);
      setReviews(updated as MenuItemReviewItem[]);
    }
    setSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full max-w-lg overflow-hidden rounded-3xl p-0 flex flex-col gap-0 border-gray-100 shadow-2xl">
        {/* Item Header */}
        <div className="relative aspect-[21/9] w-full shrink-0 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <SafeImage
            src={item.image_url ?? ""}
            alt={item.name}
            fill
            fallbackType="food"
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 500px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <div className="flex items-end justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold leading-tight drop-shadow-sm">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="mt-0.5 line-clamp-1 text-xs text-white/80">
                    {item.description}
                  </p>
                )}
              </div>
              <span className="shrink-0 rounded-lg bg-white/20 px-2.5 py-1 text-sm font-extrabold text-white backdrop-blur-md">
                ৳{Number(item.price).toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body: Rating Stats & Reviews List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
          {/* Average Rating Banner */}
          <div className="flex items-center justify-between rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100/80 font-black text-amber-700 text-xl">
                {avgRating > 0 ? avgRating.toFixed(1) : "—"}
              </div>
              <div>
                <StarRating rating={avgRating} size="sm" />
                <p className="mt-0.5 text-xs text-amber-800 font-medium">
                  {reviewCount} {reviewCount === 1 ? "student rating" : "student ratings"}
                </p>
              </div>
            </div>
          </div>

          {/* Student Review Form (if student logged in) */}
          {isStudent && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  {userReviewId ? "Edit Your Review" : "Rate This Dish"}
                </p>
                {userReviewId && (
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    disabled={submitting}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Your Rating:</span>
                  <StarRating
                    rating={userRating}
                    interactive
                    size="md"
                    onRatingChange={(r) => setUserRating(r)}
                  />
                  <span className="ml-2 text-xs font-bold text-gray-700">
                    {userRating}.0 / 5
                  </span>
                </div>

                <Textarea
                  value={userBody}
                  onChange={(e) => setUserBody(e.target.value)}
                  placeholder="How was the taste, portion, and quality? (optional)"
                  rows={2}
                  className="rounded-xl border-gray-200 bg-white text-xs text-gray-800 focus-visible:ring-emerald-500 resize-none"
                />

                <Button
                  type="submit"
                  disabled={submitting}
                  size="sm"
                  className="w-full rounded-xl bg-gray-900 font-medium text-white hover:bg-gray-800 shadow-sm"
                >
                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                  )}
                  {userReviewId ? "Update Review" : "Submit Rating & Review"}
                </Button>
              </form>
            </div>
          )}

          {/* List of Reviews */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5 text-gray-400" />
              Customer Reviews ({reviews.length})
            </h4>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center">
                <UtensilsCrossed className="mx-auto h-6 w-6 text-gray-300 mb-1" />
                <p className="text-xs font-medium text-gray-500">No reviews for this item yet.</p>
                {isStudent && (
                  <p className="text-[11px] text-gray-400 mt-0.5">Be the first to rate it!</p>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-gray-100 bg-white p-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-emerald-700">
                          {rev.profiles?.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="text-xs font-semibold text-gray-900">
                          {rev.profiles?.full_name || "Anonymous Student"}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {formatDistanceToNow(rev.created_at)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1">
                      <StarRating rating={rev.rating} size="xs" />
                    </div>
                    {rev.body && (
                      <p className="mt-1 text-xs text-gray-600 leading-relaxed">
                        {rev.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
