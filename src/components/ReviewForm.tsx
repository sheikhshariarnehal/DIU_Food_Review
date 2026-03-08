"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";
import { submitReview, updateReview } from "@/app/actions/reviews";
import { Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExistingReview {
  id: string;
  rating: number;
  body: string;
}

interface ReviewFormProps {
  shopId: string;
  existingReview?: ExistingReview | null;
}

export function ReviewForm({ shopId, existingReview }: ReviewFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // User has an existing review and is not editing — show the review with an Edit button
  if (existingReview && !isEditing && !saved) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Your Review</h3>
          <button
            onClick={() => { setIsEditing(true); setSaved(false); }}
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
        <StarRating rating={existingReview.rating} size="sm" />
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{existingReview.body}</p>
      </div>
    );
  }

  // After a successful save
  if (saved && !isEditing) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-900">Your Review</h3>
          <button
            onClick={() => { setIsEditing(true); setSaved(false); }}
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
        <StarRating rating={rating} size="sm" />
        <p className="mt-2 text-sm leading-relaxed text-gray-700">{body}</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    setLoading(true);

    const result = existingReview
      ? await updateReview(existingReview.id, rating, body)
      : await submitReview(shopId, rating, body);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success(existingReview ? "Review updated!" : "Review submitted!");
      setIsEditing(false);
      setSaved(true);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </h3>
        {existingReview && (
          <button
            type="button"
            onClick={() => { setIsEditing(false); setRating(existingReview.rating); setBody(existingReview.body); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-xs font-medium text-gray-500">Rating</label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onRatingChange={setRating}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="review-body" className="mb-1 block text-xs font-medium text-gray-500">
          Your review
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          required
          placeholder="Share your experience..."
          className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-2 text-sm placeholder-gray-400 transition-colors focus:border-gray-300 focus:bg-white focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {loading ? "Saving..." : existingReview ? "Save Changes" : "Submit Review"}
      </button>
    </form>
  );
}
