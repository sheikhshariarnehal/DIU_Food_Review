import { StarRating } from "./StarRating";
import type { ReviewWithProfile } from "@/lib/types/database";
import { formatDistanceToNow } from "@/lib/utils/date";

interface ReviewCardProps {
  review: ReviewWithProfile;
  showReplyForm?: boolean;
  replyForm?: React.ReactNode;
}

export function ReviewCard({ review, showReplyForm, replyForm }: ReviewCardProps) {
  const reply = review.review_replies?.[0];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
      {/* Reviewer Info */}
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm shrink-0">
          {review.profiles?.full_name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-medium text-gray-900">
              {review.profiles?.full_name || "Anonymous"}
            </p>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(review.created_at)}
            </span>
          </div>
          <div className="mt-1">
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="mt-2 text-sm text-gray-700 leading-relaxed">
            {review.body}
          </p>
        </div>
      </div>

      {/* Reply */}
      {reply && (
        <div className="mt-4 ml-12 bg-gray-50 rounded-lg p-3 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-1">
            Shop Owner Reply
          </p>
          <p className="text-sm text-gray-700">{reply.body}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(reply.created_at)}
          </p>
        </div>
      )}

      {/* Reply Form Slot */}
      {showReplyForm && !reply && (
        <div className="mt-4 ml-12">{replyForm}</div>
      )}
    </div>
  );
}
