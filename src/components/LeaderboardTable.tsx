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
    }
  > = {
    1: {
      gradient: "from-amber-50/80 to-yellow-50",
      ring: "ring-amber-300",
      badge: "text-amber-700",
      badgeBg: "bg-amber-50",
      icon: <Crown className="h-4 w-4 text-amber-500" />,
      height: "min-h-[260px]",
    },
    2: {
      gradient: "from-gray-50 to-slate-50",
      ring: "ring-gray-300",
      badge: "text-gray-600",
      badgeBg: "bg-gray-100",
      icon: <Medal className="h-4 w-4 text-gray-400" />,
      height: "min-h-[240px]",
    },
    3: {
      gradient: "from-orange-50/80 to-amber-50",
      ring: "ring-orange-200",
      badge: "text-orange-700",
      badgeBg: "bg-orange-50",
      icon: <Award className="h-4 w-4 text-orange-400" />,
      height: "min-h-[220px]",
    },
  };

  const c = configs[rank];
  const ordinals = ["", "1st", "2nd", "3rd"];

  return (
    <Link href={`/shops/${entry.shop_id}`} className="group block">
      <div
        className={`relative flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-gradient-to-b ${c.gradient} p-5 text-center shadow-sm transition-all duration-300 hover:shadow-md ${c.height}`}
      >
        {/* Rank badge */}
        <div
          className={`absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full ${c.badgeBg} ${c.badge} px-3 py-1 text-xs font-bold ring-2 ring-white`}
        >
          {c.icon}
          {ordinals[rank]}
        </div>

        {/* Shop image */}
        <div
          className={`relative mb-3 mt-4 h-16 w-16 shrink-0 overflow-hidden rounded-full ring-4 ${c.ring} bg-white shadow-sm sm:h-20 sm:w-20`}
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
            <div className="flex h-full w-full items-center justify-center bg-gray-50">
              <Store className="h-7 w-7 text-gray-300" />
            </div>
          )}
        </div>

        {/* Shop name */}
        <h3 className="max-w-full truncate text-sm font-bold text-gray-900 transition-colors group-hover:text-emerald-600 sm:text-base">
          {entry.shop_name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-lg font-bold text-gray-900">
            {entry.avg_rating.toFixed(1)}
          </span>
        </div>

        {/* Review count */}
        <p className="mt-1 text-xs text-gray-400">
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
      iconBg: "bg-emerald-50 text-emerald-600",
      icon: <Store className="h-4 w-4" />,
    },
    {
      label: "Total Reviews",
      value: totalReviews.toLocaleString(),
      iconBg: "bg-blue-50 text-blue-600",
      icon: <MessageSquare className="h-4 w-4" />,
    },
    {
      label: "Avg Rating",
      value: avgRating.toFixed(1),
      iconBg: "bg-amber-50 text-amber-600",
      icon: <TrendingUp className="h-4 w-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4"
        >
          <div className="flex items-center justify-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${s.iconBg}`}
            >
              {s.icon}
            </div>
            <span className="text-lg font-bold text-gray-900 sm:text-xl">
              {s.value}
            </span>
          </div>
          <p className="mt-1 text-center text-[10px] font-medium uppercase tracking-wider text-gray-400 sm:text-xs">
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
      <div className="w-full">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Leaderboard
            </h1>
            <p className="text-sm text-gray-500">
              Shop rankings by customer ratings
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
            <Trophy className="h-7 w-7 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900">No rankings yet</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
            Shops need at least 5 reviews to appear on the leaderboard. Start
            reviewing your favorite shops!
          </p>
          <Link
            href="/shops"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <Store className="h-4 w-4" /> Browse Shops
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-sm">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Leaderboard
            </h1>
            <p className="text-sm text-gray-500">
              Top rated shops with 5+ reviews
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-gray-300 focus:ring-1 focus:ring-gray-300"
          />
        </div>
      </div>

      {/* Stats */}
      <StatsBar entries={entries} />

      {/* Podium — only when default rank order with no search */}
      {showPodium && top3.length >= 3 && (
        <div className="grid grid-cols-3 items-end gap-3 sm:gap-4">
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
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Table header with sort controls */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-4 py-3 sm:px-5">
          <h2 className="text-sm font-bold text-gray-900">
            Full Rankings
            {search.trim() && (
              <span className="ml-2 font-normal text-gray-400">
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
            <Search className="mx-auto mb-2 h-8 w-8 text-gray-300" />
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
                  <tr className="border-b border-gray-50">
                    <th className="w-16 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      #
                    </th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Shop
                    </th>
                    <th className="w-44 px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Rating
                    </th>
                    <th className="w-28 px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      Reviews
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((entry, index) => {
                    const rank =
                      sortField === "rank" && sortDir === "asc"
                        ? entries.indexOf(entry) + 1
                        : index + 1;
                    return (
                      <tr
                        key={entry.shop_id}
                        className="group transition-colors hover:bg-emerald-50/40"
                      >
                        <td className="px-5 py-3.5">
                          <RankBadge rank={rank} />
                        </td>
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/shops/${entry.shop_id}`}
                            className="flex items-center gap-3"
                          >
                            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm ring-1 ring-white">
                              {entry.shop_image_url ? (
                                <Image
                                  src={entry.shop_image_url}
                                  alt={entry.shop_name}
                                  fill
                                  className="object-cover"
                                  sizes="36px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <Store className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <span className="truncate font-medium text-gray-900 transition-colors group-hover:text-emerald-600">
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
                            <span className="text-sm font-medium text-gray-900">
                              {entry.avg_rating.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                            <MessageSquare className="h-3.5 w-3.5" />
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
            <div className="divide-y divide-gray-50 sm:hidden">
              {filtered.map((entry, index) => {
                const rank =
                  sortField === "rank" && sortDir === "asc"
                    ? entries.indexOf(entry) + 1
                    : index + 1;
                return (
                  <Link
                    key={entry.shop_id}
                    href={`/shops/${entry.shop_id}`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-emerald-50/40 active:bg-emerald-50"
                  >
                    <RankBadge rank={rank} />
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm ring-1 ring-white">
                      {entry.shop_image_url ? (
                        <Image
                          src={entry.shop_image_url}
                          alt={entry.shop_name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Store className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {entry.shop_name}
                      </p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <StarRating
                          rating={Math.round(entry.avg_rating)}
                          size="sm"
                        />
                        <span className="text-xs font-medium text-gray-500">
                          {entry.avg_rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <MessageSquare className="h-3 w-3" />
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
    1: "bg-amber-50 text-amber-700",
    2: "bg-gray-100 text-gray-600",
    3: "bg-orange-50 text-orange-600",
  };
  const style = styles[rank] ?? "bg-gray-50 text-gray-500";

  return (
    <div
      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${style}`}
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
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active
          ? "bg-emerald-100 text-emerald-700"
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      {label}
      <ArrowUpDown
        className={`h-3 w-3 transition-transform ${
          active ? "text-emerald-600" : "text-gray-400"
        } ${active && dir === "desc" ? "rotate-180" : ""}`}
      />
    </button>
  );
}
