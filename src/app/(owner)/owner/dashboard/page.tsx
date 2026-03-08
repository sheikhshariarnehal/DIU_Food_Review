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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
      {sub && <p className="mt-2 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

/* ── Rank badge ── */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
        1st
      </span>
    );
  if (rank === 2)
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
        2nd
      </span>
    );
  if (rank === 3)
    return (
      <span className="inline-flex items-center justify-center rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-700">
        3rd
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center rounded-full bg-gray-50 px-2 py-0.5 text-xs font-bold text-gray-500">
      {rank}th
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
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
            <Store className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Create Your Shop
          </h2>
          <p className="mx-auto max-w-sm text-sm text-gray-500">
            Set up your shop to start adding menu items and receiving reviews.
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
        .select("*, profiles(full_name)")
        .eq("shop_id", shop.id)
        .order("created_at", { ascending: false })
        .limit(6),
      supabase.from("leaderboard_view").select("*"),
    ]);

  const avgRating = ratingRes.data?.[0]?.avg_rating ?? 0;
  const reviewCount = ratingRes.data?.[0]?.review_count ?? 0;
  const menuCount = menuRes.count ?? 0;
  const recentReviews = recentReviewsRes.data ?? [];
  const leaderboard = (leaderboardRes.data as LeaderboardEntry[]) ?? [];

  // Find this shop's rank on the leaderboard
  const myLeaderboardRank =
    leaderboard.findIndex((e) => e.shop_id === shop.id) + 1; // 0 = not ranked
  const isRanked = myLeaderboardRank > 0;

  return (
    <div className="w-full space-y-5">
      {/* ── Dashboard Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm ring-1 ring-white sm:h-16 sm:w-16">
            {shop.image_url ? (
              <Image
                src={shop.image_url}
                alt={shop.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <Store className="h-7 w-7" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {shop.name}
            </h1>
            <div className="mt-1 flex items-center gap-2.5">
              {shop.is_active ? (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  <span className="text-xs font-medium text-emerald-700">
                    Active
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs font-medium text-red-700">
                    Inactive
                  </span>
                </div>
              )}
              {shop.description && (
                <span className="hidden border-l border-gray-200 pl-2.5 text-xs text-gray-400 sm:inline-block">
                  {shop.description}
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/owner/shop"
          className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-900 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800"
        >
          Edit Shop Details
        </Link>
      </div>

      {/* ── Progress to leaderboard ── */}
      {!isRanked && reviewCount < 5 && (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-3.5 text-amber-900">
          <Trophy className="h-4 w-4 shrink-0 text-amber-600" />
          <p className="grow text-xs font-medium">
            {5 - reviewCount} more{" "}
            {5 - reviewCount === 1 ? "review" : "reviews"} needed to unlock your
            leaderboard ranking.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-amber-100">
              <div
                className="h-full bg-amber-500"
                style={{ width: `${(reviewCount / 5) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-bold tabular-nums">
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
          sub={avgRating > 0 ? "out of 5.0 maximum" : "No reviews yet"}
          icon={<Star className="h-5 w-5" />}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Total Reviews"
          value={reviewCount.toLocaleString()}
          sub="Feedback from students"
          icon={<MessageSquare className="h-5 w-5" />}
          iconBg="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Menu Items"
          value={menuCount.toLocaleString()}
          sub="Active items listed"
          icon={<UtensilsCrossed className="h-5 w-5" />}
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Leaderboard Rank"
          value={isRanked ? `#${myLeaderboardRank}` : "—"}
          sub={
            isRanked
              ? `out of ${leaderboard.length} ranked shops`
              : "Unranked"
          }
          icon={<Trophy className="h-5 w-5" />}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left Column: Leaderboard */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Leaderboard
              </h2>
              <p className="mt-0.5 text-xs text-gray-400">
                Top rated campus shops
              </p>
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
            >
              View Rankings <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-sm text-gray-500">No ranked shops yet.</p>
              <p className="mt-0.5 text-xs text-gray-400">
                Shops need 5+ reviews to appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/60">
                    <th className="w-12 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      #
                    </th>
                    <th className="py-3 pl-4 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Shop
                    </th>
                    <th className="py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Rating
                    </th>
                    <th className="py-3 pr-4 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Reviews
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {leaderboard.slice(0, 5).map((entry, index) => {
                    const rank = index + 1;
                    const isMe = entry.shop_id === shop.id;
                    return (
                      <tr
                        key={entry.shop_id}
                        className={`transition-colors ${isMe ? "bg-blue-50/40" : "hover:bg-gray-50/60"}`}
                      >
                        <td className="py-3 text-center">
                          <RankBadge rank={rank} />
                        </td>
                        <td className="py-3 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200">
                              {entry.shop_image_url ? (
                                <Image
                                  src={entry.shop_image_url}
                                  alt={entry.shop_name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                  <Store className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-gray-900">
                                {entry.shop_name}
                              </p>
                              {isMe && (
                                <p className="text-[10px] text-blue-600">
                                  Your Shop
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <div className="inline-flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium tabular-nums text-gray-900">
                              {Number(entry.avg_rating).toFixed(1)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-center text-sm tabular-nums text-gray-500">
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

        {/* Right Column: Quick Actions & Reviews */}
        <div className="flex flex-col gap-5">
          {/* Quick Actions */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-bold text-gray-900">
                Quick Access
              </h2>
            </div>
            <div className="space-y-2 p-4">
              {[
                {
                  href: "/owner/menu",
                  icon: <UtensilsCrossed className="h-4 w-4" />,
                  label: "Manage Menu",
                  color: "bg-orange-50 text-orange-600",
                },
                {
                  href: "/owner/reviews",
                  icon: <MessageSquare className="h-4 w-4" />,
                  label: "View Feedback",
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  href: "/owner/shop",
                  icon: <Store className="h-4 w-4" />,
                  label: "Shop Settings",
                  color: "bg-purple-50 text-purple-600",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center rounded-xl border border-gray-100 bg-white p-3 transition-all hover:border-gray-200 hover:shadow-sm"
                >
                  <div
                    className={`mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${item.color}`}
                  >
                    {item.icon}
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-gray-500" />
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Reviews Summary */}
          <div className="flex flex-1 flex-col rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-bold text-gray-900">
                Recent Ratings
              </h2>
            </div>
            {recentReviews.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                  <MessageSquare className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-sm text-gray-500">No recent feedback.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentReviews.slice(0, 4).map((review) => {
                  const profile = review.profiles as unknown as {
                    full_name: string;
                  };
                  const name = profile?.full_name || "Anonymous";
                  const stars = review.rating;

                  return (
                    <div
                      key={review.id}
                      className="p-4 transition-colors hover:bg-gray-50/60"
                    >
                      <div className="mb-1.5 flex items-start justify-between">
                        <p className="truncate pr-2 text-sm font-medium text-gray-900">
                          {name}
                        </p>
                        <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-amber-700">
                          <span className="text-[11px] font-bold">
                            {stars}.0
                          </span>
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        </div>
                      </div>
                      <p className="line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {review.body}
                      </p>
                      <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        {formatDistanceToNow(review.created_at)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
