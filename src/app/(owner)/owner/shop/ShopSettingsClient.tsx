"use client";

import { useState } from "react";
import { updateOwnShop } from "@/app/actions/shop";
import type { Shop } from "@/lib/types/database";
import { Save, Store } from "lucide-react";
import Image from "next/image";

interface ShopSettingsClientProps {
  shop: Shop;
}

export default function ShopSettingsClient({ shop }: ShopSettingsClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(shop.image_url || "");

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const result = await updateOwnShop(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Shop</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your shop details and settings
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          Shop details updated successfully!
        </div>
      )}

      <form action={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {/* Shop Image Preview */}
          {previewUrl && (
            <div className="flex justify-center">
              <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={previewUrl}
                  alt="Shop preview"
                  fill
                  className="object-cover"
                  onError={() => setPreviewUrl("")}
                />
              </div>
            </div>
          )}

          {!previewUrl && (
            <div className="flex justify-center">
              <div className="w-full h-48 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <Store className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No image set</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              minLength={2}
              defaultValue={shop.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your shop name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              rows={3}
              defaultValue={shop.description}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              placeholder="Describe your shop, specialties, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URL
            </label>
            <input
              name="image_url"
              type="url"
              defaultValue={shop.image_url ?? ""}
              onChange={(e) => setPreviewUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="https://example.com/shop-image.jpg"
            />
            <p className="text-xs text-gray-400 mt-1">
              Paste a direct image URL for your shop banner
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <span className="text-sm font-medium text-gray-700">Status:</span>{" "}
              <span
                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                  shop.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {shop.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
