"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createOwnShop(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  // Verify user is an approved shop_owner
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "shop_owner" || profile.status !== "active") {
    return { error: "Only approved shop owners can create a shop." };
  }

  // Check if owner already has a shop
  const { data: existingShop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (existingShop) {
    return { error: "You already have a shop." };
  }

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const imageUrl = (formData.get("image_url") as string) || null;

  if (!name || name.trim().length < 2) {
    return { error: "Shop name is required (at least 2 characters)." };
  }

  const { data: insertedShop, error } = await supabase.from("shops").insert({
    owner_id: user.id,
    name: name.trim(),
    description: description.trim(),
    image_url: imageUrl,
    is_active: true,
  }).select().single();

  if (error) {
    return { error: "Failed to create shop. Please try again." };
  }

  revalidatePath("/owner/dashboard");
  revalidatePath("/owner/menu");
  revalidatePath("/owner/shop");
  return { success: true };
}

export async function updateOwnShop(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  // Get owner's shop
  const { data: shop } = await supabase
    .from("shops")
    .select("id, owner_id")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    return { error: "No shop found." };
  }

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const imageUrl = (formData.get("image_url") as string) || null;

  if (!name || name.trim().length < 2) {
    return { error: "Shop name is required (at least 2 characters)." };
  }

  const { error } = await supabase
    .from("shops")
    .update({
      name: name.trim(),
      description: description.trim(),
      image_url: imageUrl,
    })
    .eq("id", shop.id);

  if (error) {
    console.error("Shop update error:", error);
    return { error: "Failed to update shop." };
  }

  revalidatePath("/owner/dashboard");
  revalidatePath("/owner/shop");
  return { success: true };
}
