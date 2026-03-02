"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/app/actions/auth";
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
  ChefHat,
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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
      {/* Brand */}
      <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-200">
        <ChefHat className="w-8 h-8 text-green-600" />
        <div>
          <h1 className="text-lg font-bold text-gray-900">DIU Food</h1>
          <p className="text-xs text-gray-500">{roleLabels[role]}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-semibold text-sm">
            {profile.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile.full_name || "User"}
            </p>
            <p className="text-xs text-gray-500 truncate">{profile.email}</p>
          </div>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
