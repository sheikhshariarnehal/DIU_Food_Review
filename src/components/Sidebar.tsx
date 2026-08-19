"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Profile, UserRole } from "@/lib/types/database";
import {
  LayoutDashboard,
  Trophy,
  MessageSquare,
  UtensilsCrossed,
  Store,
  Users,
  ClipboardCheck,
  LogOut,
} from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

const iconMap = {
  LayoutDashboard,
  Trophy,
  MessageSquare,
  UtensilsCrossed,
  Store,
  Users,
  ClipboardCheck,
} as const;

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof iconMap;
};

interface SidebarProps {
  navItems: NavItem[];
  profile: Profile;
  role: UserRole;
}

const roleLabels: Record<UserRole, string> = {
  student: "Student",
  shop_owner: "Shop Owner",
  super_admin: "Super Admin",
};

export function Sidebar({ navItems, profile, role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-100 flex-shrink-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-100">
        <BrandLogo size="md" />
        <div className="flex flex-col">
          <h1 className="text-sm font-black text-gray-900 tracking-tight leading-none mb-0.5">DIU Food</h1>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{roleLabels[role]}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Main Menu</p>
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-zinc-100/90 text-zinc-900 shadow-2xs"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-zinc-900" : "text-gray-400"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="border-t border-gray-100 p-4 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0 shadow-2xs">
            {profile.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">
              {profile.full_name || "User"}
            </p>
            <p className="text-xs font-medium text-gray-500 truncate">{profile.email}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { window.location.href = "/api/signout"; }}
          className="flex items-center justify-center gap-2 w-full px-3 py-2 text-xs font-semibold text-rose-700 border border-rose-100 bg-rose-50/60 hover:bg-rose-100 hover:text-rose-800 rounded-xl transition-all shadow-2xs cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
