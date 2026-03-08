import Image from "next/image";
import Link from "next/link";
import { StarRating } from "./StarRating";
import { Store, MessageSquare } from "lucide-react";
import type { ShopWithRating } from "@/lib/types/database";

interface ShopCardProps {
  shop: ShopWithRating;
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link href={`/shops/${shop.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
        {/* Image */}
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          {shop.image_url ? (
            <Image
              src={shop.image_url}
              alt={shop.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Store className="h-10 w-10 text-gray-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="truncate font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
            {shop.name}
          </h3>
          {shop.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-400">
              {shop.description}
            </p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={Math.round(shop.avg_rating)} size="sm" />
            <span className="text-sm font-medium text-gray-900">
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
