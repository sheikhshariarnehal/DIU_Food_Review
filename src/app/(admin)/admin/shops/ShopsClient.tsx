"use client";

import { useState } from "react";
import { createShop, updateShop, deleteShop } from "@/app/actions/admin";
import type { Shop, Profile } from "@/lib/types/database";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, X, Pencil, Trash2 } from "lucide-react";

interface ShopsClientProps {
  shops: (Shop & { profiles: Pick<Profile, "full_name"> })[];
  approvedOwners: Pick<Profile, "id" | "full_name" | "email">[];
}

export default function ShopsClient({ shops: initialShops, approvedOwners }: ShopsClientProps) {
  const [shops, setShops] = useState(initialShops);
  const [showForm, setShowForm] = useState(false);
  const [editShop, setEditShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createShop(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setShowForm(false);
      window.location.reload();
    }
    setLoading(false);
  }

  async function handleUpdate(formData: FormData) {
    if (!editShop) return;
    setLoading(true);
    setError(null);
    formData.set("shop_id", editShop.id);
    const result = await updateShop(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setEditShop(null);
      window.location.reload();
    }
    setLoading(false);
  }

  async function handleDelete(shopId: string, shopName: string) {
    if (!confirm(`Delete "${shopName}"? This will also delete all associated menu items and reviews.`))
      return;
    const result = await deleteShop(shopId);
    if (!result.error) {
      setShops((prev) => prev.filter((s) => s.id !== shopId));
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shop Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            {shops.length} shop{shops.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditShop(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Shop
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Create / Edit Form */}
      {(showForm || editShop) && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              {editShop ? "Edit Shop" : "New Shop"}
            </h3>
            <button
              onClick={() => {
                setShowForm(false);
                setEditShop(null);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <form action={editShop ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shop Name
              </label>
              <input
                name="name"
                type="text"
                required
                defaultValue={editShop?.name ?? ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={2}
                defaultValue={editShop?.description ?? ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />
            </div>
            {!editShop && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Owner
                </label>
                <select
                  name="owner_id"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select an approved shop owner...</option>
                  {approvedOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.full_name || owner.email}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL (optional)
              </label>
              <input
                name="image_url"
                type="url"
                defaultValue={editShop?.image_url ?? ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            {editShop && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  value="true"
                  defaultChecked={editShop.is_active}
                  id="is_active"
                  className="rounded text-green-600 focus:ring-green-500"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  Active
                </label>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : editShop ? "Update Shop" : "Create Shop"}
            </button>
          </form>
        </div>
      )}

      {/* Shops List */}
      {shops.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-sm text-gray-500">No shops exist yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shops.map((shop) => (
            <div
              key={shop.id}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900 truncate">{shop.name}</h3>
                  <StatusBadge status={shop.is_active ? "Active" : "Suspended"} />
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  Owner: {shop.profiles?.full_name || "Unassigned"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditShop(shop)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(shop.id, shop.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
