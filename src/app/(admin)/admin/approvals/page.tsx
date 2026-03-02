import { createClient } from "@/lib/supabase/server";
import ApprovalsClient from "./ApprovalsClient";

export default async function AdminApprovalsPage() {
  const supabase = await createClient();

  const { data: pendingOwners } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "shop_owner")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return <ApprovalsClient pendingOwners={pendingOwners ?? []} />;
}
