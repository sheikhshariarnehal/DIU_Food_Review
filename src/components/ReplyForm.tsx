"use client";

import { useState } from "react";
import { submitReply } from "@/app/actions/reviews";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
      <div className="flex items-center gap-2 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-3 text-xs font-semibold text-emerald-800">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>Your response has been published to the student review!</span>
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
      toast.error(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      toast.success("Reply submitted successfully!");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      )}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={2}
        required
        placeholder="Write an official response to this review..."
        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-xs text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none shadow-2xs"
      />
      <div className="flex items-center justify-end">
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          <span>{loading ? "Posting..." : "Post Reply"}</span>
        </button>
      </div>
    </form>
  );
}
