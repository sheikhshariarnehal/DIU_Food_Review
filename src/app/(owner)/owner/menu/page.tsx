import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MenuClient from "./MenuClient";
import { Store } from "lucide-react";
import Link from "next/link";
import type { MenuItemWithRating } from "@/lib/types/database";

export default async function OwnerMenuPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get owner's shop
  const { data: shop } = await supabase
    .from("shops")
    .select("id")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No Shop Yet
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Create your shop first to start managing your menu.
        </p>
        <Link
          href="/owner/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Create Shop
        </Link>
      </div>
    );
  }

  // Get menu items with review ratings
  const { data: menuItemsRaw } = await supabase
    .from("menu_items")
    .select("*, menu_item_reviews(rating)")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: true });

  const menuItems: MenuItemWithRating[] = (menuItemsRaw || []).map((item: any) => {
    const itemReviews = Array.isArray(item.menu_item_reviews)
      ? item.menu_item_reviews
      : item.menu_item_reviews
      ? [item.menu_item_reviews]
      : [];
    const count = itemReviews.length;
    const total = itemReviews.reduce(
      (sum: number, r: { rating: number }) => sum + (r.rating || 0),
      0
    );
    return {
      ...item,
      avg_rating: count > 0 ? Number((total / count).toFixed(2)) : 0,
      review_count: count,
    };
  });

  return (
    <div className="w-full pb-12">
      <MenuClient shopId={shop.id} initialItems={menuItems ?? []} />
    </div>
  );
}
