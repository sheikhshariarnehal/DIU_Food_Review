"use client";

import { useState } from "react";
import { submitReply } from "@/app/actions/reviews";
import { Loader2, Send } from "lucide-react";

interface ReplyFormProps {
  reviewId: string;
}

export function ReplyForm({ reviewId }: ReplyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await submitReply(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // on success, server action revalidates the path
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <input type="hidden" name="review_id" value={reviewId} />
      {error && (
        <p className="text-xs text-red-600 font-medium">{error}</p>
      )}
      <textarea
        name="body"
        rows={2}
        required
        placeholder="Write a response to this review..."
        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs placeholder-gray-400 outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition-all resize-none shadow-2xs"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-2xs transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Send className="h-3 w-3" />
          )}
          <span>{loading ? "Posting..." : "Post Reply"}</span>
        </button>
      </div>
    </form>
  );
}
