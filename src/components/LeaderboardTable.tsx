"use client";

import { StarRating } from "./StarRating";
import {
  Trophy,
  Search,
  ArrowUpDown,
  Crown,
  Medal,
  Award,
  Star,
  MessageSquare,
  TrendingUp,
  Store,
} from "lucide-react";
import type { LeaderboardEntry } from "@/lib/types/database";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { ShineBorder } from "@/components/ui/shine-border";
import { NumberTicker } from "@/components/ui/number-ticker";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

type SortField = "rank" | "rating" | "reviews";
type SortDirection = "asc" | "desc";

/* ----------- Podium card for top-3 ----------- */
function PodiumCard({
  entry,
  rank,
}: {
  entry: LeaderboardEntry;
  rank: number;
}) {
  const configs: Record<
    number,
    {
      gradient: string;
      ring: string;
      badge: string;
      badgeBg: string;
      icon: React.ReactNode;
      height: string;
      shadow: string;
    }
  > = {
    1: {
      gradient: "from-yellow-50 via-amber-50 to-yellow-100",
      ring: "ring-yellow-400",
      badge: "text-yellow-700",
      badgeBg: "bg-yellow-100",
      icon: <Crown className="w-5 h-5 text-yellow-500" />,
      height: "min-h-[260px]",
      shadow: "shadow-lg shadow-yellow-200/50",
    },
    2: {
      gradient: "from-slate-50 via-gray-50 to-slate-100",
      ring: "ring-slate-300",
      badge: "text-slate-600",
      badgeBg: "bg-slate-100",
      icon: <Medal className="w-5 h-5 text-slate-400" />,
      height: "min-h-[240px]",
      shadow: "shadow-md shadow-slate-200/50",
    },
    3: {
      gradient: "from-orange-50 via-amber-50 to-orange-100",
      ring: "ring-orange-300",
      badge: "text-orange-700",
      badgeBg: "bg-orange-100",
      icon: <Award className="w-5 h-5 text-orange-400" />,
      height: "min-h-[220px]",
      shadow: "shadow-md shadow-orange-200/50",
    },
  };

  const c = configs[rank];
  const ordinals = ["", "1st", "2nd", "3rd"];

  return (
    <Link href={`/shops/${entry.shop_id}`} className="group block">
      <div
        className={`relative bg-gradient-to-b ${c.gradient} rounded-2xl border border-gray-200/60 ${c.shadow}
          p-5 flex flex-col items-center justify-center text-center transition-all
          duration-300 hover:scale-[1.03] hover:shadow-xl ${c.height}`}
      >
        {rank === 1 && (
          <ShineBorder
            shineColor={["#facc15", "#f59e0b"]}
            borderWidth={2}
            duration={10}
          />
        )}
        {/* Rank badge */}
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 ${c.badgeBg} ${c.badge}
            px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ring-2 ring-white`}
        >
          {c.icon}
          {ordinals[rank]}
        </div>

        {/* Shop image */}
        <div
          className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full ring-4 ${c.ring}
            overflow-hidden bg-white mt-4 mb-3 shrink-0`}
        >
          {entry.shop_image_url ? (
            <Image
              src={entry.shop_image_url}
              alt={entry.shop_name}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <Store className="w-7 h-7 text-gray-300" />
            </div>
          )}
        </div>

        {/* Shop name */}
        <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate max-w-full group-hover:text-green-600 transition-colors">
          {entry.shop_name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-gray-800 text-lg">
            {entry.avg_rating.toFixed(1)}
          </span>
        </div>

        {/* Review count */}
        <p className="text-xs text-gray-500 mt-1">
          {entry.review_count} {entry.review_count === 1 ? "review" : "reviews"}
        </p>
      </div>
    </Link>
  );
}

/* ----------- Stats bar ----------- */
function StatsBar({ entries }: { entries: LeaderboardEntry[] }) {
  const totalReviews = entries.reduce((s, e) => s + e.review_count, 0);
  const avgRating =
    entries.length > 0
      ? entries.reduce((s, e) => s + e.avg_rating, 0) / entries.length
      : 0;

  const stats = [
    {
      label: "Ranked Shops",
      value: entries.length,
      icon: <Store className="w-4 h-4 text-green-500" />,
    },
    {
      label: "Total Reviews",
      value: totalReviews.toLocaleString(),
      icon: <MessageSquare className="w-4 h-4 text-blue-500" />,
    },
    {
      label: "Avg Rating",
      value: avgRating.toFixed(1),
      icon: <TrendingUp className="w-4 h-4 text-amber-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 text-center relative overflow-hidden"
        >
          <div className="flex items-center justify-center gap-1.5 mb-1">
            {s.icon}
            <span className="text-lg sm:text-xl font-bold text-gray-800">
              {typeof s.value === "number" ? (
                <NumberTicker value={s.value} />
              ) : (
                s.value
              )}
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 font-medium uppercase tracking-wider">
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ----------- Main component ----------- */
export function LeaderboardTable({ entries }: LeaderboardTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("rank");
  const [sortDir, setSortDir] = useState<SortDirection>("asc");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "rank" ? "asc" : "desc");
    }
  };

  const filtered = useMemo(() => {
    let result = [...entries];

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((e) => e.shop_name.toLowerCase().includes(q));
    }

    // sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "rank":
          cmp = b.avg_rating - a.avg_rating || b.review_count - a.review_count;
          break;
        case "rating":
          cmp = a.avg_rating - b.avg_rating;
          break;
        case "reviews":
          cmp = a.review_count - b.review_count;
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [entries, search, sortField, sortDir]);

  // Top 3 from the original ranking (unfiltered) for podium display
  const top3 = entries.slice(0, 3);
  const showPodium = !search.trim() && sortField === "rank" && sortDir === "asc";

  /* ---- Empty state ---- */
  if (entries.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-sm text-gray-500">Shop rankings by customer ratings</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-semibold text-gray-700 mb-1">
            No rankings yet
          </h3>
          <p className="text-sm text-gray-400 max-w-sm mx-auto">
            Shops need at least 5 reviews to appear on the leaderboard. Start
            reviewing your favorite shops!
          </p>
          <Link
            href="/shops"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-green-600 text-white text-sm
              font-medium rounded-xl hover:bg-green-700 transition-colors"
          >
            <Store className="w-4 h-4" /> Browse Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md shadow-yellow-200/50">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-sm text-gray-500">
              Top rated shops with 5+ reviews
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm
              text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2
              focus:ring-green-500/20 focus:border-green-500 transition-all"
          />
        </div>
      </div>

      {/* Stats */}
      <StatsBar entries={entries} />

      {/* Podium — only when default rank order with no search */}
      {showPodium && top3.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4 items-end">
          {/* 2nd place on the left */}
          <div className="pt-6">
            <PodiumCard entry={top3[1]} rank={2} />
          </div>
          {/* 1st place in centre, slightly raised */}
          <div>
            <PodiumCard entry={top3[0]} rank={1} />
          </div>
          {/* 3rd on the right */}
          <div className="pt-10">
            <PodiumCard entry={top3[2]} rank={3} />
          </div>
        </div>
      )}

      {/* Full rankings table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Table header with sort controls */}
        <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
          <h2 className="text-sm font-semibold text-gray-700">
            Full Rankings
            {search.trim() && (
              <span className="ml-2 text-gray-400 font-normal">
                — {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-1">
            <SortButton
              active={sortField === "rank"}
              dir={sortField === "rank" ? sortDir : undefined}
              onClick={() => toggleSort("rank")}
              label="Rank"
            />
            <SortButton
              active={sortField === "rating"}
              dir={sortField === "rating" ? sortDir : undefined}
              onClick={() => toggleSort("rating")}
              label="Rating"
            />
            <SortButton
              active={sortField === "reviews"}
              dir={sortField === "reviews" ? sortDir : undefined}
              onClick={() => toggleSort("reviews")}
              label="Reviews"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <Search className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              No shops match &quot;{search}&quot;
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden sm:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-16">
                      #
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      Shop
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-44">
                      Rating
                    </th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wider w-28">
                      Reviews
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((entry, index) => {
                    // For rank numbers: in default rank mode use the original entries index
                    const rank =
                      sortField === "rank" && sortDir === "asc"
                        ? entries.indexOf(entry) + 1
                        : index + 1;
                    return (
                      <tr
                        key={entry.shop_id}
                        className="group hover:bg-green-50/40 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <RankBadge rank={rank} />
                        </td>
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/shops/${entry.shop_id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-200">
                              {entry.shop_image_url ? (
                                <Image
                                  src={entry.shop_image_url}
                                  alt={entry.shop_name}
                                  fill
                                  className="object-cover"
                                  sizes="36px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Store className="w-4 h-4 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <span className="font-medium text-gray-900 group-hover:text-green-600 transition-colors truncate">
                              {entry.shop_name}
                            </span>
                          </Link>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <StarRating
                              rating={Math.round(entry.avg_rating)}
                              size="sm"
                            />
                            <span className="text-sm font-semibold text-gray-700">
                              {entry.avg_rating.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {entry.review_count}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile List */}
            <div className="sm:hidden divide-y divide-gray-50">
              {filtered.map((entry, index) => {
                const rank =
                  sortField === "rank" && sortDir === "asc"
                    ? entries.indexOf(entry) + 1
                    : index + 1;
                return (
                  <Link
                    key={entry.shop_id}
                    href={`/shops/${entry.shop_id}`}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-green-50/40 transition-colors active:bg-green-50"
                  >
                    <RankBadge rank={rank} />
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-200">
                      {entry.shop_image_url ? (
                        <Image
                          src={entry.shop_image_url}
                          alt={entry.shop_name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Store className="w-4 h-4 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm">
                        {entry.shop_name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StarRating
                          rating={Math.round(entry.avg_rating)}
                          size="sm"
                        />
                        <span className="text-xs font-medium text-gray-600">
                          {entry.avg_rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {entry.review_count}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ----------- Rank badge helper ----------- */
function RankBadge({ rank }: { rank: number }) {
  const styles: Record<number, string> = {
    1: "bg-amber-50 border border-amber-200 text-amber-600 shadow-sm",
    2: "bg-slate-50 border border-slate-200 text-slate-600 shadow-sm",
    3: "bg-orange-50 border border-orange-200 text-orange-600 shadow-sm",
  };
  const style =
    styles[rank] ?? "bg-gray-50 border border-gray-200 text-gray-500 shadow-sm";

  return (
    <div
      className={`w-7 h-7 rounded flex items-center justify-center text-[11px] font-bold shrink-0 ${style}`}
    >
      {rank}
    </div>
  );
}

/* ----------- Sort button helper ----------- */
function SortButton({
  active,
  dir,
  onClick,
  label,
}: {
  active: boolean;
  dir?: SortDirection;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors
        ${
          active
            ? "bg-green-100 text-green-700"
            : "text-gray-500 hover:bg-gray-100"
        }`}
    >
      {label}
      <ArrowUpDown
        className={`w-3 h-3 ${
          active ? "text-green-600" : "text-gray-400"
        } ${active && dir === "desc" ? "rotate-180" : ""} transition-transform`}
      />
    </button>
  );
}
