import { StarRating } from "./StarRating";
import type { ReviewWithProfile, ReviewReply } from "@/lib/types/database";
import { formatDistanceToNow } from "@/lib/utils/date";
import { Reply, Store } from "lucide-react";

interface ReviewCardProps {
  review: ReviewWithProfile;
  showReplyForm?: boolean;
  replyForm?: React.ReactNode;
}

export function ReviewCard({ review, showReplyForm, replyForm }: ReviewCardProps) {
  // Normalize review_replies whether returned as array or single object by Supabase
  const rawReply = review.review_replies;
  const reply: ReviewReply | null = Array.isArray(rawReply)
    ? (rawReply[0] ?? null)
    : rawReply && typeof rawReply === "object" && "body" in (rawReply as object)
    ? (rawReply as unknown as ReviewReply)
    : null;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all sm:p-5">
      {/* Reviewer Info */}
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-sm font-bold text-emerald-800 shadow-sm ring-2 ring-white">
          {review.profiles?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-bold text-gray-900">
              {review.profiles?.full_name || "Anonymous Student"}
            </p>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(review.created_at)}
            </span>
          </div>
          <div className="mt-1">
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-700">
            {review.body}
          </p>
        </div>
      </div>

      {/* Owner Reply */}
      {reply && (
        <div className="mt-4 ml-6 sm:ml-12 rounded-xl border border-emerald-100/80 bg-emerald-50/40 p-3.5 sm:p-4">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Store className="h-3 w-3" />
            </div>
            <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
              Shop Owner Reply
            </p>
            <span className="ml-auto text-[11px] text-gray-400">
              {formatDistanceToNow(reply.created_at)}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-gray-700 pl-7">
            {reply.body}
          </p>
        </div>
      )}

      {/* Reply Form Slot (Only if no reply exists yet) */}
      {showReplyForm && !reply && (
        <div className="mt-4 ml-6 sm:ml-12">{replyForm}</div>
      )}
    </div>
  );
}
