"use client";

import { useState } from "react";
import { updateUserStatus } from "@/app/actions/admin";
import type { Profile } from "@/lib/types/database";
import { StatusBadge } from "@/components/StatusBadge";

interface UsersClientProps {
  users: Profile[];
}

export default function UsersClient({ users: initialUsers }: UsersClientProps) {
  const [users, setUsers] = useState(initialUsers);
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    if (filterRole !== "all" && user.role !== filterRole) return false;
    if (filterStatus !== "all" && user.status !== filterStatus) return false;
    return true;
  });

  async function handleStatusChange(userId: string, newStatus: string) {
    setLoading(userId);
    const result = await updateUserStatus(userId, newStatus);
    if (!result.error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus as Profile["status"] } : u))
      );
    }
    setLoading(null);
  }

  const statusBadgeMap = (status: string) => {
    switch (status) {
      case "active":
        return "Active" as const;
      case "pending":
        return "Pending" as const;
      case "suspended":
        return "Suspended" as const;
      default:
        return "Active" as const;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          {users.length} total user{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="shop_owner">Shop Owners</option>
          <option value="super_admin">Admins</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Desktop */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  DIU Verified
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {user.full_name || "Unnamed"}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700 capitalize">
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={statusBadgeMap(user.status)} />
                  </td>
                  <td className="px-4 py-3">
                    {user.is_diu_verified ? (
                      <StatusBadge status="Verified" />
                    ) : (
                      <span className="text-xs text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.role !== "super_admin" && (
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user.id, e.target.value)}
                        disabled={loading === user.id}
                        className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="sm:hidden divide-y divide-gray-100">
          {filteredUsers.map((user) => (
            <div key={user.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user.full_name || "Unnamed"}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <StatusBadge status={statusBadgeMap(user.status)} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 capitalize">
                  {user.role.replace("_", " ")}
                </span>
                {user.role !== "super_admin" && (
                  <select
                    value={user.status}
                    onChange={(e) => handleStatusChange(user.id, e.target.value)}
                    disabled={loading === user.id}
                    className="px-2 py-1 border border-gray-300 rounded text-xs"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="suspended">Suspended</option>
                  </select>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-500">No users match the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
