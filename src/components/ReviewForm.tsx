"use client";

import { useState } from "react";
import { StarRating } from "./StarRating";
import { submitReview, updateReview } from "@/app/actions/reviews";
import { Pencil } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // User has an existing review and is not editing — show the review with an Edit button
  if (existingReview && !isEditing && !saved) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">Your Review</h3>
          <button
            onClick={() => { setIsEditing(true); setSaved(false); }}
            className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-800 font-medium transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
        <StarRating rating={existingReview.rating} size="sm" />
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">{existingReview.body}</p>
      </div>
    );
  }

  // After a successful save
  if (saved && !isEditing) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">Your Review</h3>
          <button
            onClick={() => { setIsEditing(true); setSaved(false); }}
            className="flex items-center gap-1.5 text-xs text-green-700 hover:text-green-800 font-medium transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
        <StarRating rating={rating} size="sm" />
        <p className="mt-2 text-sm text-gray-700 leading-relaxed">{body}</p>
        <p className="mt-2 text-xs text-green-600 font-medium">Saved successfully.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setLoading(true);
    setError(null);

    const result = existingReview
      ? await updateReview(existingReview.id, rating, body)
      : await submitReview(shopId, rating, body);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setIsEditing(false);
      setSaved(true);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">
          {existingReview ? "Edit Your Review" : "Write a Review"}
        </h3>
        {existingReview && (
          <button
            type="button"
            onClick={() => { setIsEditing(false); setRating(existingReview.rating); setBody(existingReview.body); setError(null); }}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm mb-3">
          {error}
        </div>
      )}

      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">Rating</label>
        <StarRating
          rating={rating}
          size="lg"
          interactive
          onRatingChange={setRating}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="review-body" className="block text-sm text-gray-600 mb-1">
          Your review
        </label>
        <textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          required
          placeholder="Share your experience..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Saving..." : existingReview ? "Save Changes" : "Submit Review"}
      </button>
    </form>
  );
}
