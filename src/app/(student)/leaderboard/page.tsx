import { createClient } from "@/lib/supabase/server";
import { LeaderboardTable } from "@/components/LeaderboardTable";
import type { LeaderboardEntry } from "@/lib/types/database";
import { Trophy } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "Top rated food shops at Daffodil International University campus",
};

export default async function LeaderboardPage() {
  const supabase = await createClient();

  const { data: entries } = await supabase
    .from("leaderboard_view")
    .select("*");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="w-7 h-7 text-yellow-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Top rated shops with 5+ reviews
          </p>
        </div>
      </div>

      <LeaderboardTable entries={(entries as LeaderboardEntry[]) ?? []} />
    </div>
  );
}
