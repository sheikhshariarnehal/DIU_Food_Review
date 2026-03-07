"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(shopId: string, rating: number, body: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit a review." };
  }

  // Validate rating
  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5." };
  }

  if (!body.trim()) {
    return { error: "Review body cannot be empty." };
  }

  // Check if user is a student
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "student" || profile.status !== "active") {
    return { error: "Only active students can submit reviews." };
  }

  // Insert review (UNIQUE constraint handles one-per-shop)
  const { error } = await supabase.from("reviews").insert({
    shop_id: shopId,
    user_id: user.id,
    rating,
    body: body.trim(),
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You have already reviewed this shop." };
    }
    return { error: "Failed to submit review. Please try again." };
  }

  revalidatePath(`/shops/${shopId}`);
  revalidatePath("/leaderboard");
  revalidatePath("/shops");

  return { success: true };
}

export async function updateReview(reviewId: string, rating: number, body: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a review." };
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5." };
  }

  if (!body.trim()) {
    return { error: "Review body cannot be empty." };
  }

  // Fetch shop_id for revalidation
  const { data: existing } = await supabase
    .from("reviews")
    .select("shop_id, user_id")
    .eq("id", reviewId)
    .single();

  if (!existing || existing.user_id !== user.id) {
    return { error: "Review not found or you don't have permission to edit it." };
  }

  const { error } = await supabase
    .from("reviews")
    .update({ rating, body: body.trim() })
    .eq("id", reviewId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to update review. Please try again." };
  }

  revalidatePath(`/shops/${existing.shop_id}`);
  revalidatePath("/leaderboard");
  revalidatePath("/shops");
  revalidatePath("/my-reviews");

  return { success: true };
}

export async function submitReply(reviewId: string, body: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to reply." };
  }

  if (!body.trim()) {
    return { error: "Reply cannot be empty." };
  }

  // Verify the user owns the shop this review belongs to
  const { data: review } = await supabase
    .from("reviews")
    .select("shop_id, shops!inner(owner_id)")
    .eq("id", reviewId)
    .single();

  if (!review) {
    return { error: "Review not found." };
  }

  const shopData = review.shops as unknown as { owner_id: string };
  if (shopData.owner_id !== user.id) {
    return { error: "You can only reply to reviews on your own shop." };
  }

  const { error } = await supabase.from("review_replies").insert({
    review_id: reviewId,
    owner_id: user.id,
    body: body.trim(),
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You have already replied to this review." };
    }
    return { error: "Failed to submit reply. Please try again." };
  }

  revalidatePath("/owner/reviews");

  return { success: true };
}