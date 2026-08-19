"use client";

import { useState, useMemo } from "react";
import { MenuItemCard } from "@/components/MenuItemCard";
import {
  addMenuItem,
  updateMenuItem,
  toggleMenuItemStatus,
  deleteMenuItem,
} from "@/app/actions/menu";
import type { MenuItem, MenuItemWithRating } from "@/lib/types/database";
import {
  Plus,
  UtensilsCrossed,
  Loader2,
  ImageIcon,
  DollarSign,
  AlignLeft,
  Tag,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

interface MenuClientProps {
  shopId: string;
  initialItems: MenuItemWithRating[];
}

type FilterStatus = "all" | "active" | "stock_out";

export default function MenuClient({ shopId, initialItems }: MenuClientProps) {
  const [items, setItems] = useState(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItemWithRating | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItemWithRating | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (statusFilter === "active" && item.status !== "active") return false;
      if (statusFilter === "stock_out" && item.status !== "stock_out") return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          (item.description || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, search, statusFilter]);

  const activeCount = items.filter((i) => i.status === "active").length;
  const stockOutCount = items.filter((i) => i.status === "stock_out").length;

  function openAddDialog() {
    setEditItem(null);
    setDialogOpen(true);
  }

  function openEditDialog(item: MenuItemWithRating) {
    setEditItem(item);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    if (editItem) {
      formData.set("item_id", editItem.id);
      const result = await updateMenuItem(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`"${formData.get("name")}" updated successfully`);
        closeDialog();
        window.location.reload();
      }
    } else {
      formData.set("shop_id", shopId);
      const result = await addMenuItem(formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`"${formData.get("name")}" added to your menu`);
        closeDialog();
        window.location.reload();
      }
    }
    setLoading(false);
  }

  async function handleToggle(item: MenuItemWithRating) {
    const result = await toggleMenuItemStatus(item.id, item.status);
    if (result?.error) {
      toast.error(result.error);
    } else {
      const nextStatus = item.status === "active" ? "stock_out" : "active";
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id ? { ...i, status: nextStatus as MenuItem["status"] } : i
        )
      );
      toast.success(
        nextStatus === "active"
          ? `"${item.name}" is now active and available`
          : `"${item.name}" marked as stock out`
      );
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const result = await deleteMenuItem(deleteTarget.id);
    if (result?.error) {
      toast.error(result.error);
    } else {
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.name}" removed from menu`);
    }
    setDeleteTarget(null);
  }

  return (
    <div className="space-y-6 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Menu Catalog & Pricing
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your dishes, pricing in BDT (৳), and real-time stock availability
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="h-10 rounded-xl bg-gray-900 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-2xs transition-colors hover:bg-gray-800 gap-1.5 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      {/* ── Search & Filter Controls ── */}
      {items.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xs sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search dishes by name or ingredient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-xl border-gray-200 bg-gray-50/60 pl-10 text-xs shadow-none focus-visible:bg-white focus-visible:ring-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: "all" as const, label: "All Items", count: items.length },
              {
                id: "active" as const,
                label: "Available",
                count: activeCount,
                badge: "bg-emerald-100 text-emerald-800",
              },
              {
                id: "stock_out" as const,
                label: "Stock Out",
                count: stockOutCount,
                badge: "bg-amber-100 text-amber-800",
              },
            ].map((tab) => {
              const isActive = statusFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStatusFilter(tab.id)}
                  className={`inline-flex items-center gap-1.5 shrink-0 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-gray-900 text-white shadow-2xs"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-gray-100"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-xs font-bold ${
                      isActive ? "bg-white/20 text-white" : tab.badge || "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Items Grid ── */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-20 px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-2xs text-gray-400">
            <UtensilsCrossed className="h-7 w-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            No menu items yet
          </h3>
          <p className="mb-6 max-w-xs text-xs text-gray-500">
            Start building your menu. Items you add will immediately appear for DIU students to discover and review.
          </p>
          <Button
            onClick={openAddDialog}
            className="rounded-xl bg-gray-900 font-semibold text-xs text-white hover:bg-gray-800 gap-1.5 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            Add Your First Dish
          </Button>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-2xs">
          <p className="text-sm font-bold text-gray-900">No dishes match your filter</p>
          <p className="mt-1 text-xs text-gray-400">Try searching for a different keyword or selecting &quot;All Items&quot;.</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
            }}
            className="mt-4 inline-flex items-center rounded-xl bg-gray-100 px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              editable
              onEdit={() => openEditDialog(item)}
              onToggleStatus={() => handleToggle(item)}
              onDelete={() => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!o) closeDialog(); }}>
        <DialogContent
          key={editItem?.id ?? "new"}
          className="sm:max-w-lg w-full p-0 overflow-hidden rounded-2xl gap-0 flex flex-col max-h-[90dvh]"
        >
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-base font-bold text-gray-900">
              {editItem ? "Edit Menu Item" : "Add New Menu Item"}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {editItem
                ? "Update dish details, price, and cover image."
                : "Fill in the details to add a new dish to your stall menu."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto flex-1">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-gray-400" />
                  Item Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Chicken Khichuri Special"
                  defaultValue={editItem?.name ?? ""}
                  className="rounded-xl border-gray-200 bg-gray-50/50 text-xs focus-visible:bg-white focus-visible:ring-emerald-500"
                />
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-gray-400" />
                  Price in BDT (৳) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="1"
                  min="0"
                  required
                  placeholder="120"
                  defaultValue={editItem?.price ? Number(editItem.price).toFixed(0) : ""}
                  className="rounded-xl border-gray-200 bg-gray-50/50 text-xs focus-visible:bg-white focus-visible:ring-emerald-500 tabular-nums"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-gray-400" />
                  Description
                  <span className="text-xs font-normal text-gray-400 lowercase">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Portion size, ingredients, spice level..."
                  defaultValue={editItem?.description ?? ""}
                  className="rounded-xl border-gray-200 bg-gray-50/50 text-xs focus-visible:bg-white focus-visible:ring-emerald-500 resize-none"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <Label htmlFor="image_url" className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-gray-400" />
                  Image URL
                  <span className="text-xs font-normal text-gray-400 lowercase">(optional)</span>
                </Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="https://example.com/dish.jpg"
                  defaultValue={editItem?.image_url ?? ""}
                  className="rounded-xl border-gray-200 bg-gray-50/50 text-xs focus-visible:bg-white focus-visible:ring-emerald-500"
                />
              </div>
            </div>

            <Separator />

            <div className="px-4 sm:px-6 py-4 bg-gray-50/50 flex items-center justify-end gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                className="rounded-xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-gray-900 font-semibold text-xs text-white hover:bg-gray-800"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                {editItem ? "Save Changes" : "Add Dish"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
      >
        <AlertDialogContent className="rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-gray-900">
              Delete &quot;{deleteTarget?.name}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-gray-500">
              This action cannot be undone. This menu item and its attached ratings will be permanently removed from your stall menu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl text-xs font-semibold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="rounded-xl bg-rose-600 font-semibold text-xs text-white hover:bg-rose-700"
            >
              Delete Item
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
