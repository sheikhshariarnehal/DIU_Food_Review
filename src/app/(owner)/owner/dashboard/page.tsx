import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Store,
  Star,
  MessageSquare,
  UtensilsCrossed,
  Trophy,
  ArrowRight,
  Crown,
  Medal,
  Award,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Flame,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CreateShopForm from "./CreateShopForm";
import { Card, CardHeader, CardContent, CardAction } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LeaderboardEntry } from "@/lib/types/database";
import { formatDistanceToNow } from "@/lib/utils/date";

export const revalidate = 60;

/* ── Stat card ── */
function StatCard({
  label,
  value,
  sub,
  icon,
  extra,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  extra?: React.ReactNode;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
          {label}
        </p>
        <CardAction>
          <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 bg-gray-50 border border-gray-100">
            {icon}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-900 leading-none">
          {value}
        </p>
        {extra}
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </CardContent>
    </Card>
  );
}

/* ── Rank badge ── */
function RankBadge({ rank }: { rank: number }) {
  const base = "w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold";
  if (rank === 1)
    return <div className={`${base} bg-yellow-50 text-yellow-600 border border-yellow-200`}>1</div>;
  if (rank === 2)
    return <div className={`${base} bg-slate-50 text-slate-600 border border-slate-200`}>2</div>;
  if (rank === 3)
    return <div className={`${base} bg-orange-50 text-orange-600 border border-orange-200`}>3</div>;
  return (
    <div className={`${base} bg-gray-50 text-gray-500 border border-gray-200`}>
      {rank}
    </div>
  );
}

/* ── Mini star row (server-safe, no client) ── */
function MiniStars({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5 mt-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          strokeWidth={1.5}
          className={`w-3.5 h-3.5 ${
            i < Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="text-[10px] text-gray-500 ml-1 font-semibold">{Number(rating).toFixed(1)}</span>
    </div>
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
      <div className="max-w-2xl mx-auto py-6 px-4 sm:py-12 sm:px-0">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Shop
          </h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
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
        .limit(4),
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

  /* ── rank banner config ── */
  const rankBannerConfig = isRanked
    ? myLeaderboardRank === 1
      ? {
          bg: "bg-yellow-50 border-yellow-200",
          text: "text-yellow-800",
          sub: "text-yellow-600",
          icon: <Crown className="w-4 h-4 text-yellow-600" strokeWidth={1.5} />,
          label: "You are #1 on the leaderboard!",
          badge: "bg-yellow-100 text-yellow-800",
          badgeText: "🏆 Top Rated",
        }
      : myLeaderboardRank === 2
      ? {
          bg: "bg-slate-50 border-slate-200",
          text: "text-slate-800",
          sub: "text-slate-500",
          icon: <Medal className="w-4 h-4 text-slate-600" strokeWidth={1.5} />,
          label: `Ranked #${myLeaderboardRank} on the leaderboard`,
          badge: "bg-white border border-slate-200 text-slate-700",
          badgeText: "🥈 Silver Rank",
        }
      : myLeaderboardRank === 3
      ? {
          bg: "bg-orange-50 border-orange-200",
          text: "text-orange-800",
          sub: "text-orange-600",
          icon: <Award className="w-4 h-4 text-orange-600" strokeWidth={1.5} />,
          label: `Ranked #${myLeaderboardRank} on the leaderboard`,
          badge: "bg-orange-100 text-orange-800",
          badgeText: "🥉 Bronze Rank",
        }
      : {
          bg: "bg-green-50 border-green-200",
          text: "text-green-800",
          sub: "text-green-600",
          icon: <Trophy className="w-4 h-4 text-green-600" strokeWidth={1.5} />,
          label: `Ranked #${myLeaderboardRank} on the leaderboard`,
          badge: "bg-green-100 text-green-800",
          badgeText: "✅ Ranked",
        }
    : null;

  return (
    <div className="w-full space-y-4">

      {/* ── Header ── */}
      <Card className="py-0">
        <CardHeader className="py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-9 h-9 shrink-0">
              {shop.image_url ? (
                <Image
                  src={shop.image_url}
                  alt={shop.name}
                  fill
                  sizes="36px"
                  className="object-cover rounded-lg"
                />
              ) : (
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Store className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-semibold text-gray-900 leading-tight">
                  {shop.name}
                </h1>
                {shop.is_active ? (
                  <Badge variant="outline" className="text-[11px] text-green-700 border-green-200 bg-green-50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[11px] text-red-700 border-red-200 bg-red-50">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Inactive
                  </Badge>
                )}
              </div>
              {(shop.description || true) && (
                <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                  {shop.description || "Shop Dashboard"}
                </p>
              )}
            </div>
          </div>
          <CardAction>
            <Button variant="outline" size="sm" asChild>
              <Link href="/owner/shop">Edit Shop <ChevronRight className="w-3 h-3" strokeWidth={1.5} /></Link>
            </Button>
          </CardAction>
        </CardHeader>
      </Card>


      {/* ── Rank Banner (if ranked) ── */}
      {rankBannerConfig && (
        <div
          className={`border rounded-lg px-4 py-3 flex items-center justify-between gap-3 ${rankBannerConfig.bg}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
              {rankBannerConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-bold ${rankBannerConfig.text}`}>
                  {rankBannerConfig.label}
                </p>
                <Badge variant="secondary" className={`text-[10px] font-semibold ${rankBannerConfig.badge}`}>
                  {rankBannerConfig.badgeText}
                </Badge>
              </div>
              <p className={`text-xs mt-0.5 opacity-80 ${rankBannerConfig.sub}`}>
                Ranked among shops with 5+ reviews
              </p>
            </div>
          </div>
          <Link
            href="/leaderboard"
            className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-white px-2.5 py-1.5 rounded border border-gray-200/60 shadow-sm transition-all shrink-0"
          >
            Full Board <ArrowRight className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
          </Link>
        </div>
      )}

      {/* ── Progress to leaderboard ── */}
      {!isRanked && reviewCount < 5 && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 flex items-center gap-3">
          <Flame className="w-4 h-4 text-blue-500 shrink-0" strokeWidth={1.5} />
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-blue-800">
              {5 - reviewCount} more {5 - reviewCount === 1 ? "review" : "reviews"} to unlock the leaderboard
            </p>
            <div className="mt-1 h-1 bg-blue-100/50 rounded-full overflow-hidden max-w-xs">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(reviewCount / 5) * 100}%` }}
              />
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 shrink-0">{reviewCount}<span className="text-blue-400 font-medium">/5</span></span>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
        <StatCard
          label="Avg Rating"
          value={avgRating > 0 ? Number(avgRating).toFixed(1) : "—"}
          sub={avgRating > 0 ? "out of 5.0" : "no reviews yet"}
          icon={<Star className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.75} />}
          extra={avgRating > 0 ? <MiniStars rating={Number(avgRating)} /> : undefined}
        />
        <StatCard
          label="Reviews"
          value={reviewCount}
          sub="total received"
          icon={<MessageSquare className="w-3.5 h-3.5 text-blue-500" strokeWidth={1.75} />}
        />
        <StatCard
          label="Menu Items"
          value={menuCount}
          sub="items listed"
          icon={<UtensilsCrossed className="w-3.5 h-3.5 text-purple-500" strokeWidth={1.75} />}
        />
        <StatCard
          label="LB Rank"
          value={isRanked ? `#${myLeaderboardRank}` : "—"}
          sub={isRanked ? `of ${leaderboard.length} shops` : "needs 5+ reviews"}
          icon={<Trophy className="w-3.5 h-3.5 text-green-600" strokeWidth={1.75} />}
        />
      </div>

      {/* ── Main Grid: Leaderboard | Actions | Reviews ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4">

        {/* ── Leaderboard ── */}
        <Card className="overflow-hidden flex flex-col py-0 gap-0">
          <CardHeader className="border-b border-gray-100 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-amber-50 border border-amber-100 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 text-sm leading-none">Leaderboard</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Top rated campus shops</p>
              </div>
            </div>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/leaderboard">View Full <ArrowRight className="w-3 h-3" strokeWidth={1.5} /></Link>
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="p-0 flex-1 flex flex-col">
          {leaderboard.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
              <Trophy className="w-8 h-8 text-gray-200 mb-2" strokeWidth={1.5} />
              <p className="text-sm text-gray-400">No ranked shops yet.</p>
              <p className="text-xs text-gray-300 mt-1">Shops need 5+ reviews to appear here.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-[1.5rem_1.5rem_1fr_4.5rem_2rem] items-center gap-2.5 px-4 py-2 bg-gray-50 border-b border-gray-100/50">
                <span className="text-[10px] font-semibold text-gray-400 uppercase">#</span>
                <span />
                <span className="text-[10px] font-semibold text-gray-400 uppercase">Shop</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase text-center">Rating</span>
                <span className="text-[10px] font-semibold text-gray-400 uppercase text-right">Rev</span>
              </div>
              <div className="divide-y divide-gray-50 flex-1">
                {leaderboard.slice(0, 8).map((entry, index) => {
                  const rank = index + 1;
                  const isMe = entry.shop_id === shop.id;
                  const barWidth = Math.round((Number(entry.avg_rating) / 5) * 100);
                  return (
                    <div
                      key={entry.shop_id}
                      className={`grid grid-cols-[1.5rem_1.5rem_1fr_4.5rem_2rem] items-center gap-2.5 px-4 py-2.5 transition-colors ${
                        isMe
                          ? "bg-green-50/50"
                          : "hover:bg-gray-50/50"
                      }`}
                    >
                      <RankBadge rank={rank} />
                      <div className="relative w-6 h-6 rounded overflow-hidden bg-gray-100 ring-1 ring-gray-200/50 shrink-0">
                        {entry.shop_image_url ? (
                          <Image
                            src={entry.shop_image_url}
                            alt={entry.shop_name}
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Store className="w-3 h-3 text-gray-300" strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <p className={`text-xs font-semibold truncate ${isMe ? "text-green-700" : "text-gray-700"}`}>
                            {entry.shop_name}
                          </p>
                          {isMe && (
                            <span className="shrink-0 text-[8px] font-bold bg-green-100 text-green-700 px-1 py-0.5 rounded-sm leading-none">
                              You
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 1 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 fill-amber-400 text-amber-400`}
                            />
                          ))}
                          <span className="text-[11px] text-gray-600 font-semibold ml-0.5">
                            {Number(entry.avg_rating).toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-gray-400 text-right flex items-center justify-end gap-1">
                        {entry.review_count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          </CardContent>
        </Card>

        {/* ── Quick Actions ── */}
        <Card className="self-start py-0 gap-0">
          <CardHeader className="border-b border-gray-100 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0">
                <TrendingUp className="w-3.5 h-3.5 text-gray-600" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 leading-none">Quick Actions</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Manage your shop</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-3">
          <div className="space-y-1.5">
            {[
              {
                href: "/owner/menu",
                icon: <UtensilsCrossed className="w-4 h-4 text-gray-500" strokeWidth={1.5} />,
                label: "Manage Menu",
                sub: `${menuCount} item${menuCount !== 1 ? "s" : ""} listed`,
                badge: menuCount > 0 ? String(menuCount) : null,
              },
              {
                href: "/owner/reviews",
                icon: <MessageSquare className="w-4 h-4 text-gray-500" strokeWidth={1.5} />,
                label: "View Reviews",
                sub: `${reviewCount} review${reviewCount !== 1 ? "s" : ""} received`,
                badge: reviewCount > 0 ? String(reviewCount) : null,
              },
              {
                href: "/owner/shop",
                icon: <Store className="w-4 h-4 text-gray-500" strokeWidth={1.5} />,
                label: "Shop Settings",
                sub: "Update info & image",
                badge: null,
              },
              {
                href: "/leaderboard",
                icon: <Trophy className="w-4 h-4 text-gray-500" strokeWidth={1.5} />,
                label: "Full Leaderboard",
                sub: `${leaderboard.length} shops ranked`,
                badge: null,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
              >
                <div className={`w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm group-hover:border-gray-300 transition-colors`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-gray-400">{item.sub}</p>
                </div>
                {item.badge && (
                  <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" strokeWidth={1.5} />
              </Link>
            ))}
          </div>
          </CardContent>
        </Card>

        {/* ── Recent Reviews ── */}
        <Card className="overflow-hidden flex flex-col py-0 gap-0">
          <CardHeader className="border-b border-gray-100 py-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-blue-50 border border-blue-100 flex items-center justify-center">
                <MessageSquare className="w-3.5 h-3.5 text-blue-500" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 leading-none">Recent Reviews</h2>
                <p className="text-[11px] text-gray-400 mt-0.5">Latest feedback</p>
              </div>
            </div>
            <CardAction>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/owner/reviews">All Reviews <ArrowRight className="w-3 h-3" strokeWidth={1.5} /></Link>
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="p-0 flex-1 flex flex-col">
          {recentReviews.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50/30">
              <MessageSquare className="w-8 h-8 text-gray-200 mb-2" strokeWidth={1.5} />
              <p className="text-sm text-gray-400">No reviews yet.</p>
              <p className="text-xs text-gray-300 mt-1">Reviews will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 flex-1">
              {recentReviews.map((review) => {
                const profile = review.profiles as unknown as { full_name: string };
                const name = profile?.full_name || "Anonymous";
                const stars = review.rating;
                const avatarStyle =
                  stars >= 4
                    ? "bg-green-50 text-green-700 border border-green-100"
                    : stars === 3
                    ? "bg-amber-50 text-amber-700 border border-amber-100"
                    : "bg-red-50 text-red-700 border border-red-100";
                return (
                  <div
                    key={review.id}
                    className="px-4 py-3 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-6 h-6 rounded-full ${avatarStyle} flex items-center justify-center text-[10px] font-bold shrink-0`}>
                          {name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-semibold text-gray-800 block truncate">
                            {name}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {formatDistanceToNow(review.created_at)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-2.5 h-2.5 ${
                              i < stars
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed pl-8">
                      {review.body}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
