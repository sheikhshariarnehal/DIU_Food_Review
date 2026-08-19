"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StarRating } from "./StarRating";
import { SafeImage } from "./ui/SafeImage";
import {
  submitMenuItemReview,
  updateMenuItemReview,
  deleteMenuItemReview,
  submitMenuItemReviewReply,
  deleteMenuItemReviewReply,
  getMenuItemReviews,
} from "@/app/actions/menu_reviews";
import type { MenuItemWithRating, MenuItemReview } from "@/lib/types/database";
import { formatDistanceToNow } from "@/lib/utils/date";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquare,
  Star,
  Loader2,
  Send,
  Trash2,
  Store,
  UtensilsCrossed,
  X,
  CornerDownRight,
  Sparkles,
} from "lucide-react";

interface MenuItemReviewItem extends MenuItemReview {
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
  isOwner?: boolean;
  onReviewSubmitted?: () => void;
  onRatingUpdated?: (avg: number, count: number) => void;
}

export function MenuItemReviewModal({
  item,
  open,
  onOpenChange,
  currentUserId,
  isStudent = false,
  isOwner = false,
  onReviewSubmitted,
  onRatingUpdated,
}: MenuItemReviewModalProps) {
  const router = useRouter();
  const [reviews, setReviews] = useState<MenuItemReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userBody, setUserBody] = useState("");
  const [userReviewId, setUserReviewId] = useState<string | null>(null);

  // Owner reply state
  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [ownerReplyText, setOwnerReplyText] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);

  // Fetch reviews when modal opens
  useEffect(() => {
    if (!open) return;

    let isMounted = true;
    async function loadReviews() {
      setLoading(true);
      const data = await getMenuItemReviews(item.id);
      if (isMounted) {
        const reviewList = data as MenuItemReviewItem[];
        setReviews(reviewList);

        const avg =
          reviewList.length > 0
            ? Number(
                (
                  reviewList.reduce((acc, r) => acc + r.rating, 0) /
                  reviewList.length
                ).toFixed(2)
              )
            : 0;
        onRatingUpdated?.(avg, reviewList.length);

        // Check if current student has reviewed
        if (currentUserId) {
          const myReview = reviewList.find(
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

  // Real-time calculated average
  const calculatedAvg =
    reviews.length > 0
      ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
      : 0;
  const currentAvg = reviews.length > 0 ? calculatedAvg : (item.avg_rating ?? 0);
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
        const updated = (await getMenuItemReviews(item.id)) as MenuItemReviewItem[];
        setReviews(updated);
        const avg =
          updated.length > 0
            ? Number(
                (
                  updated.reduce((acc, r) => acc + r.rating, 0) / updated.length
                ).toFixed(2)
              )
            : 0;
        onRatingUpdated?.(avg, updated.length);
        onReviewSubmitted?.();
        router.refresh();
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
        const updated = (await getMenuItemReviews(item.id)) as MenuItemReviewItem[];
        setReviews(updated);
        const avg =
          updated.length > 0
            ? Number(
                (
                  updated.reduce((acc, r) => acc + r.rating, 0) / updated.length
                ).toFixed(2)
              )
            : 0;
        onRatingUpdated?.(avg, updated.length);
        const myReview = updated.find(
          (r) => r.user_id === currentUserId
        );
        if (myReview) {
          setUserReviewId(myReview.id);
        }
        onReviewSubmitted?.();
        router.refresh();
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
      const updated = (await getMenuItemReviews(item.id)) as MenuItemReviewItem[];
      setReviews(updated);
      const avg =
        updated.length > 0
          ? Number(
              (
                updated.reduce((acc, r) => acc + r.rating, 0) / updated.length
              ).toFixed(2)
            )
          : 0;
      onRatingUpdated?.(avg, updated.length);
      onReviewSubmitted?.();
      router.refresh();
    }
    setSubmitting(false);
  }

  async function handlePostOwnerReply(reviewId: string) {
    if (!ownerReplyText.trim()) return;
    setReplySubmitting(true);
    const res = await submitMenuItemReviewReply(reviewId, ownerReplyText, item.shop_id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Reply published successfully!");
      setReplyingReviewId(null);
      setOwnerReplyText("");
      const updated = (await getMenuItemReviews(item.id)) as MenuItemReviewItem[];
      setReviews(updated);
      router.refresh();
    }
    setReplySubmitting(false);
  }

  async function handleDeleteOwnerReply(reviewId: string) {
    setReplySubmitting(true);
    const res = await deleteMenuItemReviewReply(reviewId, item.shop_id);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Reply removed");
      const updated = (await getMenuItemReviews(item.id)) as MenuItemReviewItem[];
      setReviews(updated);
      router.refresh();
    }
    setReplySubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] w-full max-w-[95vw] sm:max-w-xl md:max-w-2xl overflow-hidden rounded-3xl p-0 flex flex-col gap-0 border-gray-100 shadow-2xl"
      >
        {/* Item Header Banner */}
        <div className="relative aspect-[16/7] w-full shrink-0 overflow-hidden bg-gray-900">
          <SafeImage
            src={item.image_url ?? ""}
            alt={item.name}
            fill
            fallbackType="food"
            className="object-cover opacity-90"
            sizes="(max-width: 768px) 100vw, 680px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          {/* Close button */}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="absolute top-3.5 right-3.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/90 backdrop-blur-md transition-all hover:bg-black/80 hover:text-white cursor-pointer shadow-md"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Banner Meta */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-md">
                  <UtensilsCrossed className="h-3 w-3" />
                  <span>Menu Dish</span>
                </div>
                <h3 className="text-xl font-bold leading-tight drop-shadow-xs sm:text-2xl">
                  {item.name}
                </h3>
                {item.description && (
                  <p className="max-w-md text-xs text-white/85 line-clamp-2">
                    {item.description}
                  </p>
                )}
              </div>
              <span className="self-start sm:self-end shrink-0 rounded-2xl bg-emerald-500/90 px-3.5 py-1.5 text-base font-black text-white backdrop-blur-md shadow-sm">
                ৳{Number(item.price).toFixed(0)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 min-h-0">
          {/* Average Rating Score Card (Polished & Spacious) */}
          <div className="flex flex-row items-center justify-between rounded-2xl border border-amber-200/80 bg-amber-50/70 p-4 shadow-2xs">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 font-black text-amber-900 text-xl shadow-2xs">
                {currentAvg > 0 ? currentAvg.toFixed(1) : "—"}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <StarRating rating={currentAvg} size="sm" />
                  <span className="text-xs font-bold text-amber-950 whitespace-nowrap">
                    {currentAvg > 0 ? `${currentAvg.toFixed(1)} / 5.0` : "No ratings yet"}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-amber-800 font-medium">
                  Based on {reviewCount} student {reviewCount === 1 ? "rating" : "ratings"}
                </p>
              </div>
            </div>

            {currentAvg >= 4.5 && reviewCount > 0 && (
              <div className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-amber-200/60 px-3 py-1 text-xs font-bold text-amber-900 shadow-2xs">
                <Sparkles className="h-3.5 w-3.5 text-amber-700" />
                <span>Top Rated Dish</span>
              </div>
            )}
          </div>

          {/* Student Review Form (if active student logged in) */}
          {isStudent && (
            <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-4 sm:p-5 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  {userReviewId ? "Edit Your Dish Review" : "Rate This Dish"}
                </h4>
                {userReviewId && (
                  <button
                    type="button"
                    onClick={handleDeleteReview}
                    disabled={submitting}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" /> Remove Review
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600">Your Rating:</span>
                  <StarRating
                    rating={userRating}
                    interactive
                    size="md"
                    onRatingChange={(r) => setUserRating(r)}
                  />
                  <span className="text-xs font-bold text-gray-800">
                    {userRating}.0 / 5
                  </span>
                </div>

                <Textarea
                  value={userBody}
                  onChange={(e) => setUserBody(e.target.value)}
                  placeholder="How was the taste, portion, spice, and freshness? (optional)"
                  rows={2}
                  className="rounded-xl border-gray-200 bg-white text-xs text-gray-800 focus-visible:ring-emerald-500 resize-none shadow-2xs"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="rounded-xl bg-gray-900 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-gray-800 shadow-2xs cursor-pointer"
                  >
                    {submitting ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    ) : (
                      <Send className="h-3.5 w-3.5 mr-1.5" />
                    )}
                    {userReviewId ? "Update Dish Review" : "Submit Rating & Review"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* List of Reviews with Shop Owner Replies */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                <span>Student Reviews ({reviews.length})</span>
              </h4>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 py-10 text-center bg-gray-50/50">
                <UtensilsCrossed className="mx-auto h-7 w-7 text-gray-300 mb-1.5" />
                <p className="text-xs font-bold text-gray-700">No reviews for this dish yet</p>
                {isStudent ? (
                  <p className="text-xs text-gray-400 mt-0.5">Be the first student to rate it above!</p>
                ) : (
                  <p className="text-xs text-gray-400 mt-0.5">Customer feedback will appear here as students review it.</p>
                )}
              </div>
            ) : (
              <div className="space-y-3.5">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                          {rev.profiles?.full_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <span className="text-xs font-bold text-gray-900">
                          {rev.profiles?.full_name || "DIU Student"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 font-normal">
                        {formatDistanceToNow(rev.created_at)}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <StarRating rating={rev.rating} size="xs" />
                      <span className="text-xs font-bold text-gray-700">
                        {rev.rating}.0 / 5
                      </span>
                    </div>

                    {rev.body && (
                      <p className="text-xs text-gray-700 leading-relaxed font-normal">
                        &ldquo;{rev.body}&rdquo;
                      </p>
                    )}

                    {/* Shop Owner Reply Thread Display */}
                    {rev.reply && (
                      <div className="mt-3 rounded-2xl border border-emerald-100/90 bg-emerald-50/50 p-3.5 shadow-2xs">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
                              <Store className="h-3 w-3" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                              Shop Owner Response
                            </span>
                          </div>
                          {rev.reply_created_at && (
                            <span className="text-xs text-gray-400 font-normal">
                              {formatDistanceToNow(rev.reply_created_at)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-800 leading-relaxed pl-7 font-normal">
                          {rev.reply}
                        </p>
                        {isOwner && (
                          <div className="mt-2.5 flex items-center justify-end gap-2 border-t border-emerald-100/80 pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingReviewId(rev.id);
                                setOwnerReplyText(rev.reply || "");
                              }}
                              className="rounded-lg bg-emerald-100/90 px-2.5 py-1 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-200 cursor-pointer"
                            >
                              Edit Reply
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOwnerReply(rev.id)}
                              className="rounded-lg bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100 cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Owner Reply Action Form */}
                    {isOwner && (!rev.reply || replyingReviewId === rev.id) && (
                      <div className="mt-3 rounded-2xl border border-gray-100 bg-gray-50/60 p-3.5">
                        {replyingReviewId === rev.id ? (
                          <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                                <CornerDownRight className="h-3.5 w-3.5 text-gray-400" />
                                {rev.reply ? "Edit Your Reply" : "Reply as Shop Owner"}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyingReviewId(null);
                                  setOwnerReplyText("");
                                }}
                                className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                            <Textarea
                              value={ownerReplyText}
                              onChange={(e) => setOwnerReplyText(e.target.value)}
                              rows={2}
                              placeholder="Write an official response to this student review..."
                              className="rounded-xl border-gray-200 bg-white text-xs text-gray-800 focus-visible:ring-emerald-500 resize-none shadow-2xs"
                            />
                            <div className="flex justify-end">
                              <Button
                                type="button"
                                size="sm"
                                disabled={replySubmitting || !ownerReplyText.trim()}
                                onClick={() => handlePostOwnerReply(rev.id)}
                                className="rounded-xl bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer shadow-2xs"
                              >
                                {replySubmitting && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                                Post Response
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setReplyingReviewId(rev.id);
                              setOwnerReplyText("");
                            }}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
                          >
                            <Store className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Reply to this student review →</span>
                          </button>
                        )}
                      </div>
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
