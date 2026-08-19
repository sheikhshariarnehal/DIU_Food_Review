import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Store,
  Star,
  MessageSquare,
  UtensilsCrossed,
  Trophy,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { StarRating } from "@/components/StarRating";
import CreateShopForm from "./CreateShopForm";
import type { LeaderboardEntry } from "@/lib/types/database";
import { formatDistanceToNow } from "@/lib/utils/date";

export const revalidate = 60;

/* ── Stat card ── */
function StatCard({
  label,
  value,
  sub,
  icon,
  iconBg,
}: {
  label: string;
  value: string | number;
  sub?: React.ReactNode;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs transition-all hover:border-gray-200 hover:shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        </div>
      </div>
      {sub && <div className="mt-3 text-xs text-gray-400 border-t border-gray-50 pt-2">{sub}</div>}
    </div>
  );
}

/* ── Rank badge ── */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
        🥇 1st
      </span>
    );
  if (rank === 2)
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-700">
        🥈 2nd
      </span>
    );
  if (rank === 3)
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-700">
        🥉 3rd
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-bold text-gray-600">
      #{rank}
    </span>
  );
}

export default async function OwnerDashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get owner's shop
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    return (
      <div className="mx-auto max-w-2xl py-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm">
            <Store className="h-8 w-8" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Create Your Shop Profile
          </h2>
          <p className="mx-auto max-w-sm text-sm text-gray-500">
            Set up your shop to start publishing your menu and engaging with student food reviews.
          </p>
        </div>
        <CreateShopForm />
      </div>
    );
  }

  // Parallel data fetching
  const [ratingRes, menuRes, recentReviewsRes, leaderboardRes] =
    await Promise.all([
      supabase.rpc("get_shop_average_rating", { p_shop_id: shop.id }),
      supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true })
        .eq("shop_id", shop.id),
      supabase
        .from("reviews")
        .select("*, profiles(full_name), review_replies(*)")
        .eq("shop_id", shop.id)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("leaderboard_view").select("*"),
    ]);

  const avgRating = ratingRes.data?.[0]?.avg_rating ?? 0;
  const reviewCount = ratingRes.data?.[0]?.review_count ?? 0;
  const menuCount = menuRes.count ?? 0;
  const recentReviews = (recentReviewsRes.data || []).map((r: any) => {
    const replies = Array.isArray(r.review_replies)
      ? r.review_replies
      : r.review_replies
      ? [r.review_replies]
      : [];
    return {
      ...r,
      hasReply: replies.length > 0,
      replyBody: replies[0]?.body ?? null,
    };
  });
  const leaderboard = (leaderboardRes.data as LeaderboardEntry[]) ?? [];

  // Find this shop's rank on the leaderboard
  const myLeaderboardRank =
    leaderboard.findIndex((e) => e.shop_id === shop.id) + 1; // 0 = not ranked
  const isRanked = myLeaderboardRank > 0;

  const unrepliedCount = recentReviews.filter((r) => !r.hasReply).length;

  return (
    <div className="w-full space-y-6">
      {/* ── Dashboard Banner / Header ── */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-xs sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-gray-100 shadow-xs sm:h-20 sm:w-20">
              <SafeImage
                src={shop.image_url ?? ""}
                alt={shop.name}
                fill
                fallbackType="store"
                className="object-cover"
                sizes="(max-width: 640px) 64px, 80px"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                  {shop.name}
                </h1>
                {shop.is_active ? (\n                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active Stall
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                    Inactive
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                {shop.description || "Campus food shop at Daffodil International University"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={`/shops/${shop.id}`}
              target="_blank"
              className="inline-flex h-9 items-center justify-center rounded-xl border border-gray-200 bg-white px-3.5 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              Public Page ↗
            </Link>
            <Link
              href="/owner/shop"
              className="inline-flex h-9 items-center justify-center rounded-xl bg-gray-900 px-4 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-gray-800"
            >
              Edit Shop
            </Link>
          </div>
        </div>
      </div>

      {/* ── Progress to Leaderboard Banner ── */}
      {!isRanked && reviewCount < 5 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
              <Trophy className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950">
                Unlock Campus Leaderboard Ranking
              </p>
              <p className="text-xs text-amber-800">
                Collect {5 - reviewCount} more {5 - reviewCount === 1 ? "review" : "reviews"} from students to qualify for rankings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <div className="h-2 w-28 overflow-hidden rounded-full bg-amber-200/70">
              <div
                className="h-full bg-amber-500 transition-all duration-500"
                style={{ width: `${(reviewCount / 5) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-amber-900 tabular-nums">
              {reviewCount}/5
            </span>
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Avg Rating"
          value={avgRating > 0 ? Number(avgRating).toFixed(1) : "—"}
          sub={
            <div className="flex items-center gap-1.5">
              <StarRating rating={avgRating} size="xs" />
              <span className="text-xs text-gray-500">{avgRating > 0 ? "out of 5.0" : "No ratings"}</span>
            </div>
          }
          icon={<Star className="h-5 w-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Total Reviews"
          value={reviewCount.toLocaleString()}
          sub={
            unrepliedCount > 0 ? (
              <span className="font-semibold text-rose-600">
                {unrepliedCount} pending {unrepliedCount === 1 ? "reply" : "replies"}
              </span>
            ) : (\n              <span className="text-emerald-600 font-medium">All reviews answered</span>
            )
          }
          icon={<MessageSquare className="h-5 w-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Menu Items"
          value={menuCount.toLocaleString()}
          sub={<Link href="/owner/menu" className="font-medium text-emerald-600 hover:underline">Manage menu items →</Link>}
          icon={<UtensilsCrossed className="h-5 w-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Leaderboard Rank"
          value={isRanked ? `#${myLeaderboardRank}` : "—"}
          sub={
            isRanked ? (
              <span className="text-purple-600 font-medium">
                Top {Math.max(1, Math.round((myLeaderboardRank / Math.max(1, leaderboard.length)) * 100))}% on campus
              </span>
            ) : (
              <span className="text-gray-400">Needs 5+ reviews</span>
            )
          }
          icon={<Trophy className="h-5 w-5" />}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Campus Leaderboard Preview */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Campus Leaderboard
              </h2>
              <p className="text-xs text-gray-500">
                Live rankings across all DIU food stalls
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Full Rankings <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 text-center">
              <Trophy className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-700">No ranked shops yet</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Shops appear here after accumulating 5 or more verified student reviews.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="w-16 py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Rank
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Shop Name
                    </th>
                    <th className="py-3 px-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Rating
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">
                      Reviews
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leaderboard.slice(0, 5).map((entry, index) => {
                    const isMe = entry.shop_id === shop.id;
                    return (
                      <tr
                        key={entry.shop_id}
                        className={`transition-colors ${
                          isMe
                            ? "bg-emerald-50/70 font-semibold"
                            : "hover:bg-gray-50/60"
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <RankBadge rank={index + 1} />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-900">
                              {entry.shop_name}
                            </span>
                            {isMe && (
                              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-xs font-bold text-emerald-800">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-xs font-bold text-gray-900 tabular-nums">
                            ⭐ {entry.avg_rating.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right text-xs text-gray-500 tabular-nums">
                          {entry.review_count}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Recent Reviews Feed with Reply Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Recent Reviews
              </h2>
              <p className="text-xs text-gray-500">Latest student feedback</p>
            </div>
            <Link
              href="/owner/reviews"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Manage All <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentReviews.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-xs">
              <MessageSquare className="mx-auto mb-2 h-8 w-8 text-gray-300" />
              <p className="text-xs font-bold text-gray-800">No reviews yet</p>
              <p className="mt-0.5 text-xs text-gray-400">
                Customer reviews and ratings will show up here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentReviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">
                      {review.profiles?.full_name || "Student"}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formatDistanceToNow(review.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <StarRating rating={review.rating} size="xs" />
                    <span className="text-xs font-bold text-gray-700">
                      {review.rating}.0
                    </span>
                  </div>

                  {review.body && (
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      &ldquo;{review.body}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between border-t border-gray-50 pt-2">
                    {review.hasReply ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Replied
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                        <Clock className="h-3 w-3" /> Needs Reply
                      </span>
                    )}

                    <Link
                      href="/owner/reviews"
                      className="text-[11px] font-semibold text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {review.hasReply ? "View reply" : "Reply now →"}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
