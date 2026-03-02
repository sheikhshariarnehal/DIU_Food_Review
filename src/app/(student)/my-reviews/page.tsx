import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StarRating } from "@/components/StarRating";
import { formatDistanceToNow } from "@/lib/utils/date";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default async function MyReviewsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user's reviews with shop info
  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, shops(id, name, image_url), review_replies(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">
          All reviews you&apos;ve submitted
        </p>
      </div>

      {!reviews || reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            You haven&apos;t written any reviews yet.
          </p>
          <Link
            href="/dashboard"
            className="inline-block mt-3 text-sm font-medium text-green-600 hover:text-green-700"
          >
            Browse shops to leave a review →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const shop = review.shops as unknown as {
              id: string;
              name: string;
              image_url: string | null;
            };
            const reply = (review.review_replies as unknown as { body: string; created_at: string }[])?.[0];

            return (
              <div
                key={review.id}
                className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <Link
                    href={`/shops/${shop.id}`}
                    className="font-medium text-gray-900 hover:text-green-600 transition-colors"
                  >
                    {shop.name}
                  </Link>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(review.created_at)}
                  </span>
                </div>
                <StarRating rating={review.rating} size="sm" />
                <p className="mt-2 text-sm text-gray-700">{review.body}</p>

                {reply && (
                  <div className="mt-3 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Shop Owner Reply
                    </p>
                    <p className="text-sm text-gray-700">{reply.body}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
