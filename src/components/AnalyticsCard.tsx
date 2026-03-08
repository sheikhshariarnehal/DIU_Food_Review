"use client";

import type { LucideIcon } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { MagicCard } from "@/components/ui/magic-card";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function AnalyticsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: AnalyticsCardProps) {
  const numericValue = typeof value === "number" ? value : parseFloat(value);
  const isNumeric = !isNaN(numericValue) && typeof value === "number";

  return (
    <MagicCard
      className="rounded-xl"
      gradientColor="#dcfce7"
      gradientFrom="#16a34a"
      gradientTo="#22c55e"
      gradientOpacity={0.1}
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {isNumeric ? (
                <NumberTicker value={numericValue} />
              ) : (
                value
              )}
            </p>
            {description && (
              <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            )}
            {trend && (
              <p
                className={`text-xs font-medium mt-1 ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}% from last month
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <Icon className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
    </MagicCard>
  );
}
