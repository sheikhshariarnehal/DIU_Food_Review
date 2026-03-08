"use client";

import { useState } from "react";
import { submitReply } from "@/app/actions/reviews";

interface ReplyFormProps {
  reviewId: string;
}

export function ReplyForm({ reviewId }: ReplyFormProps) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
        <p className="text-sm text-green-700 font-medium">Reply submitted!</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    setError(null);

    const result = await submitReply(reviewId, body);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-xs">
          {error}
        </div>
      )}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        required
        placeholder="Write your reply..."
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
      />
      <button
        type="submit"
        disabled={loading || !body.trim()}
        className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Sending..." : "Reply"}
      </button>
    </form>
  );
}
