import Image from "next/image";
import { StatusBadge } from "./StatusBadge";
import type { MenuItem } from "@/lib/types/database";
import { UtensilsCrossed, Edit2, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  return (
    <Card className="rounded-xl border-zinc-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col bg-white">
      {/* Image */}
      <div className="relative w-full pt-[60%] sm:pt-[56%] bg-zinc-50 border-b border-zinc-100 shrink-0 overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <UtensilsCrossed className="w-10 h-10 text-zinc-300 group-hover:text-zinc-400 transition-colors" />
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-bold text-zinc-900 text-base line-clamp-1">
              {item.name}
            </h4>
            <StatusBadge status={item.status === "active" ? "Active" : "Stock Out"} />
          </div>
          {item.description && (
            <p className="text-sm text-zinc-500 line-clamp-2 mt-1">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-5 pt-4 border-t border-zinc-100">
          <span className="text-lg font-bold text-emerald-600">
            ৳{Number(item.price).toFixed(0)}
          </span>
          {editable && (
            <div className="flex items-center gap-1.5 -mr-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleStatus?.(item)}
                className={`w-8 h-8 rounded-full ${item.status === "active" ? "text-amber-500 hover:text-amber-600 hover:bg-amber-50" : "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"}`}
                title={item.status === "active" ? "Mark Stock Out" : "Mark Active"}
              >
                {item.status === "active" ? <Archive className="w-4 h-4" /> : <ArchiveRestore className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(item)}
                className="w-8 h-8 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                title="Edit Item"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete?.(item)}
                className="w-8 h-8 rounded-full text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                title="Delete Item"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
