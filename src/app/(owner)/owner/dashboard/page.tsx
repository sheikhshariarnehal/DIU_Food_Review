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

// Shadcn UI components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

/* ── Stat card ── */
function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub?: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Card className="shadow-sm border-zinc-200/50 hover:shadow-md transition-all duration-200 group bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wider">
          {label}
        </CardTitle>
        <div className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-50 text-zinc-600 transition-colors group-hover:bg-zinc-100 group-hover:text-zinc-900">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold tracking-tight text-zinc-900">{value}</div>
        {sub && <div className="text-[13px] font-medium text-zinc-500 mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );
}

/* ── Rank badge ── */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">1st</span>;
  if (rank === 2) return <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">2nd</span>;
  if (rank === 3) return <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-orange-100/80 text-orange-700/90 border border-orange-200">3rd</span>;
  return <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-bold bg-zinc-50 text-zinc-600 border border-zinc-100">{rank}th</span>;
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
      <div className="max-w-2xl mx-auto py-8">
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
    <div className="w-full mx-auto space-y-6">

      {/* ── Dashboard Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-5">
          <Avatar className="w-20 h-20 border-2 border-white shadow-md rounded-xl">
            {shop.image_url ? (
              <AvatarImage src={shop.image_url} className="object-cover" />
            ) : null}
            <AvatarFallback className="rounded-xl bg-zinc-50 text-zinc-400">
              <Store className="w-8 h-8" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 mb-1.5">{shop.name}</h1>
            <div className="flex items-center gap-2.5">
              {shop.is_active ? (
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-semibold text-emerald-700">Active</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                  <span className="text-sm font-semibold text-rose-700">Inactive</span>
                </div>
              )}
              {shop.description && (
                <span className="text-sm font-medium text-zinc-500 hidden sm:inline-block border-l border-zinc-300 pl-2.5">
                  {shop.description}
                </span>
              )}
            </div>
          </div>
        </div>

        <Link
          href="/owner/shop"
          className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-5 h-10 text-sm font-semibold text-white hover:bg-zinc-800 shadow-sm transition-all hover:shadow hover:-translate-y-0.5"
        >
          Edit Shop Details
        </Link>
      </div>

      {/* ── Progress to leaderboard ── */}
      {!isRanked && reviewCount < 5 && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-amber-100 bg-amber-50/50 text-amber-900">
          <Trophy className="w-4 h-4 text-amber-600 shrink-0" />
          <p className="text-[13px] font-medium grow">
            {5 - reviewCount} more {5 - reviewCount === 1 ? "review" : "reviews"} needed to unlock your leaderboard ranking.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-amber-100 overflow-hidden">
              <div
                className="h-full bg-amber-500"
                style={{ width: `${(reviewCount / 5) * 100}%` }}
              />
            </div>
            <span className="text-[11px] font-bold tabular-nums">{reviewCount}/5</span>
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Avg Rating"
          value={avgRating > 0 ? Number(avgRating).toFixed(1) : "—"}
          sub={avgRating > 0 ? "out of 5.0 maximum" : "No reviews yet"}
          icon={<Star className="w-4 h-4" />}
        />
        <StatCard
          label="Total Reviews"
          value={reviewCount.toLocaleString()}
          sub="Feedback from students"
          icon={<MessageSquare className="w-4 h-4" />}
        />
        <StatCard
          label="Menu Items"
          value={menuCount.toLocaleString()}
          sub="Active items listed"
          icon={<UtensilsCrossed className="w-4 h-4" />}
        />
        <StatCard
          label="Leaderboard Rank"
          value={isRanked ? `#${myLeaderboardRank}` : "—"}
          sub={isRanked ? `out of ${leaderboard.length} ranked shops` : "Unranked"}
          icon={<Trophy className="w-4 h-4" />}
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Leaderboard (Takes up 2/3 width on large screens) */}
        <Card className="lg:col-span-2 shadow-sm border-zinc-200/60 flex flex-col bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-zinc-100">
            <div>
              <CardTitle className="text-lg font-bold text-zinc-900">Leaderboard</CardTitle>
              <CardDescription className="text-[13px] font-medium text-zinc-500 mt-0.5">Top rated campus shops</CardDescription>
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex items-center justify-center rounded-lg px-3 h-8 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              View Rankings <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            {leaderboard.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <p className="text-sm text-muted-foreground mb-1">No ranked shops yet.</p>
                <p className="text-xs text-muted-foreground">Shops need 5+ reviews to appear here.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Shop</TableHead>
                    <TableHead className="text-center">Rating</TableHead>
                    <TableHead className="text-center">Reviews</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.slice(0, 5).map((entry, index) => {
                    const rank = index + 1;
                    const isMe = entry.shop_id === shop.id;
                    return (
                      <TableRow
                        key={entry.shop_id}
                        className={`group transition-colors ${isMe ? "bg-indigo-50/40 hover:bg-indigo-50/60" : "hover:bg-zinc-50/80"
                          }`}
                      >
                        <TableCell className="text-center text-sm">
                          <RankBadge rank={rank} />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 rounded-md">
                              {entry.shop_image_url ? (
                                <AvatarImage src={entry.shop_image_url} className="object-cover" />
                              ) : null}
                              <AvatarFallback className="rounded-md bg-muted text-muted-foreground text-[10px]">
                                <Store className="w-4 h-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium truncate">
                                {entry.shop_name}
                              </span>
                              {isMe && (
                                <span className="text-[10px] text-muted-foreground">Your Shop</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-medium tabular-nums">
                              {Number(entry.avg_rating).toFixed(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm text-muted-foreground tabular-nums">
                          {entry.review_count}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Quick Actions & Reviews */}
        <div className="space-y-6 flex flex-col">

          {/* Quick Actions */}
          <Card className="shadow-sm border-zinc-200/60 bg-white">
            <CardHeader className="pb-4 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    href: "/owner/menu",
                    icon: <UtensilsCrossed className="w-4 h-4" />,
                    label: "Manage Menu",
                    color: "bg-orange-50 text-orange-600 border-orange-100"
                  },
                  {
                    href: "/owner/reviews",
                    icon: <MessageSquare className="w-4 h-4" />,
                    label: "View Feedback",
                    color: "bg-blue-50 text-blue-600 border-blue-100"
                  },
                  {
                    href: "/owner/shop",
                    icon: <Store className="w-4 h-4" />,
                    label: "Shop Settings",
                    color: "bg-purple-50 text-purple-600 border-purple-100"
                  },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center w-full justify-start h-auto p-3 rounded-xl border border-zinc-200/60 bg-white hover:border-zinc-300 hover:shadow-sm transition-all text-sm font-semibold group"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mr-3.5 border ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-[13px] text-zinc-700 flex-1 text-left group-hover:text-zinc-900">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 shrink-0 transition-colors" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews Summary */}
          <Card className="shadow-sm border-zinc-200/60 bg-white flex-1 flex flex-col">
            <CardHeader className="pb-4 border-b border-zinc-100 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base font-bold text-zinc-900">Recent Ratings</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1">
              {recentReviews.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center mb-3">
                    <MessageSquare className="w-6 h-6 text-zinc-300" />
                  </div>
                  <p className="text-[13px] font-medium text-zinc-500">No recent feedback.</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {recentReviews.slice(0, 4).map((review) => {
                    const profile = review.profiles as unknown as { full_name: string };
                    const name = profile?.full_name || "Anonymous";
                    const stars = review.rating;

                    return (
                      <div key={review.id} className="p-4 hover:bg-zinc-50/80 transition-colors">
                        <div className="flex items-start justify-between mb-1.5">
                          <p className="text-[13px] font-bold text-zinc-900 truncate pr-2">{name}</p>
                          <div className="flex items-center gap-1 shrink-0 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700">
                            <span className="text-[11px] font-bold">{stars}.0</span>
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          </div>
                        </div>
                        <p className="text-[13px] text-zinc-600 line-clamp-2 leading-relaxed font-medium">
                          {review.body}
                        </p>
                        <p className="text-[11px] font-medium text-zinc-400 mt-2 tracking-wide uppercase">
                          {formatDistanceToNow(review.created_at)}
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
    </div>
  );
}
