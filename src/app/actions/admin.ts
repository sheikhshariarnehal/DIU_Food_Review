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

// ─── Shop Owner Invitation Action ───────────────────────────
export async function inviteShopOwner(email: string, fullName: string) {
  const { error: authError } = await requireAdmin();
  if (authError) return { error: authError };

  if (!email || !email.includes("@")) {
    return { error: "A valid email is required." };
  }

  const supabase = await createServiceClient();

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName.trim() || "Shop Owner";

  // Check if profile with email already exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, role, status")
    .eq("email", cleanEmail)
    .maybeSingle();

  if (existingProfile) {
    if (existingProfile.role === "shop_owner") {
      if (existingProfile.status === "pending") {
        await supabase
          .from("profiles")
          .update({ status: "active" })
          .eq("id", existingProfile.id);
        revalidatePath("/admin/approvals");
        revalidatePath("/admin/users");
        return { success: true, message: `Approved and activated shop owner ${cleanEmail}` };
      }
      return { error: `Shop owner account already exists for ${cleanEmail}` };
    }
    return { error: `An account already exists for ${cleanEmail}` };
  }

  // Invite user via Supabase Auth Admin API
  const { data: inviteData, error: inviteError } =
    await supabase.auth.admin.inviteUserByEmail(cleanEmail, {
      data: {
        full_name: cleanName,
        role: "shop_owner",
      },
    });

  if (inviteError) {
    return { error: inviteError.message || "Failed to invite shop owner." };
  }

  if (inviteData?.user) {
    await supabase
      .from("profiles")
      .update({
        status: "active",
        full_name: cleanName,
        role: "shop_owner",
      })
      .eq("id", inviteData.user.id);
  }

  revalidatePath("/admin/shops");
  revalidatePath("/admin/users");
  revalidatePath("/admin/approvals");

  return { success: true, message: `Invitation sent successfully to ${cleanEmail}` };
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
