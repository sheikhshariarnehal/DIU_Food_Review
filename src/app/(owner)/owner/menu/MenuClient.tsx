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
import { Plus, X, Search, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">Menu Management</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1 flex items-center gap-1.5">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            {items.length} active menu item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={() => {
            setShowForm(true);
            setEditItem(null);
          }}
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl h-11 px-5 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}
      {(showForm || editItem) && (
        <Card className="border-zinc-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 flex flex-row items-center justify-between py-4">
            <CardTitle className="text-base font-bold text-zinc-900">
              {editItem ? "Edit Menu Item" : "Create New Menu Item"}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowForm(false);
                setEditItem(null);
              }}
              className="text-zinc-500 hover:text-zinc-900 -mr-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <form
              action={editItem ? handleUpdate : handleAdd}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2.5">
                <Label htmlFor="name" className="text-sm font-semibold text-zinc-700">
                  Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Classic Beef Burger"
                  defaultValue={editItem?.name ?? ""}
                  className="bg-zinc-50/50 focus-visible:ring-zinc-800"
                />
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="price" className="text-sm font-semibold text-zinc-700">
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
                  className="bg-zinc-50/50 focus-visible:ring-zinc-800"
                />
              </div>

              <div className="space-y-2.5 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-semibold text-zinc-700">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  type="text"
                  placeholder="Brief description of the item..."
                  defaultValue={editItem?.description ?? ""}
                  className="bg-zinc-50/50 focus-visible:ring-zinc-800"
                />
              </div>

              <div className="space-y-2.5 md:col-span-2">
                <Label htmlFor="image_url" className="text-sm font-semibold text-zinc-700">
                  Image URL
                </Label>
                <Input
                  id="image_url"
                  name="image_url"
                  type="url"
                  placeholder="https://..."
                  defaultValue={editItem?.image_url ?? ""}
                  className="bg-zinc-50/50 focus-visible:ring-zinc-800"
                />
              </div>

              <div className="md:col-span-2 pt-2 flex justify-end">
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl h-11 px-6 shadow-sm min-w-[140px]"
                >
                  {loading ? "Saving..." : editItem ? "Update Item" : "Create Item"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Items List */}
      {items.length === 0 ? (
        <Card className="border-dashed border-2 border-zinc-200 bg-zinc-50/50 shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-zinc-400" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-1">No menu items yet</h3>
            <p className="text-sm text-zinc-500 max-w-sm mb-6">
              Get started by adding your first menu item. It will appear here and become immediately visible to students on the app.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setShowForm(true);
                setEditItem(null);
              }}
              className="font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
