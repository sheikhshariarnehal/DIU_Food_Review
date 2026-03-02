"use client";

import { useState } from "react";
import { approveShopOwner, rejectShopOwner } from "@/app/actions/admin";
import type { Profile } from "@/lib/types/database";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface ApprovalsClientProps {
  pendingOwners: Profile[];
}

export default function ApprovalsClient({ pendingOwners }: ApprovalsClientProps) {
  const [owners, setOwners] = useState(pendingOwners);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleApprove(profileId: string) {
    setLoading(profileId);
    const result = await approveShopOwner(profileId);
    if (!result.error) {
      setOwners((prev) => prev.filter((o) => o.id !== profileId));
    }
    setLoading(null);
  }

  async function handleReject(profileId: string) {
    if (!confirm("Reject this shop owner application?")) return;
    setLoading(profileId);
    const result = await rejectShopOwner(profileId);
    if (!result.error) {
      setOwners((prev) => prev.filter((o) => o.id !== profileId));
    }
    setLoading(null);
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-sm text-gray-500 mt-1">
          {owners.length} shop owner{owners.length !== 1 ? "s" : ""} awaiting approval
        </p>
      </div>

      {owners.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No pending approvals.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {owners.map((owner) => (
            <div
              key={owner.id}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-semibold text-sm shrink-0">
                  {owner.full_name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {owner.full_name || "Unnamed"}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{owner.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status="Pending" />
                <button
                  onClick={() => handleApprove(owner.id)}
                  disabled={loading === owner.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(owner.id)}
                  disabled={loading === owner.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-medium rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
