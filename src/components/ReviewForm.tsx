"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";
import { submitReview, updateReview } from "@/app/actions/reviews";
import { Pencil, Loader2, Send } from "lucide-react";
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
  const [rating, setRating] = useState(existingReview?.rating ?? 5);
  const [body, setBody] = useState(existingReview?.body ?? "");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // User has an existing review and is not editing — show the review with an Edit button
  if (existingReview && !isEditing && !saved) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-2xs">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Your Stall Review
            </h3>
          </div>
          <button
            onClick={() => { setIsEditing(true); setSaved(false); }}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
          >
            <Pencil className="h-3 w-3" />
            Edit Review
          </button>
        </div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <StarRating rating={existingReview.rating} size="xs" />
          <span className="text-xs font-bold text-gray-800">{existingReview.rating}.0 / 5</span>
        </div>
        <p className="text-xs leading-relaxed text-gray-700 font-normal">
          &ldquo;{existingReview.body}&rdquo;
        </p>
      </div>
    );
  }

  // After a successful save
  if (saved && !isEditing) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-2xs">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Your Stall Review
            </h3>
          </div>
          <button
            onClick={() => { setIsEditing(true); setSaved(false); }}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
          >
            <Pencil className="h-3 w-3" />
            Edit Review
          </button>
        </div>
        <div className="flex items-center gap-1.5 mb-1.5">
          <StarRating rating={rating} size="xs" />
          <span className="text-xs font-bold text-gray-800">{rating}.0 / 5</span>
        </div>
        <p className="text-xs leading-relaxed text-gray-700 font-normal">
          &ldquo;{body}&rdquo;
        </p>
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
    <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          {existingReview ? "Edit Your Review" : "Write a Stall Review"}
        </h3>
        {existingReview && (\
          <button
            type="button"
            onClick={() => { setIsEditing(false); setRating(existingReview.rating); setBody(existingReview.body); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">Rate this stall:</span>
          <span className="text-xs font-bold text-gray-900">{rating}.0 / 5</span>
        </div>
        <StarRating
          rating={rating}
          size="md"
          interactive
          onRatingChange={setRating}
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="review-body" className="block text-xs font-medium text-gray-600">
          Your feedback
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          required
          placeholder="Share your overall experience (cleanliness, service, portion)..."
          className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-xs placeholder-gray-400 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none shadow-2xs"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-2xs transition-all hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (\
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (\
          <Send className="h-3.5 w-3.5" />
        )}
        <span>{loading ? "Saving..." : existingReview ? "Save Changes" : "Submit Stall Review"}</span>
      </button>
    </form>
  );
}
