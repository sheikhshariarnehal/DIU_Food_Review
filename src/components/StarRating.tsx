"use client";

import { Star } from "lucide-react";
import { useState } from "react";
import { CoolMode } from "@/components/ui/cool-mode";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-7 h-7",
};

export function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  const starButtons = Array.from({ length: maxRating }, (_, i) => {
    const starValue = i + 1;
    const isFilled = starValue <= displayRating;

    return (
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRatingChange?.(starValue)}
        onMouseEnter={() => interactive && setHoverRating(starValue)}
        onMouseLeave={() => interactive && setHoverRating(0)}
        className={`${interactive ? "cursor-pointer hover:scale-125" : "cursor-default"} transition-all duration-200`}
      >
        <Star
          className={`${sizeMap[size]} transition-colors duration-150 ${
            isFilled
              ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.4)]"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      </button>
    );
  });

  if (interactive) {
    return (
      <CoolMode options={{ particle: "⭐", particleCount: 10, speedUp: 15, size: 12 }}>
        <div className="flex items-center gap-0.5">
          {starButtons}
        </div>
      </CoolMode>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {starButtons}
    </div>
  );
}
