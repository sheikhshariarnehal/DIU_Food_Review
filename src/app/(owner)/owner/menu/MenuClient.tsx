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
import { Plus, X } from "lucide-react";

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
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditItem(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Add / Edit Form */}
      {(showForm || editItem) && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {editItem ? "Edit Item" : "New Menu Item"}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditItem(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form
            action={editItem ? handleUpdate : handleAdd}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                name="name"
                type="text"
                required
                defaultValue={editItem?.name ?? ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                name="description"
                type="text"
                defaultValue={editItem?.description ?? ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (৳)
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={editItem?.price ?? ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional)
              </label>
              <input
                name="image_url"
                type="url"
                defaultValue={editItem?.image_url ?? ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Saving..." : editItem ? "Update Item" : "Add Item"}
            </button>
          </form>
        </div>
      )}

      {/* Items List */}
      {items.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 text-sm">
            No menu items yet. Add your first item!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
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
