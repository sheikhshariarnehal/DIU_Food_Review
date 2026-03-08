"use client";

import Image from "next/image";
import type { MenuItem } from "@/lib/types/database";
import { UtensilsCrossed, Pencil, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";

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
    <div className="bg-card rounded-xl border border-border overflow-hidden flex relative">
      {isActive && (
        <BorderBeam
          size={40}
          duration={10}
          colorFrom="#16a34a"
          colorTo="#22c55e"
          borderWidth={1}
        />
      )}
      {/* Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 shrink-0">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="96px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-6 h-6 text-gray-300" strokeWidth={1.5} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-3 py-2.5 sm:px-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-gray-900 text-sm">{item.name}</h4>
            {isActive ? (
              <Badge variant="outline" className="text-[10px] text-green-700 border-green-200 bg-green-50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-200 bg-amber-50">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Stock Out
              </Badge>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
          )}
        </div>
        <div className="flex items-center justify-between mt-2 gap-2">
          <span className="text-sm font-bold text-green-600">৳{Number(item.price).toFixed(0)}</span>
          {editable && (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onToggleStatus?.(item)}
                className="text-[11px] text-muted-foreground"
              >
                <AlertCircle className="w-3 h-3" />
                {isActive ? "Stock Out" : "Activate"}
              </Button>
              <Button variant="ghost" size="icon-xs" onClick={() => onEdit?.(item)}>
                <Pencil className="w-3 h-3 text-blue-500" />
              </Button>
              <Button variant="ghost" size="icon-xs" onClick={() => onDelete?.(item)}>
                <Trash2 className="w-3 h-3 text-red-400" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
