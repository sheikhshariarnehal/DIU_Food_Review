"use client";

import { useState, useMemo } from "react";
import { ShopCard } from "./ShopCard";
import type { ShopWithRating } from "@/lib/types/database";
import { Search, X, SlidersHorizontal, Store, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ShopWithMenuItems extends ShopWithRating {
  menuItemNames?: string[];
}

interface StudentShopSearchProps {
  shops: ShopWithMenuItems[];
}

type SortOption = "all" | "top_rated" | "most_reviewed" | "alphabetical" | "newest";

export function StudentShopSearch({ shops }: StudentShopSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSort, setActiveSort] = useState<SortOption>("all");

  const filteredShops = useMemo(() => {
    let list = shops.filter((shop) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchName = shop.name.toLowerCase().includes(q);
      const matchDesc = (shop.description || "").toLowerCase().includes(q);
      const matchMenu = shop.menuItemNames?.some((name) =>
        name.toLowerCase().includes(q)
      );
      return matchName || matchDesc || matchMenu;
    });

    switch (activeSort) {
      case "top_rated":
        list.sort((a, b) => b.avg_rating - a.avg_rating || b.review_count - a.review_count);
        break;
      case "most_reviewed":
        list.sort((a, b) => b.review_count - a.review_count || b.avg_rating - a.avg_rating);
        break;
      case "alphabetical":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      default:
        // Default: Keep original order
        break;
    }

    return list;
  }, [shops, searchQuery, activeSort]);

  const sortTabs: { id: SortOption; label: string }[] = [
    { id: "all", label: "All Shops" },
    { id: "top_rated", label: "⭐ Top Rated" },
    { id: "most_reviewed", label: "💬 Most Reviewed" },
    { id: "newest", label: "✨ Newest" },
    { id: "alphabetical", label: "A - Z" },
  ];

  return (
    <div className="space-y-5">
      {/* ── Search Bar & Filter Controls ── */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search shops by name, food items (e.g. burger, biryani, tea)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 rounded-xl border-gray-200 bg-gray-50/70 pl-10 pr-9 text-sm shadow-none transition-colors focus-visible:bg-white focus-visible:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {sortTabs.map((tab) => {
            const isActive = activeSort === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSort(tab.id)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header / Count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-medium text-gray-500">
          Showing <span className="font-bold text-gray-900">{filteredShops.length}</span>{" "}
          {filteredShops.length === 1 ? "shop" : "shops"}
          {searchQuery ? ` matching "${searchQuery}"` : ""}
        </p>
        {(searchQuery || activeSort !== "all") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveSort("all");
            }}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* ── Shops Grid / Empty State ── */}
      {filteredShops.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
            <Store className="h-7 w-7 text-gray-300" />
          </div>
          <p className="text-base font-bold text-gray-900">No matching food shops found</p>
          <p className="mt-1 text-xs text-gray-400">
            {searchQuery
              ? `No shops or menu items match "${searchQuery}". Try a different keyword.`
              : "No shops available under the selected filter."}
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveSort("all");
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-gray-800 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </div>
  );
}
