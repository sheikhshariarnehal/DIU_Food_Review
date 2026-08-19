"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showValue?: boolean;
  className?: string;
}

const sizeMap = {
  xs: "w-3.5 h-3.5",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
  xl: "w-9 h-9",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  showValue = false,
  className = "",
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;
  const currentSizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className="flex items-center gap-0.5" role={interactive ? "radiogroup" : "img"} aria-label={`Rating: ${displayRating} out of ${maxRating}`}>
        {Array.from({ length: maxRating }, (_, i) => {
          const starValue = i + 1;
          // Calculate fill percentage for this star (0% to 100%)
          const fillPercentage = interactive
            ? starValue <= displayRating
              ? 100
              : 0
            : Math.max(0, Math.min(100, (displayRating - i) * 100));

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`relative inline-block select-none ${
                interactive
                  ? "cursor-pointer hover:scale-110 transition-transform focus:outline-none"
                  : "cursor-default"
              }`}
              tabIndex={interactive ? 0 : -1}
            >
              {/* Background Empty Star */}
              <Star
                className={`${currentSizeClass} fill-gray-200 text-gray-200 transition-colors`}
              />

              {/* Foreground Filled Star with percentage width clipping */}
              {fillPercentage > 0 && (
                <div
                  className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                  style={{ width: `${fillPercentage}%` }}
                >
                  <Star
                    className={`${currentSizeClass} fill-amber-400 text-amber-400 shrink-0`}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-gray-700 ml-1">
          {displayRating > 0 ? displayRating.toFixed(1) : "—"}
        </span>
      )}
    </div>
  );
}
