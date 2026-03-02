"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ─── Admin Guard ────────────────────────────────────────────
async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated.", user: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "super_admin") {
    return { error: "Unauthorized. Admin access required.", user: null };
  }

  return { error: null, user };
}

// ─── Approval Actions ───────────────────────────────────────
export async function approveShopOwner(profileId: string) {
  const { error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("profiles")
    .update({ status: "active" })
    .eq("id", profileId)
    .eq("role", "shop_owner");

  if (error) {
    return { error: "Failed to approve shop owner." };
  }

  revalidatePath("/admin/approvals");
  return { success: true };
}

export async function rejectShopOwner(profileId: string) {
  const { error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("profiles")
    .update({ status: "suspended" })
    .eq("id", profileId)
    .eq("role", "shop_owner");

  if (error) {
    return { error: "Failed to reject shop owner." };
  }

  revalidatePath("/admin/approvals");
  return { success: true };
}

// ─── Shop Management ────────────────────────────────────────
export async function createShop(formData: FormData) {
  const { error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createServiceClient();

  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const ownerId = formData.get("owner_id") as string;
  const imageUrl = (formData.get("image_url") as string) || null;

  if (!name || !ownerId) {
    return { error: "Shop name and owner are required." };
  }

  const { error } = await supabase.from("shops").insert({
    name: name.trim(),
    description: description.trim(),
    owner_id: ownerId,
    image_url: imageUrl,
    is_active: true,
  });

  if (error) {
    return { error: "Failed to create shop." };
  }

  revalidatePath("/admin/shops");
  return { success: true };
}

export async function updateShop(formData: FormData) {
  const { error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createServiceClient();

  const shopId = formData.get("shop_id") as string;
  const name = formData.get("name") as string;
  const description = (formData.get("description") as string) || "";
  const isActive = formData.get("is_active") === "true";
  const imageUrl = (formData.get("image_url") as string) || null;

  const { error } = await supabase
    .from("shops")
    .update({
      name: name.trim(),
      description: description.trim(),
      is_active: isActive,
      image_url: imageUrl,
    })
    .eq("id", shopId);

  if (error) {
    return { error: "Failed to update shop." };
  }

  revalidatePath("/admin/shops");
  return { success: true };
}

export async function deleteShop(shopId: string) {
  const { error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createServiceClient();

  const { error } = await supabase.from("shops").delete().eq("id", shopId);

  if (error) {
    return { error: "Failed to delete shop." };
  }

  revalidatePath("/admin/shops");
  return { success: true };
}

// ─── User Management ────────────────────────────────────────
export async function updateUserStatus(userId: string, status: string) {
  const { error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  const supabase = await createServiceClient();

  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", userId);

  if (error) {
    return { error: "Failed to update user status." };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
