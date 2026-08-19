"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitMenuItemReview(
  menuItemId: string,
  rating: number,
  body: string,
  shopId: string
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to submit a review." };
  }

  if (rating < 1 || rating > 5) {
    return { error: "Rating must be between 1 and 5." };
  }

  // Check if user is an active student
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "student" || profile.status !== "active") {
    return { error: "Only active students can review menu items." };
  }

  // Insert review (UNIQUE constraint handles one per item per student)
  const { error } = await supabase.from("menu_item_reviews").insert({
    menu_item_id: menuItemId,
    user_id: user.id,
    rating,
    body: body.trim(),
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You have already reviewed this menu item." };
    }
    return { error: "Failed to submit review. Please try again." };
  }

  if (shopId) {
    revalidatePath(`/shops/${shopId}`);
  }
  revalidatePath("/shops");
  revalidatePath("/owner/menu");

  return { success: true };
}

export async function updateMenuItemReview(
  reviewId: string,
  rating: number,
  body: string,
  shopId: string
) {
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

  const { error } = await supabase
    .from("menu_item_reviews")
    .update({
      rating,
      body: body.trim(),
    })
    .eq("id", reviewId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to update review." };
  }

  if (shopId) {
    revalidatePath(`/shops/${shopId}`);
  }
  revalidatePath("/shops");
  revalidatePath("/owner/menu");

  return { success: true };
}

export async function deleteMenuItemReview(reviewId: string, shopId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in." };
  }

  const { error } = await supabase
    .from("menu_item_reviews")
    .delete()
    .eq("id", reviewId)
    .eq("user_id", user.id);

  if (error) {
    return { error: "Failed to delete review." };
  }

  if (shopId) {
    revalidatePath(`/shops/${shopId}`);
  }
  revalidatePath("/shops");
  revalidatePath("/owner/menu");

  return { success: true };
}

export async function getMenuItemReviews(menuItemId: string) {
  const supabase = await createClient();

  const { data: reviews, error } = await supabase
    .from("menu_item_reviews")
    .select("*, profiles(full_name, avatar_url)")
    .eq("menu_item_id", menuItemId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching menu item reviews:", error);
    return [];
  }

  return reviews ?? [];
}
