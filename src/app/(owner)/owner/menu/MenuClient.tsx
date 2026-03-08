"use client";

import { useState } from "react";
import { MenuItemCard } from "@/components/MenuItemCard";
import {
  addMenuItem,
  updateMenuItem,
  toggleMenuItemStatus,
  deleteMenuItem,
} from "@/app/actions/menu";
import type { MenuItem } from "@/lib/types/database";
import { Plus, X, UtensilsCrossed } from "lucide-react";
import { Card, CardHeader, CardContent, CardAction, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MenuClientProps {
  shopId: string;
  initialItems: MenuItem[];
}

export default function MenuClient({ shopId, initialItems }: MenuClientProps) {
  const [items, setItems] = useState(initialItems);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAdd(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("shop_id", shopId);
    const result = await addMenuItem(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setShowForm(false);
      // Refresh — simplest approach in client component
      window.location.reload();
    }
    setLoading(false);
  }

  async function handleUpdate(formData: FormData) {
    if (!editItem) return;
    setLoading(true);
    setError(null);
    formData.set("item_id", editItem.id);
    const result = await updateMenuItem(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setEditItem(null);
      window.location.reload();
    }
    setLoading(false);
  }

  async function handleToggle(item: MenuItem) {
    const result = await toggleMenuItemStatus(item.id, item.status);
    if (result?.error) {
      setError(result.error);
    } else {
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, status: i.status === "active" ? "stock_out" as const : "active" as const }
            : i
        )
      );
    }
  }

  async function handleDelete(item: MenuItem) {
    if (!confirm(`Delete "${item.name}"?`)) return;
    const result = await deleteMenuItem(item.id);
    if (result?.error) {
      setError(result.error);
    } else {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  }

  return (
    <div className="space-y-4">

      {/* ── Page Header ── */}
      <Card className="py-0">
        <CardHeader className="py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <UtensilsCrossed className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold">Menu Management</CardTitle>
              <p className="text-xs text-gray-400 mt-0.5">
                {items.length} item{items.length !== 1 ? "s" : ""} listed
              </p>
            </div>
          </div>
          <CardAction>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => { setShowForm(true); setEditItem(null); }}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Item
            </Button>
          </CardAction>
        </CardHeader>
      </Card>

      {/* ── Error ── */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Add / Edit Form ── */}
      {(showForm || editItem) && (
        <Card className="py-0 gap-0">
          <CardHeader className="py-3 border-b">
            <CardTitle className="text-sm font-semibold">
              {editItem ? "Edit Item" : "New Menu Item"}
            </CardTitle>
            <CardAction>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => { setShowForm(false); setEditItem(null); }}
              >
                <X className="w-4 h-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="py-4">
            <form action={editItem ? handleUpdate : handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    defaultValue={editItem?.name ?? ""}
                    placeholder="e.g. Beef Burger"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (৳) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    defaultValue={editItem?.price ?? ""}
                    placeholder="e.g. 120"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  defaultValue={editItem?.description ?? ""}
                  placeholder="Short description of the item"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  defaultValue={editItem?.image_url ?? ""}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? "Saving..." : editItem ? "Update Item" : "Add Item"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ── Items List ── */}
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <UtensilsCrossed className="w-8 h-8 text-gray-200 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-gray-400">No menu items yet.</p>
            <p className="text-xs text-gray-300 mt-1">Click &quot;Add Item&quot; to create your first item.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              editable
              onEdit={() => setEditItem(item)}
              onToggleStatus={() => handleToggle(item)}
              onDelete={() => handleDelete(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
