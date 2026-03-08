import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MenuClient from "./MenuClient";
import { Store } from "lucide-react";
import Link from "next/link";

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
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Create Shop
        </Link>
      </div>
    );
  }

  // Get menu items
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("*")
    .eq("shop_id", shop.id)
    .order("created_at", { ascending: true });

  return (
    <div className="w-full max-w-6xl mx-auto pb-12">
      <MenuClient shopId={shop.id} initialItems={menuItems ?? []} />
    </div>
  );
}
