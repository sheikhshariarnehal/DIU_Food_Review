"use client";

import { useState } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

export default function MenuClient({ shopId, initialItems }: MenuClientProps) {
  const [items, setItems] = useState(initialItems);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItemWithRating | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItemWithRating | null>(null);
  const [loading, setLoading] = useState(false);

  function openAddDialog() {
    setEditItem(null);
    setDialogOpen(true);
  }

  function openEditDialog(item: MenuItem) {
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

  async function handleToggle(item: MenuItem) {
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
          ? `"${item.name}" is now active`
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
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Menu Management
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Manage your shop&apos;s menu items, prices, and availability
          </p>
        </div>
        <Button
          onClick={openAddDialog}
          className="bg-zinc-900 hover:bg-zinc-700 text-white font-semibold rounded-lg h-10 px-4 shadow-sm gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Menu Item
        </Button>
      </div>

      {/* ── Items Grid ── */}
      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 py-20 flex flex-col items-center justify-center text-center px-6">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
            <UtensilsCrossed className="w-7 h-7 text-zinc-400" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900 mb-1">
            No menu items yet
          </h3>
          <p className="text-sm text-zinc-500 max-w-xs mb-6">
            Start building your menu. Items you add will be visible to students right away.
          </p>
          <Button
            onClick={openAddDialog}
            variant="outline"
            className="font-medium gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Your First Item
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
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
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b border-zinc-100">
            <DialogTitle className="text-lg font-bold text-zinc-900">
              {editItem ? "Edit Menu Item" : "Add New Menu Item"}
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              {editItem
                ? "Update the details for this menu item."
                : "Fill in the details to add a new item to your menu."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="px-4 sm:px-6 py-4 sm:py-5 space-y-5 overflow-y-auto flex-1">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-zinc-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-zinc-400" />
                  Item Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Classic Beef Burger"
                  defaultValue={editItem?.name ?? ""}
                  className="border-zinc-200 focus-visible:ring-zinc-800 bg-zinc-50/50"
                />
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold text-zinc-700 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                  Price (৳) <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                  defaultValue={editItem?.price ?? ""}
                  className="border-zinc-200 focus-visible:ring-zinc-800 bg-zinc-50/50"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold text-zinc-700 flex items-center gap-1.5">
                  <AlignLeft className="w-3.5 h-3.5 text-zinc-400" />
                  Description
                  <span className="text-xs font-normal text-zinc-400">(optional)</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  placeholder="Brief description of the item..."
                  defaultValue={editItem?.description ?? ""}
                  className="border-zinc-200 focus-visible:ring-zinc-800 bg-zinc-50/50 resize-none"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-sm font-semibold text-zinc-700 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                  Image URL
                  <span className="text-xs font-normal text-zinc-400">(optional)</span>
                </Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  defaultValue={editItem?.image_url ?? ""}
                  className="border-zinc-200 focus-visible:ring-zinc-800 bg-zinc-50/50"
                />
              </div>
            </div>

            <Separator />

            <div className="px-4 sm:px-6 py-4 border-t border-zinc-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={loading}
                className="rounded-lg w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-zinc-900 hover:bg-zinc-700 text-white font-semibold rounded-lg gap-2 w-full sm:w-auto sm:min-w-[120px]"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading
                  ? "Saving…"
                  : editItem
                  ? "Save Changes"
                  : "Add Item"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
      >
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{deleteTarget?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove this item from your menu. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
