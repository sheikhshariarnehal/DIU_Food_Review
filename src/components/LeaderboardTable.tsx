import { StarRating } from "./StarRating";
import { Trophy } from "lucide-react";
import type { LeaderboardEntry } from "@/lib/types/database";
import Link from "next/link";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <Trophy className="w-10 h-10 text-gray-300 mx-auto mb-2" />
        <p className="text-sm text-gray-500">
          No shops have enough reviews yet to be ranked.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Shops need at least 5 reviews to appear on the leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                Rank
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Shop
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">
                Rating
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                Reviews
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {entries.map((entry, index) => (
              <tr key={entry.shop_id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : index === 1
                        ? "bg-gray-100 text-gray-600"
                        : index === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/shops/${entry.shop_id}`}
                    className="font-medium text-gray-900 hover:text-green-600 transition-colors"
                  >
                    {entry.shop_name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(entry.avg_rating)} size="sm" />
                    <span className="text-sm font-medium text-gray-700">
                      {entry.avg_rating.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">
                  {entry.review_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile List */}
      <div className="sm:hidden divide-y divide-gray-100">
        {entries.map((entry, index) => (
          <Link
            key={entry.shop_id}
            href={`/shops/${entry.shop_id}`}
            className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                index === 0
                  ? "bg-yellow-100 text-yellow-700"
                  : index === 1
                  ? "bg-gray-100 text-gray-600"
                  : index === 2
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-50 text-gray-500"
              }`}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{entry.shop_name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={Math.round(entry.avg_rating)} size="sm" />
                <span className="text-xs text-gray-500">
                  {entry.avg_rating.toFixed(1)} ({entry.review_count})
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
