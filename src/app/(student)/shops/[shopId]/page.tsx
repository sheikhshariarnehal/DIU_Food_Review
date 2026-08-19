import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StarRating } from "@/components/StarRating";
import { SafeImage } from "@/components/ui/SafeImage";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { MenuItemCard } from "@/components/MenuItemCard";
import { Store, MessageSquare, UtensilsCrossed } from "lucide-react";
import type { Metadata } from "next";
import type { ReviewWithProfile, MenuItemWithRating } from "@/lib/types/database";

interface ShopDetailPageProps {
  params: Promise<{ shopId: string }>;
}

export async function generateMetadata({
  params,
}: ShopDetailPageProps): Promise<Metadata> {
  const { shopId } = await params;
  const supabase = await createClient();

  const { data: shop } = await supabase
    .from("shops")
    .select("name, description")
    .eq("id", shopId)
    .single();

  if (!shop) {
    return { title: "Shop Not Found" };
  }

  return {
    title: shop.name,
    description: shop.description || `Reviews for ${shop.name} at DIU campus`,
    openGraph: {
      title: `${shop.name} | DIU Food Review`,
      description: shop.description || `Reviews for ${shop.name}`,
    },
  };
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { shopId } = await params;
  const supabase = await createClient();

  // Fetch shop
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("id", shopId)
    .single();

  if (!shop) {
    notFound();
  }

  // Fetch rating
  const { data: ratingData } = await supabase.rpc("get_shop_average_rating", {
    p_shop_id: shopId,
  });

  const avgRating = ratingData?.[0]?.avg_rating ?? 0;
  const reviewCount = ratingData?.[0]?.review_count ?? 0;

  // Fetch menu items with attached reviews
  const { data: menuItemsRaw } = await supabase
    .from("menu_items")
    .select("*, menu_item_reviews(rating)")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: true });

  const menuItems: MenuItemWithRating[] = (menuItemsRaw || []).map((item: any) => {
    const itemReviews = Array.isArray(item.menu_item_reviews)
      ? item.menu_item_reviews
      : item.menu_item_reviews
      ? [item.menu_item_reviews]
      : [];
    const count = itemReviews.length;
    const total = itemReviews.reduce(
      (sum: number, r: { rating: number }) => sum + (r.rating || 0),
      0
    );
    return {
      ...item,
      avg_rating: count > 0 ? Number((total / count).toFixed(2)) : 0,
      review_count: count,
    };
  });

  // Fetch reviews with profiles and replies
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url), review_replies(*)")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });

  // Check if current user has already reviewed
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let existingReview: { id: string; rating: number; body: string } | null = null;
  if (user) {
    const { data } = await supabase
      .from("reviews")
      .select("id, rating, body")
      .eq("shop_id", shopId)
      .eq("user_id", user.id)
      .maybeSingle();
    existingReview = data ?? null;
  }

  // Check if user is a student (only active students can review)
  let isStudent = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();
    isStudent = profile?.role === "student" && profile?.status === "active";
  }

  const activeMenuItems = menuItems?.filter((i) => i.status === "active") ?? [];

  return (
    <div className="w-full space-y-5">
      {/* Shop Header */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 sm:h-64">
          <SafeImage
            src={shop.image_url ?? ""}
            alt={shop.name}
            fill
            fallbackType="store"
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 100%"
            priority
          />
        </div>
        <div className="p-5 sm:p-6">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{shop.name}</h1>
          {shop.description && (
            <p className="mt-2 text-sm text-gray-500">{shop.description}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StarRating rating={avgRating} size="md" />
            <span className="text-lg font-bold text-gray-900">
              {avgRating > 0 ? avgRating.toFixed(1) : "\u2014"}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-400">
              <MessageSquare className="h-3.5 w-3.5" />
              {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
            </span>
            {activeMenuItems.length > 0 && (
              <span className="flex items-center gap-1 text-sm text-gray-400">
                <UtensilsCrossed className="h-3.5 w-3.5" />
                {activeMenuItems.length} items
              </span>
            )}
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Restaurant",
            name: shop.name,
            description: shop.description,
            image: shop.image_url,
            aggregateRating:
              reviewCount > 0
                ? {
                    "@type": "AggregateRating",
                    ratingValue: avgRating.toFixed(1),
                    reviewCount: reviewCount,
                    bestRating: 5,
                    worstRating: 1,
                  }
                : undefined,
          }),
        }}
      />

      {/* Menu Items with Ratings & Review Modals */}
      {menuItems && menuItems.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900">
              Menu Items
              <span className="ml-1.5 text-gray-400 font-normal">({menuItems.length})</span>
            </h2>
            <span className="text-xs text-gray-400">Click any dish to view & write reviews</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                currentUserId={user?.id}
                isStudent={isStudent}
              />
            ))}
          </div>
        </section>
      )}

      {/* Review Form (students only) */}
      {isStudent && (
        <section>
          <ReviewForm shopId={shopId} existingReview={existingReview} />
        </section>
      )}

      {/* Reviews */}
      <section>
        <h2 className="mb-3 text-sm font-bold text-gray-900">
          Customer Reviews
          <span className="ml-1.5 text-gray-400 font-normal">({reviewCount})</span>
        </h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-3">
            {(reviews as unknown as ReviewWithProfile[]).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
              <MessageSquare className="h-6 w-6 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-900">No reviews yet</p>
            <p className="mt-1 text-xs text-gray-400">Be the first to share your experience!</p>
          </div>
        )}
      </section>
    </div>
  );
}
