"use client";

import { useState } from "react";
import { submitReply } from "@/app/actions/reviews";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

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
      <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" strokeWidth={1.5} />
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
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        required
        placeholder="Write your reply..."
        className="resize-none text-sm"
      />
      <ShimmerButton
        type="submit"
        disabled={loading || !body.trim()}
        shimmerColor="#22c55e"
        shimmerSize="0.06em"
        background="rgba(22, 163, 74, 1)"
        className="px-3 py-1.5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Reply"}
      </ShimmerButton>
    </form>
  );
}
