import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ShopSettingsClient from "./ShopSettingsClient";
import { Store } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
      <div className="max-w-md mx-auto py-12 px-4 sm:px-0">
        <Card className="text-center">
          <CardHeader className="items-center pb-2">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-1">
              <Store className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            </div>
            <CardTitle>No Shop Yet</CardTitle>
            <CardDescription>
              Head to the dashboard to create your shop and start receiving reviews.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/owner/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <ShopSettingsClient shop={shop} />;
}
