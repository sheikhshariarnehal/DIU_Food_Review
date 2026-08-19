import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StarRating } from "@/components/StarRating";
import { SafeImage } from "@/components/ui/SafeImage";
import { ReviewCard } from "@/components/ReviewCard";
import { ReviewForm } from "@/components/ReviewForm";
import { MenuItemCard } from "@/components/MenuItemCard";
import {
  MessageSquare,
  UtensilsCrossed,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
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
    title: `${shop.name} | DIU Food Review`,
    description: shop.description || `Student reviews and menu for ${shop.name} at DIU campus`,
    openGraph: {
      title: `${shop.name} | DIU Food Review`,
      description: shop.description || `Reviews and menu for ${shop.name}`,
    },
  };
}

export default async function ShopDetailPage({ params }: ShopDetailPageProps) {
  const { shopId } = await params;
  const supabase = await createClient();

  // Fetch shop details
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("id", shopId)
    .single();

  if (!shop) {
    notFound();
  }

  // Fetch aggregate rating
  const { data: ratingData } = await supabase.rpc("get_shop_average_rating", {
    p_shop_id: shopId,
  });

  const avgRating = ratingData?.[0]?.avg_rating ?? 0;
  const reviewCount = ratingData?.[0]?.review_count ?? 0;

  // Fetch menu items with reviews
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

  // Fetch customer reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url), review_replies(*)")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false });

  // Current session & user role
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

  let isStudent = false;
  let isOwner = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .single();
    isStudent = profile?.role === "student" && profile?.status === "active";
    isOwner = shop.owner_id === user.id || profile?.role === "super_admin";
  }

  const activeMenuItems = menuItems?.filter((i) => i.status === "active") ?? [];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* ── Breadcrumb Navigation ── */}
      <div className="flex items-center gap-2">
        <Link
          href="/shops"
          className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 transition-colors hover:text-gray-900"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span>Back to All Shops</span>
        </Link>
      </div>

      {/* ── Hero Stall Card (Distilled Layout) ── */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xs">
        <div className="relative aspect-[21/9] w-full min-h-[180px] sm:min-h-[240px] overflow-hidden bg-gray-100">
          <SafeImage
            src={shop.image_url ?? ""}
            alt={shop.name}
            fill
            fallbackType="store"
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 1024px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <div className="absolute bottom-4 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 text-white">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-0.5 text-xs font-semibold text-white/90 backdrop-blur-md">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>DIU Campus Stall</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight sm:text-3xl text-white drop-shadow-xs">
                  {shop.name}
                </h1>
                {shop.description && (
                  <p className="max-w-2xl text-xs text-white/80 line-clamp-2">
                    {shop.description}
                  </p>
                )}
              </div>

              {/* Rating Pill */}
              <div className="flex shrink-0 items-center gap-2 rounded-2xl bg-white/20 px-3.5 py-2 backdrop-blur-md">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <StarRating rating={avgRating} size="xs" />
                    <span className="text-sm font-black text-white">
                      {avgRating > 0 ? avgRating.toFixed(1) : "New"}
                    </span>
                  </div>
                  <p className="text-xs text-white/80">
                    {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50/50 sm:grid-cols-3">
          <div className="p-3.5 text-center">
            <p className="text-xs text-gray-500 font-medium">Stall Rating</p>
            <p className="text-sm font-bold text-gray-900">
              {avgRating > 0 ? `⭐ ${avgRating.toFixed(1)} / 5.0` : "Unrated"}
            </p>
          </div>
          <div className="p-3.5 text-center">
            <p className="text-xs text-gray-500 font-medium">Available Dishes</p>
            <p className="text-sm font-bold text-gray-900">
              {activeMenuItems.length} items
            </p>
          </div>
          <div className="col-span-2 sm:col-span-1 p-3.5 text-center border-t sm:border-t-0 border-gray-100">
            <p className="text-xs text-gray-500 font-medium">Student Sentiment</p>
            <p className="text-sm font-bold text-emerald-700">
              {reviewCount > 0 ? `${reviewCount} Verified Reviews` : "Awaiting First Review"}
            </p>
          </div>
        </div>
      </div>

      {/* JSON-LD Schema */}
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

      {/* ── 2-Column Responsive Layout: Menu (Left 3 cols) & Reviews (Right 2 cols) ── */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Left Column: Menu Items Catalog */}
        <section className="space-y-4 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
                <span>Menu Catalog</span>
              </h2>
              <p className="text-xs text-gray-500">
                {menuItems.length} dishes offered by this stall
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-400">
              Tap any dish to rate
            </span>
          </div>

          {menuItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
              <UtensilsCrossed className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm font-bold text-gray-800">No dishes on the menu yet</p>
              <p className="mt-0.5 text-xs text-gray-400">
                The stall owner hasn&apos;t added menu items yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {menuItems.map((item) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  currentUserId={user?.id}
                  isStudent={isStudent}
                  isOwner={isOwner}
                />
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Student Reviews & Submission */}
        <section className="space-y-5 lg:col-span-2">
          {/* Review Submission Form (For Active Students) */}
          {isStudent && (
            <div>
              <ReviewForm shopId={shopId} existingReview={existingReview} />
            </div>
          )}

          {/* Customer Reviews Stream */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                  <span>Stall Reviews</span>
                </h2>
                <p className="text-xs text-gray-500">
                  {reviewCount} student {reviewCount === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            {reviews && reviews.length > 0 ? (
              <div className="space-y-3">
                {(reviews as unknown as ReviewWithProfile[]).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-2xs">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-50 text-gray-300">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <p className="text-xs font-bold text-gray-800">No stall reviews yet</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  {isStudent
                    ? "Share your first review above to guide other DIU students!"
                    : "Student reviews will appear here."}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
