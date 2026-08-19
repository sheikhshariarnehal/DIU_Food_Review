import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StarRating } from "@/components/StarRating";
import { formatDistanceToNow } from "@/lib/utils/date";
import Link from "next/link";
import { MessageSquare, Store, ArrowRight, Reply } from "lucide-react";
import type { ReviewReply } from "@/lib/types/database";

function extractReply(rawReply: unknown): ReviewReply | null {
  if (!rawReply) return null;
  if (Array.isArray(rawReply) && rawReply.length > 0) return rawReply[0];
  if (typeof rawReply === "object" && "body" in rawReply) return rawReply as ReviewReply;
  return null;
}

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

  const reviewCount = reviews?.length ?? 0;
  const repliedCount =
    reviews?.filter((r) => extractReply(r.review_replies) !== null).length ?? 0;

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">My Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">All reviews you&apos;ve submitted</p>
        </div>
        {reviewCount > 0 && (
          <div className="flex items-center gap-3">
            <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm text-center">
              <p className="text-lg font-bold text-gray-900">{reviewCount}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Reviews</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-sm text-center">
              <p className="text-lg font-bold text-emerald-600">{repliedCount}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">Replies</p>
            </div>
          </div>
        )}
      </div>

      {!reviews || reviews.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
            <MessageSquare className="h-6 w-6 text-gray-300" />
          </div>
          <p className="text-sm font-medium text-gray-900">No reviews yet.</p>
          <p className="mt-1 text-xs text-gray-400">You haven&apos;t written any reviews yet.</p>
          <Link
            href="/shops"
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-100 transition-colors"
          >
            Browse shops <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => {
            const shop = review.shops as unknown as {
              id: string;
              name: string;
              image_url: string | null;
            };
            const reply = extractReply(review.review_replies);

            return (
              <div
                key={review.id}
                className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
              >
                <div>
                  {/* Shop name + date */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <Link
                      href={`/shops/${shop.id}`}
                      className="flex items-center gap-1.5 font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
                    >
                      <Store className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <span className="truncate">{shop.name}</span>
                    </Link>
                    <span className="shrink-0 text-xs text-gray-400">
                      {formatDistanceToNow(review.created_at)}
                    </span>
                  </div>

                  <StarRating rating={review.rating} size="sm" />
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{review.body}</p>
                </div>

                {reply && (
                  <div className="mt-4 rounded-xl border border-emerald-100/80 bg-emerald-50/40 p-3">
                    <div className="mb-1.5 flex items-center gap-1.5">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        <Reply className="h-2.5 w-2.5" />
                      </div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                        Owner Reply
                      </p>
                      <span className="ml-auto text-[10px] text-gray-400">
                        {formatDistanceToNow(reply.created_at)}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-700 pl-5.5">{reply.body}</p>
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
