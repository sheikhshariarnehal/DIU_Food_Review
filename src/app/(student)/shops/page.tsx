import { createClient } from "@/lib/supabase/server";
import { ShopCard } from "@/components/ShopCard";
import { StarRating } from "@/components/StarRating";
import { Trophy } from "lucide-react";
import Link from "next/link";
import type { ShopWithRating, LeaderboardEntry } from "@/lib/types/database";

export default async function StudentDashboard() {
  const supabase = await createClient();

  // Fetch all active shops with their ratings
  const { data: shops } = await supabase
    .from("shops")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Get ratings for each shop
  const shopsWithRatings: ShopWithRating[] = [];
  if (shops) {
    for (const shop of shops) {
      const { data: ratingData } = await supabase.rpc("get_shop_average_rating", {
        p_shop_id: shop.id,
      });
      shopsWithRatings.push({
        ...shop,
        avg_rating: ratingData?.[0]?.avg_rating ?? 0,
        review_count: ratingData?.[0]?.review_count ?? 0,
      });
    }
  }

  // Fetch top 3 for leaderboard widget
  const { data: topShops } = await supabase
    .from("leaderboard_view")
    .select("*")
    .limit(3);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Food Shops</h1>
        <p className="text-sm text-gray-500 mt-1">
          Discover and review food shops at DIU campus
        </p>
      </div>

      {/* Top 3 Leaderboard Widget */}
      {topShops && topShops.length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-sm font-semibold text-gray-900">Top Rated Shops</h2>
            </div>
            <Link
              href="/leaderboard"
              className="text-xs font-medium text-green-600 hover:text-green-700"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(topShops as LeaderboardEntry[]).map((entry, index) => (
              <Link
                key={entry.shop_id}
                href={`/shops/${entry.shop_id}`}
                className="bg-white rounded-lg p-3 border border-green-100 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold ${
                      index === 0
                        ? "text-yellow-600"
                        : index === 1
                        ? "text-gray-500"
                        : "text-orange-600"
                    }`}
                  >
                    #{index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {entry.shop_name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <StarRating rating={Math.round(entry.avg_rating)} size="sm" />
                  <span className="text-xs text-gray-500 ml-1">
                    {entry.avg_rating.toFixed(1)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* All Shops Grid */}
      {shopsWithRatings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">No shops available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shopsWithRatings.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
