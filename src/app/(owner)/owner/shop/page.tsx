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
      <div className="mx-auto max-w-2xl py-16 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
          <Store className="h-6 w-6 text-gray-300" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">No Shop Yet</h2>
        <p className="mt-1 text-sm text-gray-500">
          You haven&apos;t created your shop yet. Go to the dashboard to set up
          your shop.
        </p>
        <Link
          href="/owner/dashboard"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return <ShopSettingsClient shop={shop} />;
}
