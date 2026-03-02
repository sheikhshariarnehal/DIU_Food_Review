import { createClient } from "@/lib/supabase/server";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { Store, Users, MessageSquare, Star, TrendingUp, AlertTriangle } from "lucide-react";

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
      ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
      : "0.0";

  // Recent reviews (flagged: accounts created < 24h — basic fake review detection)
  const { data: recentReviews } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, created_at), shops(name)")
    .order("created_at", { ascending: false })
    .limit(10);

  // Top shops
  const { data: topShops } = await supabase
    .from("leaderboard_view")
    .select("*")
    .limit(5);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">System overview and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <AnalyticsCard title="Total Shops" value={totalShops ?? 0} icon={Store} />
        <AnalyticsCard title="Total Users" value={totalUsers ?? 0} icon={Users} />
        <AnalyticsCard title="Total Reviews" value={totalReviews ?? 0} icon={MessageSquare} />
        <AnalyticsCard title="Avg Rating" value={globalAvg} icon={Star} description="across all shops" />
        <AnalyticsCard title="Pending Approvals" value={pendingApprovals ?? 0} icon={AlertTriangle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Shops */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Top Rated Shops
          </h2>
          {topShops && topShops.length > 0 ? (
            <div className="space-y-3">
              {topShops.map((shop, index) => (
                <div key={shop.shop_id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-5">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {shop.shop_name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    ⭐ {Number(shop.avg_rating).toFixed(1)} ({shop.review_count})
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No ranked shops yet.</p>
          )}
        </section>

        {/* Recent Reviews */}
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-600" />
            Recent Reviews
          </h2>
          {recentReviews && recentReviews.length > 0 ? (
            <div className="space-y-3">
              {recentReviews.map((review) => {
                const profile = review.profiles as unknown as { full_name: string; created_at: string };
                const shop = review.shops as unknown as { name: string };
                const accountAge = profile?.created_at
                  ? Date.now() - new Date(profile.created_at).getTime()
                  : Infinity;
                const isNewAccount = accountAge < 24 * 60 * 60 * 1000;

                return (
                  <div key={review.id} className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 truncate">
                          {profile?.full_name || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-400">→</span>
                        <span className="text-sm text-gray-600 truncate">
                          {shop?.name}
                        </span>
                        {isNewAccount && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">
                            New Account
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        ⭐ {review.rating} — {review.body}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
