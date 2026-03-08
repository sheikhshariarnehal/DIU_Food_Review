import { createClient } from "@/lib/supabase/server";
import { ShopCard } from "@/components/ShopCard";
import { StarRating } from "@/components/StarRating";
import { Trophy, Store, ArrowRight } from "lucide-react";
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

  const rankColors = [
    "bg-amber-50 text-amber-700",
    "bg-gray-100 text-gray-600",
    "bg-orange-50 text-orange-600",
  ];

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Food Shops</h1>
        <p className="mt-1 text-sm text-gray-500">
          Discover and review food shops at DIU campus
        </p>
      </div>

      {/* Top 3 Leaderboard Widget */}
      {topShops && topShops.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50">
                <Trophy className="h-4 w-4 text-amber-500" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Top Rated Shops</h2>
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(topShops as LeaderboardEntry[]).map((entry, index) => (
              <Link
                key={entry.shop_id}
                href={`/shops/${entry.shop_id}`}
                className="group rounded-xl border border-gray-100 bg-gray-50/50 p-3 transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm"
              >
                <div className="mb-1.5 flex items-center gap-2">
                  <span
                    className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold ${rankColors[index]}`}
                  >
                    {index + 1}
                  </span>
                  <span className="truncate text-sm font-medium text-gray-900 group-hover:text-emerald-600">
                    {entry.shop_name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <StarRating rating={Math.round(entry.avg_rating)} size="sm" />
                  <span className="text-xs font-medium text-gray-500">
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
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
            <Store className="h-6 w-6 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-900">No shops available yet.</p>
          <p className="mt-1 text-xs text-gray-400">Check back soon for new shops.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shopsWithRatings.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
