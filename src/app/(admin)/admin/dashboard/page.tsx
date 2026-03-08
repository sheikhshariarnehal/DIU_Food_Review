import { createClient } from "@/lib/supabase/server";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import {
  Store,
  Users,
  MessageSquare,
  Star,
  TrendingUp,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Crown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // Total shops
  const { count: totalShops } = await supabase
    .from("shops")
    .select("*", { count: "exact", head: true });

  // Total users
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Total reviews
  const { count: totalReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true });

  // Pending approvals
  const { count: pendingApprovals } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "shop_owner")
    .eq("status", "pending");

  // Average rating across all shops
  const { data: allReviews } = await supabase
    .from("reviews")
    .select("rating");

  const globalAvg =
    allReviews && allReviews.length > 0
      ? (
          allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
        ).toFixed(1)
      : "0.0";

  // Recent reviews
  const { data: recentReviews } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, created_at), shops(name)")
    .order("created_at", { ascending: false })
    .limit(8);

  // Top shops
  const { data: topShops } = await supabase
    .from("leaderboard_view")
    .select("*")
    .limit(5);

  const maxRating = topShops?.[0]?.avg_rating
    ? Number(topShops[0].avg_rating)
    : 5;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Platform overview and real-time analytics
          </p>
        </div>
        <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-gray-100 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm sm:mt-0">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          System Online
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <AnalyticsCard
          title="Shops"
          value={totalShops ?? 0}
          icon={Store}
          accent="bg-blue-50 text-blue-600"
        />
        <AnalyticsCard
          title="Users"
          value={totalUsers ?? 0}
          icon={Users}
          accent="bg-violet-50 text-violet-600"
        />
        <AnalyticsCard
          title="Reviews"
          value={totalReviews ?? 0}
          icon={MessageSquare}
          accent="bg-emerald-50 text-emerald-600"
        />
        <AnalyticsCard
          title="Avg Rating"
          value={globalAvg}
          icon={Star}
          description="all shops"
          accent="bg-amber-50 text-amber-600"
        />
        <AnalyticsCard
          title="Pending"
          value={pendingApprovals ?? 0}
          icon={AlertTriangle}
          accent={
            (pendingApprovals ?? 0) > 0
              ? "bg-red-50 text-red-600"
              : "bg-gray-50 text-gray-500"
          }
        />
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Rated Shops */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
              <Crown className="h-4.5 w-4.5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Top Rated Shops
              </p>
              <p className="text-xs text-gray-400">
                Highest average ratings
              </p>
            </div>
          </div>
          <div>
            {topShops && topShops.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {topShops.map((shop, index) => {
                  const rating = Number(shop.avg_rating);
                  const pct = maxRating > 0 ? (rating / 5) * 100 : 0;
                  return (
                    <div
                      key={shop.shop_id}
                      className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-gray-50/50"
                    >
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          index === 0
                            ? "bg-amber-100 text-amber-700"
                            : index === 1
                              ? "bg-gray-100 text-gray-600"
                              : index === 2
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-50 text-gray-400"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {shop.shop_name}
                        </p>
                        <div className="mt-1.5">
                          <Progress value={pct} className="h-1.5 [&_[data-slot=progress-track]]:h-1.5" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold tabular-nums text-gray-900">
                          {rating.toFixed(1)}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({shop.review_count})
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <TrendingUp className="mb-2 h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-500">
                  No ranked shops yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-gray-100 px-5 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
              <MessageSquare className="h-4.5 w-4.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Recent Reviews
              </p>
              <p className="text-xs text-gray-400">
                Latest student feedback
              </p>
            </div>
          </div>
          <div>
            {recentReviews && recentReviews.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {recentReviews.map((review) => {
                  const profile = review.profiles as unknown as {
                    full_name: string;
                    created_at: string;
                  };
                  const shop = review.shops as unknown as { name: string };
                  const accountAge = profile?.created_at
                    ? Date.now() - new Date(profile.created_at).getTime()
                    : Infinity;
                  const isNewAccount = accountAge < 24 * 60 * 60 * 1000;
                  const initials =
                    profile?.full_name
                      ?.split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "?";

                  return (
                    <div
                      key={review.id}
                      className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-gray-50/50"
                    >
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-[10px] font-semibold text-gray-600 shadow-sm ring-1 ring-white">
                        {initials}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {profile?.full_name || "Anonymous"}
                          </span>
                          <span className="text-gray-300">→</span>
                          <span className="truncate text-sm text-gray-500">
                            {shop?.name}
                          </span>
                          {isNewAccount && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-700 ring-1 ring-red-600/10">
                              <ShieldAlert className="h-3 w-3" />
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-gray-400">
                          {review.body}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 ring-1 ring-amber-100">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-amber-700">
                          {review.rating}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Clock className="mb-2 h-8 w-8 text-gray-300" />
                <p className="text-sm text-gray-500">No reviews yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
