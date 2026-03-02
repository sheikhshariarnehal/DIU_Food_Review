import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MenuClient from "./MenuClient";

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
        <p className="text-gray-500">No shop assigned to your account.</p>
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
    <div className="max-w-3xl mx-auto">
      <MenuClient shopId={shop.id} initialItems={menuItems ?? []} />
    </div>
  );
}
