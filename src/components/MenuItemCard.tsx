import Image from "next/image";
import { StatusBadge } from "./StatusBadge";
import type { MenuItem } from "@/lib/types/database";
import { UtensilsCrossed } from "lucide-react";

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
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex">
      {/* Image */}
      <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gray-100 shrink-0">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="112px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-8 h-8 text-gray-300" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-900 text-sm truncate">
              {item.name}
            </h4>
            <StatusBadge status={item.status === "active" ? "Active" : "Stock Out"} />
          </div>
          {item.description && (
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
              {item.description}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-green-600">
            ৳{Number(item.price).toFixed(0)}
          </span>
          {editable && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleStatus?.(item)}
                className="text-xs text-gray-500 hover:text-amber-600 transition-colors"
              >
                {item.status === "active" ? "Mark Stock Out" : "Mark Active"}
              </button>
              <button
                onClick={() => onEdit?.(item)}
                className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(item)}
                className="text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
