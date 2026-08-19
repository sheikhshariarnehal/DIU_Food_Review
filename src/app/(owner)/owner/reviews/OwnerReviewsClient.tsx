"use client";

import { useState, useMemo } from "react";
import { ReviewCard } from "@/components/ReviewCard";
import { ReplyForm } from "@/components/ReplyForm";
import { StarRating } from "@/components/StarRating";
import type { ReviewWithProfile } from "@/lib/types/database";
import {
  MessageSquare,
  Search,
  CheckCircle2,
  AlertCircle,
  Star,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface OwnerReviewsClientProps {
  shopName: string;
  reviews: ReviewWithProfile[];
}

type FilterOption = "all" | "unreplied" | "5star" | "critical";

export function OwnerReviewsClient({ shopName, reviews }: OwnerReviewsClientProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterOption>("all");

  const stats = useMemo(() => {
    const total = reviews.length;
    const unreplied = reviews.filter((r: any) => {
      const replies = Array.isArray(r.review_replies)
        ? r.review_replies
        : r.review_replies
        ? [r.review_replies]
        : [];
      return replies.length === 0;
    }).length;
    const fiveStar = reviews.filter((r) => r.rating === 5).length;
    const avg =
      total > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
        : 0;

    return { total, unreplied, fiveStar, avg };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r: any) => {
      const replies = Array.isArray(r.review_replies)
        ? r.review_replies
        : r.review_replies
        ? [r.review_replies]
        : [];
      const isUnreplied = replies.length === 0;

      // Filter tabs
      if (filter === "unreplied" && !isUnreplied) return false;
      if (filter === "5star" && r.rating !== 5) return false;
      if (filter === "critical" && r.rating > 3) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const studentName = (r.profiles?.full_name || "").toLowerCase();
        const bodyText = (r.body || "").toLowerCase();
        return studentName.includes(q) || bodyText.includes(q);
      }

      return true;
    });
  }, [reviews, filter, search]);

  const filterTabs: { id: FilterOption; label: string; count: number }[] = [
    { id: "all", label: "All Reviews", count: stats.total },
    { id: "unreplied", label: "Needs Reply", count: stats.unreplied },
    { id: "5star", label: "⭐ 5 Stars", count: stats.fiveStar },
    { id: "critical", label: "⚠️ Critical (1-3★)", count: reviews.filter((r) => r.rating <= 3).length },
  ];

  const getBadgeClass = (tab: typeof filterTabs[0], isActive: boolean) => {
    if (isActive) return "bg-white/20 text-white";
    if (tab.id === "unreplied" && tab.count > 0) return "bg-rose-100 text-rose-800";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Customer Reviews & Feedback
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage feedback and reply directly to students for <strong className="text-gray-800">{shopName}</strong>
          </p>
        </div>

        {stats.total > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-2.5 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <StarRating rating={stats.avg} size="sm" />
              <span className="text-sm font-bold text-gray-900 tabular-nums">
                {stats.avg.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-200">|</span>
            <span className="text-xs font-semibold text-gray-600">
              {stats.total} total
            </span>
          </div>
        )}
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search reviews by student name or feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 rounded-xl border-gray-200 bg-gray-50/60 pl-10 text-xs shadow-none focus-visible:bg-white focus-visible:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`inline-flex items-center gap-1.5 shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-gray-900 text-white shadow-2xs"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-xs font-bold ${getBadgeClass(tab, isActive)}`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reviews Stream */}
      {filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-2xs">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
            <MessageSquare className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-gray-900">No matching reviews found</p>
          <p className="mt-1 text-xs text-gray-400">
            {search || filter !== "all"
              ? "Try clearing your search query or selecting a different filter."
              : "Customer reviews for your shop will appear here as students write them."}
          </p>
          {(search || filter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setFilter("all");
              }}
              className="mt-4 inline-flex items-center rounded-xl bg-gray-100 px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showReplyForm
              replyForm={<ReplyForm reviewId={review.id} />}
            />
          ))}
        </div>
      )}
    </div>
  );
}
