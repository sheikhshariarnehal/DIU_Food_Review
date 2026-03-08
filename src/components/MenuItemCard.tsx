import Image from "next/image";
import type { MenuItem } from "@/lib/types/database";
import { UtensilsCrossed, Pencil, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MenuItemCardProps {
  item: MenuItem;
  editable?: boolean;
  onEdit?: (item: MenuItem) => void;
  onToggleStatus?: (item: MenuItem) => void;
  onDelete?: (item: MenuItem) => void;
}

export function MenuItemCard({
  item,
  editable = false,
  onEdit,
  onToggleStatus,
  onDelete,
}: MenuItemCardProps) {
  const isActive = item.status === "active";

  return (
    <Card className="group rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col pt-0">
      {/* Image */}
      <div className="relative w-full aspect-[16/9] bg-zinc-100 overflow-hidden shrink-0">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-50">
            <UtensilsCrossed className="w-9 h-9 text-zinc-300" />
          </div>
        )}
        {/* Status pill overlay */}
        <div className="absolute top-2.5 right-2.5">
          <Badge
            className={
              isActive
                ? "bg-emerald-500 hover:bg-emerald-500 text-white text-[11px] font-semibold px-2 py-0.5 shadow-sm"
                : "bg-amber-400 hover:bg-amber-400 text-white text-[11px] font-semibold px-2 py-0.5 shadow-sm"
            }
          >
            {isActive ? "Active" : "Stock Out"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <h4 className="font-bold text-zinc-900 text-base line-clamp-1 mb-0.5">
            {item.name}
          </h4>
          {item.description ? (
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          ) : (
            <p className="text-xs text-zinc-300 italic">No description</p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100">
          <span className="text-lg font-extrabold text-zinc-900">
            ৳{Number(item.price).toFixed(0)}
          </span>

          {editable && (
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  onClick={() => onToggleStatus?.(item)}
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? "text-amber-500 hover:text-amber-700 hover:bg-amber-50"
                      : "text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50"
                  }`}
                >
                  {isActive ? (
                    <Archive className="w-3.5 h-3.5" />
                  ) : (
                    <ArchiveRestore className="w-3.5 h-3.5" />
                  )}
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {isActive ? "Mark as stock out" : "Mark as active"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  onClick={() => onEdit?.(item)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Edit item
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  onClick={() => onDelete?.(item)}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors cursor-pointer text-zinc-400 hover:text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  Delete item
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

