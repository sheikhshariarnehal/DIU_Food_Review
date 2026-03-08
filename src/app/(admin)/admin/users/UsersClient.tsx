"use client";

import { useState, useMemo } from "react";
import { updateUserStatus } from "@/app/actions/admin";
import type { Profile } from "@/lib/types/database";
import { toast } from "sonner";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Search,
  X,
  ShieldCheck,
  Shield,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";

/* ───────────── Types ───────────── */

interface UsersClientProps {
  users: Profile[];
}

/* ───────────── Helpers ───────────── */

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-[11px] font-semibold text-gray-600 shadow-sm ring-1 ring-white">
      {initials || "?"}
    </span>
  );
}

function StatusDot({ status }: { status: string }) {
  const config: Record<string, { dot: string; bg: string; text: string; ring: string; label: string }> = {
    active: { dot: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-600/10", label: "Active" },
    pending: { dot: "bg-amber-500", bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-600/10", label: "Pending" },
    suspended: { dot: "bg-red-500", bg: "bg-red-50", text: "text-red-700", ring: "ring-red-600/10", label: "Suspended" },
  };
  const c = config[status] ?? config.active;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${c.bg} px-2.5 py-1 text-xs font-medium ${c.text} ring-1 ${c.ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config: Record<string, { bg: string; text: string; ring: string; label: string }> = {
    student: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-600/10", label: "Student" },
    shop_owner: { bg: "bg-violet-50", text: "text-violet-700", ring: "ring-violet-600/10", label: "Shop Owner" },
    super_admin: { bg: "bg-gray-900", text: "text-white", ring: "ring-gray-900/10", label: "Admin" },
  };
  const c = config[role] ?? config.student;
  return (
    <span className={`inline-flex items-center rounded-full ${c.bg} px-2.5 py-1 text-xs font-medium ${c.text} ring-1 ${c.ring}`}>
      {c.label}
    </span>
  );
}

/* ───────────── Main Component ───────────── */

export default function UsersClient({ users: initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  const activeCount = users.filter((u) => u.status === "active").length;
  const pendingCount = users.filter((u) => u.status === "pending").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (filterRole !== "all" && user.role !== filterRole) return false;
      if (filterStatus !== "all" && user.status !== filterStatus) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          (user.full_name ?? "").toLowerCase().includes(q) ||
          (user.email ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [users, filterRole, filterStatus, searchQuery]);

  async function handleStatusChange(userId: string, newStatus: string) {
    setLoading(userId);
    const result = await updateUserStatus(userId, newStatus);
    if (!result.error) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, status: newStatus as Profile["status"] } : u
        )
      );
      toast.success("User status updated");
    } else {
      toast.error("Failed to update status");
    }
    setLoading(null);
  }

  const hasActiveFilters =
    searchQuery !== "" || filterRole !== "all" || filterStatus !== "all";

  function clearFilters() {
    setSearchQuery("");
    setFilterRole("all");
    setFilterStatus("all");
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="space-y-6">
      {/* ─── Page Header ─── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          User Management
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage users, roles, and account statuses.
        </p>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div
          onClick={() => { setFilterStatus("all"); setFilterRole("all"); }}
          className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            <p className="text-sm text-gray-500">Total Users</p>
          </div>
        </div>
        <div
          onClick={() => { setFilterStatus("active"); setFilterRole("all"); }}
          className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <UserCheck className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            <p className="text-sm text-gray-500">Active</p>
          </div>
        </div>
        <div
          onClick={() => { setFilterStatus("pending"); setFilterRole("all"); }}
          className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
        </div>
        <div
          onClick={() => { setFilterStatus("suspended"); setFilterRole("all"); }}
          className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <UserX className="h-5 w-5 text-red-500" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold text-gray-900">{suspendedCount}</p>
            <p className="text-sm text-gray-500">Suspended</p>
          </div>
        </div>
      </div>

      {/* ─── Filters Toolbar ─── */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/50 pl-10 pr-9 shadow-none focus-visible:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-300 focus:bg-white"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="shop_owner">Shop Owners</option>
              <option value="super_admin">Admins</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-10 rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-sm text-gray-700 outline-none transition-colors focus:border-gray-300 focus:bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              >
                <X className="h-3.5 w-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Desktop Table ─── */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600">
                  User
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600">
                  Role
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600">
                  Verified
                </th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-600">
                  Joined
                </th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 shadow-sm">
                        <Users className="h-7 w-7 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          No users found
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Try adjusting your search or filters
                        </p>
                      </div>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="group border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.full_name || "?"} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {user.full_name || "Unnamed"}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusDot status={user.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {user.is_diu_verified ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 ring-1 ring-blue-600/10">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {user.role !== "super_admin" ? (
                        <div className="relative inline-flex">
                          <select
                            value={user.status}
                            onChange={(e) =>
                              handleStatusChange(user.id, e.target.value)
                            }
                            disabled={loading === user.id}
                            className="h-8 appearance-none rounded-lg border border-gray-200 bg-gray-50 pl-3 pr-7 text-xs font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 hover:bg-white focus:border-gray-300 focus:bg-white disabled:opacity-50"
                          >
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="suspended">Suspended</option>
                          </select>
                          {loading === user.id ? (
                            <Loader2 className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin text-gray-400" />
                          ) : (
                            <svg
                              className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                          <Shield className="h-3 w-3" />
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Table Footer */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/40 px-5 py-3">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {users.length}
                </span>{" "}
                user{users.length !== 1 ? "s" : ""}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 underline decoration-gray-300 underline-offset-2 transition-colors hover:text-gray-700"
                >
                  Show all
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Mobile Card List ─── */}
      <div className="flex flex-col gap-3 md:hidden">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-14 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
              <Users className="h-7 w-7 text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">
                No users found
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              <div className="flex gap-3 p-4">
                <UserAvatar name={user.full_name || "?"} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">
                        {user.full_name || "Unnamed"}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {user.email}
                      </p>
                    </div>
                    <StatusDot status={user.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <RoleBadge role={user.role} />
                    {user.is_diu_verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-blue-600/10">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-50 bg-gray-50/50 px-4 py-2.5">
                <span className="text-xs text-gray-400">
                  Joined {formatDate(user.created_at)}
                </span>
                {user.role !== "super_admin" ? (
                  <div className="relative inline-flex">
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value)
                      }
                      disabled={loading === user.id}
                      className="h-7 appearance-none rounded-lg border border-gray-200 bg-white pl-2.5 pr-6 text-xs font-medium text-gray-700 outline-none disabled:opacity-50"
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="suspended">Suspended</option>
                    </select>
                    {loading === user.id ? (
                      <Loader2 className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 animate-spin text-gray-400" />
                    ) : (
                      <svg
                        className="pointer-events-none absolute right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    )}
                  </div>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                    <Shield className="h-3 w-3" />
                    Protected
                  </span>
                )}
              </div>
            </div>
          ))
        )}
        {filteredUsers.length > 0 && (
          <p className="py-2 text-center text-xs text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-600">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-600">{users.length}</span>{" "}
            user{users.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  );
}
