import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReviewCard } from "@/components/ReviewCard";
import { ReplyForm } from "@/components/ReplyForm";
import type { ReviewWithProfile } from "@/lib/types/database";
import { MessageSquare } from "lucide-react";

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
      <div className="max-w-3xl mx-auto text-center py-16">
        <p className="text-gray-500">No shop assigned to your account.</p>
      </div>
    );
  }

  // Get all reviews for this shop
  const { data: reviewsRaw } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url), review_replies(*)")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false });

  // Supabase may return review_replies as a single object (not array) when a
  // UNIQUE constraint exists on review_id. Normalize to always be an array.
  const reviews = reviewsRaw?.map((r: any) => ({
    ...r,
    review_replies: r.review_replies
      ? Array.isArray(r.review_replies)
        ? r.review_replies
        : [r.review_replies]
      : [],
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">
          Customer reviews for {shop.name}
        </p>
      </div>

      {!reviews || reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No reviews yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {(reviews as unknown as ReviewWithProfile[]).map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              showReplyForm
              replyForm={<ReplyForm reviewId={review.id} />}
            />
          ))}
        </div>
      )}
    </div>
  );
}
