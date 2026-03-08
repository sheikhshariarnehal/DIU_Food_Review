import { createClient } from "@/lib/supabase/server";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import type { LeaderboardEntry } from "@/lib/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "Top rated food shops at Daffodil International University campus",
};

export const revalidate = 60; // revalidate every 60 seconds

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("leaderboard_view")
    .select("*");

  return <LeaderboardTable entries={(entries as LeaderboardEntry[]) ?? []} />;
}
