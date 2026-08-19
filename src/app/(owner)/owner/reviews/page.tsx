import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OwnerReviewsClient } from "./OwnerReviewsClient";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export const revalidate = 0; // Fresh reviews

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
      <div className="mx-auto max-w-2xl py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
          <MessageSquare className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">No Shop Found</h2>
        <p className="mt-1 text-sm text-gray-500">
          You need to create a shop before managing customer reviews.
        </p>
        <Link
          href="/owner/dashboard"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-gray-800"
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
  }));

  return (
    <div className="w-full pb-10">
      <OwnerReviewsClient shopId={shop.id} initialReviews={reviews} />
    </div>
  );
}
