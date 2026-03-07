import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { StarRating } from "@/components/StarRating";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { MenuItemCard } from "@/components/MenuItemCard";
import { MapPin } from "lucide-react";
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

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Shop Header */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="relative w-full h-48 sm:h-64 bg-gray-100">
          {shop.image_url ? (
            <Image
              src={shop.image_url}
              alt={shop.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
              priority
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-16 h-16 text-gray-300" />
            </div>
          )}
        </div>
        <div className="p-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
          {shop.description && (
            <p className="text-gray-600 mt-2">{shop.description}</p>
          )}
          <div className="flex items-center gap-3 mt-4">
            <StarRating rating={Math.round(avgRating)} size="md" />
            <span className="text-lg font-semibold text-gray-800">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500">
              ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
            </span>
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
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Menu</h2>
          <div className="space-y-3">
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
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Reviews ({reviewCount})
        </h2>
        {reviews && reviews.length > 0 ? (
          <div className="space-y-4">
            {(reviews as unknown as ReviewWithProfile[]).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-sm text-gray-500">No reviews yet. Be the first!</p>
          </div>
        )}
      </section>
    </div>
  );
}
