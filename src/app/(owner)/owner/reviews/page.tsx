import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ReviewCard } from "@/components/ReviewCard";
import { ReplyForm } from "@/components/ReplyForm";
import type { ReviewWithProfile } from "@/lib/types/database";
import { MessageSquare } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";

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
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-0">
        <Card className="text-center">
          <CardContent className="py-12 flex flex-col items-center">
            <MessageSquare className="w-8 h-8 text-gray-200 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-gray-400">No shop assigned to your account.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get all reviews for this shop
  const { data: reviewsRaw } = await supabase
    .from("reviews")
    .select("*, profiles(full_name, avatar_url), review_replies(*)")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: false });

  const reviews = reviewsRaw?.map((r: any) => ({
    ...r,
    review_replies: r.review_replies
      ? Array.isArray(r.review_replies)
        ? r.review_replies
        : [r.review_replies]
      : [],
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-4">

      {/* ── Page Header ── */}
      <Card className="py-0">
        <CardHeader className="py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Customer Reviews</CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {reviews?.length ?? 0} review{(reviews?.length ?? 0) !== 1 ? "s" : ""} for {shop.name}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!reviews || reviews.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <MessageSquare className="w-8 h-8 text-gray-200 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-gray-400">No reviews yet.</p>
            <p className="text-xs text-gray-300 mt-1">Reviews from students will appear here.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
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
