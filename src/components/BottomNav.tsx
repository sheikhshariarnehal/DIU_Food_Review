"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "./Sidebar";
import { BorderBeam } from "@/components/ui/border-beam";
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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 z-50 overflow-hidden">
      <BorderBeam
        size={60}
        duration={8}
        colorFrom="#16a34a"
        colorTo="#22c55e"
        borderWidth={1.5}
      />
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 min-w-0 px-2 py-1 rounded-lg transition-all duration-200 ${
                isActive
                  ? "text-green-600 scale-110"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-500" />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? "drop-shadow-[0_0_4px_rgba(22,163,74,0.5)]" : ""}`} />
              <span className="text-[10px] font-medium truncate">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
