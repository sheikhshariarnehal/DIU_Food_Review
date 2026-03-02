import { createClient } from "@/lib/supabase/server";
import ShopsClient from "./ShopsClient";

export default async function AdminShopsPage() {
  const supabase = await createClient();

  // Fetch all shops with owner info
  const { data: shops } = await supabase
    .from("shops")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  // Fetch approved shop owners for assignment
  const { data: approvedOwners } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "shop_owner")
    .eq("status", "active");

  return (
    <ShopsClient
      shops={(shops as any) ?? []}
      approvedOwners={approvedOwners ?? []}
    />
  );
}
