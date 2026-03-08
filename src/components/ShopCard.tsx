"use client";

import Image from "next/image";
import Link from "next/link";
import { StarRating } from "./StarRating";
import { MapPin } from "lucide-react";
import type { ShopWithRating } from "@/lib/types/database";
import { MagicCard } from "@/components/ui/magic-card";

interface ShopCardProps {
  shop: ShopWithRating;
}

export function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link href={`/shops/${shop.id}`}>
      <MagicCard
        className="rounded-xl"
        gradientColor="#dcfce7"
        gradientFrom="#16a34a"
        gradientTo="#22c55e"
        gradientOpacity={0.12}
      >
        {/* Image */}
        <div className="relative w-full h-40 bg-gray-100">
          {shop.image_url ? (
            <Image
              src={shop.image_url}
              alt={shop.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MapPin className="w-10 h-10 text-gray-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 truncate">{shop.name}</h3>
          {shop.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {shop.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <StarRating rating={Math.round(shop.avg_rating)} size="sm" />
            <span className="text-sm font-medium text-gray-700">
              {shop.avg_rating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-400">
              ({shop.review_count} {shop.review_count === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
      </MagicCard>
    </Link>
  );
}
