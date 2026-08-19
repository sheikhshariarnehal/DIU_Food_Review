"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./Sidebar";
import {
  LayoutDashboard,
  Trophy,
  MessageSquare,
  UtensilsCrossed,
  Store,
  Users,
  ClipboardCheck,
} from "lucide-react";

const iconMap = {
  LayoutDashboard,
  Trophy,
  MessageSquare,
  UtensilsCrossed,
  Store,
  Users,
  ClipboardCheck,
} as const;

interface BottomNavProps {
  navItems: NavItem[];
}

export function BottomNav({ navItems }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 z-50 pb-[max(0.25rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around h-16 px-3">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] min-h-[44px] px-3 py-1.5 rounded-xl transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 font-bold"
                  : "text-gray-500 hover:text-gray-900 active:scale-95"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-xs tracking-tight truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
