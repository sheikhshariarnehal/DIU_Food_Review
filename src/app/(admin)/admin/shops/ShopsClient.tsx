"use client";

import { useState, useMemo } from "react";
import { createShop, updateShop, deleteShop } from "@/app/actions/admin";
import type { Shop, Profile } from "@/lib/types/database";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Store,
  MoreHorizontal,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  X,
  CheckCircle2,
  XCircle,
  Loader2,
  TrendingUp,
  ShoppingBag,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ───────────── Types ───────────── */

interface ShopsClientProps {
  shops: (Shop & { profiles: Pick<Profile, "full_name"> })[];
  approvedOwners: Pick<Profile, "id" | "full_name" | "email">[];
}

type SortKey = "name" | "owner" | "status" | "created_at";
type SortDir = "asc" | "desc";

/* ───────────── Helper Components ───────────── */

function SortIcon({
  columnKey,
  sortKey,
  sortDir,
}: {
  columnKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  if (sortKey !== columnKey)
    return <ArrowUpDown className="h-3.5 w-3.5 text-gray-400" />;
  return sortDir === "asc" ? (
    <ArrowUp className="h-3.5 w-3.5 text-gray-900" />
  ) : (
    <ArrowDown className="h-3.5 w-3.5 text-gray-900" />
  );
}

function ShopImage({
  src,
  alt,
  size = "md",
}: {
  src: string | null;
  alt: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = { sm: "h-9 w-9", md: "h-11 w-11", lg: "h-16 w-16" };
  const iconSize = size === "lg" ? "h-6 w-6" : "h-4 w-4";
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} shrink-0 rounded-xl object-cover border border-gray-100 shadow-sm`}
      />
    );
  }
  return (
    <div
      className={`${sizeClasses[size]} flex shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-gray-50 shadow-sm`}
    >
      <Store className={`${iconSize} text-gray-400`} />
    </div>
  );
}

function OwnerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 text-[11px] font-semibold text-gray-600 shadow-sm ring-1 ring-white">
      {initials || "?"}
    </span>
  );
}

/* ───────────── Main Component ───────────── */

export default function ShopsClient({
  shops: initialShops,
  approvedOwners,
}: ShopsClientProps) {
  const [shops, setShops] = useState(initialShops);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);
  const [editShop, setEditShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [isActive, setIsActive] = useState(true);
  const [imagePreview, setImagePreview] = useState<string>("");

  const activeCount = shops.filter((s) => s.is_active).length;
  const inactiveCount = shops.length - activeCount;

  const filteredShops = useMemo(() => {
    let result = shops.filter((shop) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        shop.name.toLowerCase().includes(q) ||
        (shop.profiles?.full_name ?? "").toLowerCase().includes(q) ||
        (shop.description ?? "").toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && shop.is_active) ||
        (statusFilter === "inactive" && !shop.is_active);
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "owner":
          cmp = (a.profiles?.full_name ?? "").localeCompare(
            b.profiles?.full_name ?? ""
          );
          break;
        case "status":
          cmp = Number(b.is_active) - Number(a.is_active);
          break;
        case "created_at":
          cmp =
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [shops, searchQuery, statusFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  function openCreateDialog() {
    setEditShop(null);
    setIsActive(true);
    setImagePreview("");
    setDialogOpen(true);
  }

  function openEditDialog(shop: Shop) {
    setEditShop(shop);
    setIsActive(shop.is_active);
    setImagePreview(shop.image_url ?? "");
    setDialogOpen(true);
  }

  function confirmDelete(shop: Shop) {
    setShopToDelete(shop);
    setDeleteDialogOpen(true);
  }

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter("all");
  }

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    if (editShop) {
      formData.set("shop_id", editShop.id);
      formData.set("is_active", String(isActive));
      const result = await updateShop(formData);
      if (result?.error) toast.error(result.error);
      else {
        toast.success(`"${formData.get("name")}" updated successfully`);
        setDialogOpen(false);
        window.location.reload();
      }
    } else {
      const result = await createShop(formData);
      if (result?.error) toast.error(result.error);
      else {
        toast.success(`"${formData.get("name")}" created successfully`);
        setDialogOpen(false);
        window.location.reload();
      }
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!shopToDelete) return;
    setDeleteLoading(true);
    const result = await deleteShop(shopToDelete.id);
    if (result?.error) toast.error(result.error);
    else {
      toast.success(`"${shopToDelete.name}" deleted successfully`);
      setShops((prev) => prev.filter((s) => s.id !== shopToDelete.id));
    }
    setDeleteLoading(false);
    setDeleteDialogOpen(false);
    setShopToDelete(null);
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const activePercent =
    shops.length > 0 ? Math.round((activeCount / shops.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ─── Page Header ─── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Shop Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Create, edit, and manage all registered food shops.
          </p>
        </div>
        <Button onClick={openCreateDialog} size="lg" className="shrink-0 shadow-sm">
          <Plus className="h-4 w-4" data-icon="inline-start" />
          Add Shop
        </Button>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Shops */}
        <div
          onClick={() => setStatusFilter("all")}
          className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
              <ShoppingBag className="h-5 w-5 text-blue-600" />
            </div>
            <Badge variant="outline" className="text-gray-500 border-gray-200">
              All time
            </Badge>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">{shops.length}</p>
            <p className="mt-0.5 text-sm text-gray-500">Total Shops</p>
          </div>
        </div>

        {/* Active Shops */}
        <div
          onClick={() => setStatusFilter("active")}
          className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
              +{activePercent}%
              <ArrowUp className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">{activeCount}</p>
            <p className="mt-0.5 text-sm text-gray-500">Active Shops</p>
          </div>
        </div>

        {/* Inactive Shops */}
        <div
          onClick={() => setStatusFilter("inactive")}
          className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <BarChart3 className="h-5 w-5 text-red-500" />
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-500">
              {shops.length > 0
                ? Math.round((inactiveCount / shops.length) * 100)
                : 0}
              %
              <ArrowDown className="h-3 w-3" />
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-gray-900">{inactiveCount}</p>
            <p className="mt-0.5 text-sm text-gray-500">Inactive Shops</p>
          </div>
        </div>
      </div>

      {/* ─── Filters Toolbar ─── */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search shops, owners, or descriptions..."
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
            {(["all", "active", "inactive"] as const).map((filter) => {
              const isSelected = statusFilter === filter;
              const count =
                filter === "all"
                  ? shops.length
                  : filter === "active"
                  ? activeCount
                  : inactiveCount;
              return (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                    isSelected
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {filter === "all"
                    ? "All"
                    : filter === "active"
                    ? "Active"
                    : "Inactive"}
                  <span
                    className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "bg-gray-200/80 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="ml-1 inline-flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
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
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-100 bg-gray-50/60 hover:bg-gray-50/60">
                <TableHead className="w-[38%] font-semibold text-gray-600">
                  <button
                    onClick={() => toggleSort("name")}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-900"
                  >
                    Shop
                    <SortIcon
                      columnKey="name"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-gray-600">
                  <button
                    onClick={() => toggleSort("owner")}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-900"
                  >
                    Owner
                    <SortIcon
                      columnKey="owner"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-gray-600">
                  <button
                    onClick={() => toggleSort("status")}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-900"
                  >
                    Status
                    <SortIcon
                      columnKey="status"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead className="font-semibold text-gray-600">
                  <button
                    onClick={() => toggleSort("created_at")}
                    className="inline-flex items-center gap-1.5 transition-colors hover:text-gray-900"
                  >
                    Created
                    <SortIcon
                      columnKey="created_at"
                      sortKey={sortKey}
                      sortDir={sortDir}
                    />
                  </button>
                </TableHead>
                <TableHead className="w-14" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShops.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-4 text-gray-400">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 shadow-sm">
                        <Store className="h-7 w-7 text-gray-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-600">
                          No shops found
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {hasActiveFilters
                            ? "Try adjusting your search or filters"
                            : "Get started by adding your first shop"}
                        </p>
                      </div>
                      {hasActiveFilters ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearFilters}
                          className="shadow-sm"
                        >
                          Clear Filters
                        </Button>
                      ) : (
                        <Button size="sm" onClick={openCreateDialog} className="shadow-sm">
                          <Plus className="h-3.5 w-3.5" data-icon="inline-start" />
                          Add Shop
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredShops.map((shop) => (
                  <TableRow
                    key={shop.id}
                    className="group border-b border-gray-50 transition-colors hover:bg-gray-50/50"
                  >
                    <TableCell className="py-3.5">
                      <div className="flex items-center gap-3">
                        <ShopImage
                          src={shop.image_url}
                          alt={shop.name}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate max-w-[280px]">
                            {shop.name}
                          </p>
                          {shop.description && (
                            <p className="text-xs text-gray-400 truncate max-w-[280px]">
                              {shop.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <OwnerAvatar
                          name={shop.profiles?.full_name || "Unassigned"}
                        />
                        <span className="text-sm text-gray-700 truncate max-w-[140px]">
                          {shop.profiles?.full_name || (
                            <span className="italic text-gray-400">
                              Unassigned
                            </span>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {shop.is_active ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          Inactive
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatDate(shop.created_at)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 data-open:bg-gray-200 data-open:text-gray-700"
                            />
                          }
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" side="bottom">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(shop)}
                          >
                            <Pencil className="h-4 w-4" />
                            Edit Shop
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => confirmDelete(shop)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Shop
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Table Footer */}
          {filteredShops.length > 0 && (
            <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/40 px-5 py-3">
              <p className="text-xs text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {filteredShops.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {shops.length}
                </span>{" "}
                shop{shops.length !== 1 ? "s" : ""}
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
        {filteredShops.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 bg-white px-6 py-14 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
              <Store className="h-7 w-7 text-gray-300" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600">
                No shops found
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {hasActiveFilters
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first shop"}
              </p>
            </div>
            {hasActiveFilters ? (
              <Button variant="outline" size="sm" onClick={clearFilters} className="shadow-sm">
                Clear Filters
              </Button>
            ) : (
              <Button size="sm" onClick={openCreateDialog} className="shadow-sm">
                <Plus className="h-3.5 w-3.5" data-icon="inline-start" />
                Add Shop
              </Button>
            )}
          </div>
        ) : (
          filteredShops.map((shop) => (
            <div
              key={shop.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Card Body */}
              <div className="flex gap-3 p-4">
                <ShopImage src={shop.image_url} alt={shop.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {shop.name}
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                        <OwnerAvatar
                          name={shop.profiles?.full_name || "?"}
                        />
                        <span className="truncate">
                          {shop.profiles?.full_name || "Unassigned"}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="rounded-lg hover:bg-gray-100"
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => openEditDialog(shop)}
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => confirmDelete(shop)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {shop.description && (
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-400 line-clamp-2">
                      {shop.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-gray-50 bg-gray-50/50 px-4 py-2.5">
                {shop.is_active ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700 ring-1 ring-red-600/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    Inactive
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  {formatDate(shop.created_at)}
                </span>
              </div>
            </div>
          ))
        )}
        {filteredShops.length > 0 && (
          <p className="py-2 text-center text-xs text-gray-400">
            Showing{" "}
            <span className="font-medium text-gray-600">
              {filteredShops.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-gray-600">{shops.length}</span>{" "}
            shop{shops.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* ─── Create / Edit Dialog ─── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editShop ? "Edit Shop" : "Create New Shop"}
            </DialogTitle>
            <DialogDescription>
              {editShop
                ? "Update the shop details below."
                : "Fill in the details to register a new shop."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="shop-name">
                Shop Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="shop-name"
                name="name"
                placeholder="e.g. Campus Burger & Grill"
                required
                defaultValue={editShop?.name ?? ""}
                key={editShop?.id ?? "new"}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shop-description">Description</Label>
              <Textarea
                id="shop-description"
                name="description"
                placeholder="Brief description of the shop..."
                rows={3}
                defaultValue={editShop?.description ?? ""}
                key={`desc-${editShop?.id ?? "new"}`}
              />
            </div>

            {!editShop && (
              <div className="grid gap-2">
                <Label htmlFor="shop-owner">
                  Assign Owner <span className="text-destructive">*</span>
                </Label>
                <select
                  id="shop-owner"
                  name="owner_id"
                  required
                  className="flex h-10 w-full items-center rounded-xl border border-gray-200 bg-gray-50/50 px-3 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:bg-white focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">Select an approved shop owner...</option>
                  {approvedOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.full_name || owner.email}
                    </option>
                  ))}
                </select>
                {approvedOwners.length === 0 && (
                  <p className="text-xs text-amber-600">
                    No approved shop owners available. Approve owners in the
                    Approvals tab first.
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="shop-image">Image URL</Label>
              <Input
                id="shop-image"
                name="image_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                defaultValue={editShop?.image_url ?? ""}
                onChange={(e) => setImagePreview(e.target.value)}
                key={`img-${editShop?.id ?? "new"}`}
              />
              {imagePreview && (
                <div className="relative mt-1 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 shadow-sm">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                    onLoad={(e) => {
                      (e.target as HTMLImageElement).style.display = "block";
                    }}
                  />
                </div>
              )}
            </div>

            {editShop && (
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="shop-active">Active Status</Label>
                  <p className="text-xs text-gray-500">
                    Inactive shops are hidden from students
                  </p>
                </div>
                <Switch
                  id="shop-active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            )}

            <DialogFooter>
              <DialogClose render={<Button variant="outline" />}>
                Cancel
              </DialogClose>
              <Button type="submit" disabled={loading} className="shadow-sm">
                {loading && (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    data-icon="inline-start"
                  />
                )}
                {loading
                  ? "Saving..."
                  : editShop
                  ? "Save Changes"
                  : "Create Shop"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirmation ─── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia>
              <Trash2 className="h-5 w-5 text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle>
              Delete &ldquo;{shopToDelete?.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this shop along with all its menu
              items and reviews. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading && (
                <Loader2
                  className="h-4 w-4 animate-spin"
                  data-icon="inline-start"
                />
              )}
              {deleteLoading ? "Deleting..." : "Delete Shop"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
