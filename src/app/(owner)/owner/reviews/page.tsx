import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OwnerReviewsClient } from "./OwnerReviewsClient";
import type { ReviewWithProfile } from "@/lib/types/database";
import { Store } from "lucide-react";
import Link from "next/link";

export const revalidate = 30;

export default async function OwnerReviewsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get owner's shop
  const { data: shop } = await supabase
    .from("shops")
    .select("id, name")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    return (
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
          <Store className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">No Shop Assigned</h2>
        <p className="mt-1 text-xs text-gray-500">
          Please set up your shop profile before managing customer reviews.
        </p>
        <Link
          href="/owner/dashboard"
          className="mt-4 inline-flex items-center rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  // Get all reviews for this shop
  const { data: reviewsRaw } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url), review_replies(*)")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false });

  // Normalize review_replies to always be an array
  const reviews = (reviewsRaw || []).map((r: any) => ({
    ...r,
    review_replies: r.review_replies
      ? Array.isArray(r.review_replies)
        ? r.review_replies
        : [r.review_replies]
      : [],
  })) as ReviewWithProfile[];

  return <OwnerReviewsClient shopName={shop.name} reviews={reviews} />;
}
