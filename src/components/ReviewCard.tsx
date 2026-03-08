"use client";

import { StarRating } from "./StarRating";
import type { ReviewWithProfile } from "@/lib/types/database";
import { formatDistanceToNow } from "@/lib/utils/date";
import { Card, CardContent } from "@/components/ui/card";
import { BorderBeam } from "@/components/ui/border-beam";

interface ReviewCardProps {
  review: ReviewWithProfile;
  showReplyForm?: boolean;
  replyForm?: React.ReactNode;
}

export function ReviewCard({ review, showReplyForm, replyForm }: ReviewCardProps) {
  const reply = review.review_replies?.[0];
  const name = review.profiles?.full_name || "Anonymous";
  const initial = name.charAt(0).toUpperCase();
  const stars = review.rating;
  const avatarColor =
    stars >= 4
      ? "bg-green-100 text-green-700"
      : stars === 3
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  const isTopRated = stars >= 4;

  return (
    <Card className="py-0 gap-0 relative overflow-hidden">
      {isTopRated && (
        <BorderBeam
          size={60}
          duration={8}
          colorFrom="#16a34a"
          colorTo="#22c55e"
          borderWidth={2}
        />
      )}
      <CardContent className="p-4">
        {/* Reviewer */}
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold shrink-0`}>
            {initial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-semibold text-gray-900">{name}</p>
              <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(review.created_at)}</span>
            </div>
            <div className="mt-0.5">
              <StarRating rating={review.rating} size="sm" />
            </div>
            <p className="mt-1.5 text-sm text-gray-700 leading-relaxed">{review.body}</p>
          </div>
        </div>

        {/* Reply */}
        {reply && (
          <div className="mt-3 ml-11 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Owner Reply</p>
            <p className="text-sm text-gray-700 leading-relaxed">{reply.body}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{formatDistanceToNow(reply.created_at)}</p>
          </div>
        )}

        {/* Reply Form */}
        {showReplyForm && !reply && (
          <div className="mt-3 ml-11">{replyForm}</div>
        )}
      </CardContent>
    </Card>
  );
}
