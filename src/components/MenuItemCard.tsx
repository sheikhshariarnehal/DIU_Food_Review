"use client";

import { useState } from "react";
import type { MenuItemWithRating } from "@/lib/types/database";
import { StarRating } from "./StarRating";
import { SafeImage } from "./ui/SafeImage";
import { MenuItemReviewModal } from "./MenuItemReviewModal";
import {
  UtensilsCrossed,
  Pencil,
  Archive,
  ArchiveRestore,
  Trash2,
  Star,
  MessageSquare,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuItemCardProps {
  item: MenuItemWithRating;
  editable?: boolean;
  onEdit?: (item: MenuItemWithRating) => void;
  onToggleStatus?: (item: MenuItemWithRating) => void;
  onDelete?: (item: MenuItemWithRating) => void;
  currentUserId?: string | null;
  isStudent?: boolean;
  onReviewSubmitted?: () => void;
}

export function MenuItemCard({
  item,
  editable = false,
  onEdit,
  onToggleStatus,
  onDelete,
  currentUserId,
  isStudent = false,
  onReviewSubmitted,
}: MenuItemCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isActive = item.status === "active";
  const avgRating = item.avg_rating ?? 0;
  const reviewCount = item.review_count ?? 0;

  return (
    <>
      <Card className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white pt-0 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300">
        {/* Image */}
        <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden bg-zinc-100">
          <SafeImage
            src={item.image_url ?? ""}
            alt={item.name}
            fill
            fallbackType="food"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          {/* Status pill overlay */}
          <div className="absolute top-2.5 right-2.5">
            <Badge
              className={
                isActive
                  ? "bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 shadow-sm"
                  : "bg-amber-500 text-white text-[10px] font-semibold px-2 py-0.5 shadow-sm"
              }
            >
              {isActive ? "Available" : "Stock Out"}
            </Badge>
          </div>

          {/* Rating badge overlay */}
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-black/80 hover:scale-105"
          >
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{avgRating > 0 ? avgRating.toFixed(1) : "New"}</span>
            {reviewCount > 0 && (
              <span className="text-[10px] text-zinc-300 font-normal">
                ({reviewCount})
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <CardContent className="flex flex-1 flex-col p-4">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-bold text-zinc-900 text-base line-clamp-1">
                {item.name}
              </h4>
            </div>

            {item.description ? (
              <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            ) : (
              <p className="mt-1 text-xs text-zinc-300 italic">No description provided</p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3">
            <span className="text-lg font-black text-zinc-900">
              ৳{Number(item.price).toFixed(0)}
            </span>

            {editable ? (
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger
                    onClick={() => onToggleStatus?.(item)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? "text-amber-500 hover:bg-amber-50 hover:text-amber-700"
                        : "text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
                    }`}
                  >
                    {isActive ? (
                      <Archive className="h-3.5 w-3.5" />
                    ) : (
                      <ArchiveRestore className="h-3.5 w-3.5" />
                    )}
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    {isActive ? "Mark stock out" : "Mark available"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    onClick={() => onEdit?.(item)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 cursor-pointer"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Edit item
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger
                    onClick={() => onDelete?.(item)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-rose-50 hover:text-rose-600 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    Delete item
                  </TooltipContent>
                </Tooltip>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-50 px-2.5 py-1.5 text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 hover:text-zinc-900"
              >
                <MessageSquare className="h-3 w-3 text-zinc-400" />
                {reviewCount > 0 ? `${reviewCount} Reviews` : "Review Dish"}
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Item Review & Rating Modal */}
      <MenuItemReviewModal
        item={item}
        open={modalOpen}
        onOpenChange={setModalOpen}
        currentUserId={currentUserId}
        isStudent={isStudent}
        onReviewSubmitted={onReviewSubmitted}
      />
    </>
  );
}
