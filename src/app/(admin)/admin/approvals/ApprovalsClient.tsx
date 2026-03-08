"use client";

import { useState } from "react";
import { approveShopOwner, rejectShopOwner } from "@/app/actions/admin";
import type { Profile } from "@/lib/types/database";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Mail,
  Calendar,
  ShieldCheck,
} from "lucide-react";

interface ApprovalsClientProps {
  pendingOwners: Profile[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function OwnerAvatar({ name }: { name: string | null }) {
  const initial = name?.charAt(0)?.toUpperCase() || "?";
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-50 to-amber-100 text-sm font-semibold text-amber-700 shadow-sm ring-1 ring-white">
      {initial}
    </div>
  );
}

export default function ApprovalsClient({
  pendingOwners,
}: ApprovalsClientProps) {
  const [owners, setOwners] = useState(pendingOwners);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleApprove(owner: Profile) {
    setLoadingId(owner.id);
    const result = await approveShopOwner(owner.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      setOwners((prev) => prev.filter((o) => o.id !== owner.id));
      toast.success(`${owner.full_name || "Owner"} has been approved`);
    }
    setLoadingId(null);
  }

  async function handleReject(owner: Profile) {
    setLoadingId(owner.id);
    const result = await rejectShopOwner(owner.id);
    if (result.error) {
      toast.error(result.error);
    } else {
      setOwners((prev) => prev.filter((o) => o.id !== owner.id));
      toast.success(`${owner.full_name || "Owner"} has been rejected`);
    }
    setLoadingId(null);
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Pending Approvals
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Review and manage shop owner applications
        </p>
      </div>

      {/* Stat Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {owners.length}
              </p>
              <p className="text-xs text-gray-500">Pending Applications</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approvals List */}
      {owners.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="mt-3 text-sm font-medium text-gray-900">
            All caught up!
          </p>
          <p className="mt-1 text-sm text-gray-500">
            No pending shop owner applications to review.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {owners.map((owner) => {
            const isLoading = loadingId === owner.id;
            return (
              <div
                key={owner.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Owner info */}
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <OwnerAvatar name={owner.full_name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-medium text-gray-900">
                          {owner.full_name || "Unnamed"}
                        </p>
                        {owner.is_diu_verified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                            <ShieldCheck className="h-3 w-3" />
                            DIU Verified
                          </span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {owner.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Applied {formatDate(owner.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status & Actions */}
                  <div className="flex items-center gap-2 sm:shrink-0">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Pending
                    </span>

                    <button
                      onClick={() => handleApprove(owner)}
                      disabled={isLoading}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      )}
                      Approve
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger
                        disabled={isLoading}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Reject Application
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to reject{" "}
                            <span className="font-medium text-gray-900">
                              {owner.full_name || "this owner"}
                            </span>
                            &apos;s shop owner application? This action cannot
                            be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleReject(owner)}
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Reject
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
