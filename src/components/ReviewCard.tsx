import { StarRating } from "./StarRating";
import type { ReviewWithProfile } from "@/lib/types/database";
import { formatDistanceToNow } from "@/lib/utils/date";
import { Reply } from "lucide-react";

interface ReviewCardProps {
  review: ReviewWithProfile;
  showReplyForm?: boolean;
  replyForm?: React.ReactNode;
}

export function ReviewCard({ review, showReplyForm, replyForm }: ReviewCardProps) {
  const reply = review.review_replies?.[0];

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
      {/* Reviewer Info */}
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 text-sm font-semibold text-emerald-700 shadow-sm ring-1 ring-white">
          {review.profiles?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              {review.profiles?.full_name || "Anonymous"}
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

      {/* Reply */}
      {reply && (
        <div className="mt-3 ml-12 rounded-xl border border-gray-100 bg-gray-50/60 p-3">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Reply className="h-3 w-3 text-gray-400" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Owner Reply
            </p>
            <span className="ml-auto text-xs text-gray-400">
              {formatDistanceToNow(reply.created_at)}
            </span>
          </div>
          <p className="text-sm text-gray-700">{reply.body}</p>
        </div>
      )}

      {/* Reply Form Slot */}
      {showReplyForm && !reply && (
        <div className="mt-3 ml-12">{replyForm}</div>
      )}
    </div>
  );
}
