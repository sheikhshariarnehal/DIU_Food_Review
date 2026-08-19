import Link from "next/link";
import { StarRating } from "./StarRating";
import { SafeImage } from "./ui/SafeImage";
import { MessageSquare } from "lucide-react";
import type { ShopWithRating } from "@/lib/types/database";

interface ShopCardProps {
  shop: ShopWithRating;
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link href={`/shops/${shop.id}`} className="group block h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:border-gray-200">
        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <SafeImage
            src={shop.image_url ?? ""}
            alt={shop.name}
            fill
            fallbackType="store"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-4">
          <h3 className="truncate font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
            {shop.name}
          </h3>
          {shop.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {shop.description}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-400 italic">No description available</p>
          )}

          <div className="mt-auto pt-3 flex items-center gap-2 border-t border-gray-50">
            <StarRating rating={shop.avg_rating} size="sm" />
            <span className="text-xs font-semibold text-gray-800">
              {shop.avg_rating > 0 ? shop.avg_rating.toFixed(1) : "—"}
            </span>
            <span className="ml-auto flex items-center gap-1 text-xs text-gray-400">
              <MessageSquare className="h-3 w-3" />
              {shop.review_count}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
