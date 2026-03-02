import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { StarRating } from "@/components/StarRating";
import { Store, Star, MessageSquare, TrendingUp } from "lucide-react";
import Link from "next/link";
import CreateShopForm from "./CreateShopForm";

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
          <Store className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Create Your Shop
          </h2>
          <p className="text-gray-500 text-sm">
            Set up your shop to start adding menu items and receiving reviews.
          </p>
        </div>
        <CreateShopForm />
      </div>
    );
  }

  // Get shop stats
  const { data: ratingData } = await supabase.rpc("get_shop_average_rating", {
    p_shop_id: shop.id,
  });

  const avgRating = ratingData?.[0]?.avg_rating ?? 0;
  const reviewCount = ratingData?.[0]?.review_count ?? 0;

  // Get menu items count
  const { count: menuCount } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true })
    .eq("shop_id", shop.id);

  // Get recent reviews
  const { data: recentReviews } = await supabase
    .from("reviews")
    .select("*, profiles(full_name)")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
        <p className="text-sm text-gray-500 mt-1">Shop Dashboard Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          title="Average Rating"
          value={avgRating.toFixed(1)}
          icon={Star}
          description="out of 5.0"
        />
        <AnalyticsCard
          title="Total Reviews"
          value={reviewCount}
          icon={MessageSquare}
        />
        <AnalyticsCard
          title="Menu Items"
          value={menuCount ?? 0}
          icon={Store}
        />
        <AnalyticsCard
          title="Shop Status"
          value={shop.is_active ? "Active" : "Inactive"}
          icon={TrendingUp}
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/owner/menu"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
        >
          <h3 className="font-semibold text-gray-900">Manage Menu</h3>
          <p className="text-sm text-gray-500 mt-1">
            Add, edit, or toggle availability of menu items
          </p>
        </Link>
        <Link
          href="/owner/reviews"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
        >
          <h3 className="font-semibold text-gray-900">View Reviews</h3>
          <p className="text-sm text-gray-500 mt-1">
            Read and reply to customer reviews
          </p>
        </Link>
      </div>

      {/* Recent Reviews */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Reviews
        </h2>
        {!recentReviews || recentReviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentReviews.map((review) => {
              const profile = review.profiles as unknown as { full_name: string };
              return (
                <div
                  key={review.id}
                  className="bg-white rounded-xl border border-gray-200 p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {profile?.full_name || "Anonymous"}
                    </span>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{review.body}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
