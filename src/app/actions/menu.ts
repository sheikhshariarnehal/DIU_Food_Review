"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMenuItem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const shopId = formData.get("shop_id") as string;
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = (formData.get("image_url") as string) || null;

  if (!name || isNaN(price)) {
    return { error: "Name and valid price are required." };
  }

  // Verify ownership
  const { data: shop } = await supabase
    .from("shops")
    .select("owner_id")
    .eq("id", shopId)
    .single();

  if (!shop || shop.owner_id !== user.id) {
    return { error: "You don't own this shop." };
  }

  const { error } = await supabase.from("menu_items").insert({
    shop_id: shopId,
    name: name.trim(),
    description: description.trim(),
    price,
    image_url: imageUrl,
    status: "active",
  });

  if (error) {
    return { error: "Failed to add menu item." };
  }

  revalidatePath("/owner/menu");
  return { success: true };
}

export async function updateMenuItem(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const itemId = formData.get("item_id") as string;
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = (formData.get("image_url") as string) || null;

  if (!name || isNaN(price)) {
    return { error: "Name and valid price are required." };
  }

  const { error } = await supabase
    .from("menu_items")
    .update({
      name: name.trim(),
      description: description.trim(),
      price,
      image_url: imageUrl,
    })
    .eq("id", itemId);

  if (error) {
    return { error: "Failed to update menu item." };
  }

  revalidatePath("/owner/menu");
  return { success: true };
}

export async function toggleMenuItemStatus(itemId: string, currentStatus: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const newStatus = currentStatus === "active" ? "stock_out" : "active";

  const { error } = await supabase
    .from("menu_items")
    .update({ status: newStatus })
    .eq("id", itemId);

  if (error) {
    return { error: "Failed to update item status." };
  }

  revalidatePath("/owner/menu");
  return { success: true };
}

export async function deleteMenuItem(itemId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated." };
  }

  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    return { error: "Failed to delete menu item." };
  }

  revalidatePath("/owner/menu");
  return { success: true };
}
