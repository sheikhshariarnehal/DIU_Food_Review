import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { StarRating } from "@/components/StarRating";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { MenuItemCard } from "@/components/MenuItemCard";
import { Store, MessageSquare, UtensilsCrossed } from "lucide-react";
import type { Metadata } from "next";
import type { ReviewWithProfile } from "@/lib/types/database";

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

  // Fetch menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: true });

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

  // Check if user is a student (only students can review)
  let isStudent = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    isStudent = profile?.role === "student";
  }

  const activeMenuItems = menuItems?.filter((i) => i.status === "active") ?? [];

  return (
    <div className="w-full space-y-5">
      {/* Shop Header */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 sm:h-64">
          {shop.image_url ? (
            <Image
              src={shop.image_url}
              alt={shop.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 100%"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Store className="h-16 w-16 text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-5 sm:p-6">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">{shop.name}</h1>
          {shop.description && (
            <p className="mt-2 text-sm text-gray-500">{shop.description}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StarRating rating={Math.round(avgRating)} size="md" />
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

      {/* Menu Items */}
      {menuItems && menuItems.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-bold text-gray-900">
            Menu
            <span className="ml-1.5 text-gray-400 font-normal">({menuItems.length})</span>
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <MenuItemCard key={item.id} item={item} />
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
          Reviews
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
