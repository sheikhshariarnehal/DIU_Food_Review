"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  priority?: boolean;
}

const sizeMap = {
  sm: { px: 24, className: "w-6 h-6" },
  md: { px: 32, className: "w-8 h-8" },
  lg: { px: 40, className: "w-10 h-10" },
  xl: { px: 48, className: "w-12 h-12" },
  "2xl": { px: 64, className: "w-16 h-16" },
};

export function BrandLogo({
  size = "md",
  className,
  priority = false,
}: BrandLogoProps) {
  const { px, className: sizeClass } = sizeMap[size];

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl shadow-2xs select-none",
        sizeClass,
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="DIU Food Review"
        width={px}
        height={px}
        priority={priority}
        className="h-full w-full object-contain"
      />
    </div>
  );
}
