"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { Store, UtensilsCrossed, Image as ImageIcon } from "lucide-react";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackType?: "store" | "food" | "general";
  fallbackClassName?: string;
}

export function SafeImage({
  src,
  alt,
  fallbackType = "general",
  fallbackClassName,
  className,
  ...props
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center bg-gray-100/80 text-gray-400 ${
          fallbackClassName ?? ""
        }`}
      >
        {fallbackType === "store" ? (
          <Store className="h-8 w-8 text-gray-300" />
        ) : fallbackType === "food" ? (
          <UtensilsCrossed className="h-8 w-8 text-gray-300" />
        ) : (
          <ImageIcon className="h-8 w-8 text-gray-300" />
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
