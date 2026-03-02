import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ShopSettingsClient from "./ShopSettingsClient";
import { Store } from "lucide-react";
import Link from "next/link";

export default async function OwnerShopPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Get owner's shop
  const { data: shop } = await supabase
    .from("shops")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!shop) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No Shop Yet
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          You haven&apos;t created your shop yet. Go to the dashboard to set up your shop.
        </p>
        <Link
          href="/owner/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return <ShopSettingsClient shop={shop} />;
}
