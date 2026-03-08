"use client";

import { useState } from "react";
import { updateOwnShop } from "@/app/actions/shop";
import { Shop } from "@/lib/types/database";
import {
  Save,
  Store,
  Edit3,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface ShopSettingsClientProps {
  shop: Shop;
}

export default function ShopSettingsClient({ shop }: ShopSettingsClientProps) {
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(shop.image_url || "");

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const result = await updateOwnShop(formData);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Shop details updated successfully!");
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Shop Configuration
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Personalize your shop&apos;s appearance and public information.
          </p>
        </div>

        <div className="inline-flex items-center gap-2.5 rounded-2xl border border-gray-100 bg-white px-4 py-2.5 shadow-sm">
          <span className="text-xs font-medium text-gray-500">Status</span>
          {shop.is_active ? (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-emerald-700">
                Active
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-red-700">
                Inactive
              </span>
            </div>
          )}
        </div>
      </div>

      <form action={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Main info column */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                <Edit3 className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-bold text-gray-900">
                  General Information
                </h2>
              </div>
              <div className="space-y-5 p-5">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    defaultValue={shop.name}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-300"
                    placeholder="Enter your shop's official name"
                  />
                  <p className="text-xs text-gray-400">
                    This is the name that students will see when browsing shops.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={shop.description || ""}
                    className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-300"
                    placeholder="Describe your shop's specialties, history, or atmosphere..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar column */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                <ImageIcon className="h-4 w-4 text-gray-400" />
                <h2 className="text-sm font-bold text-gray-900">Media</h2>
              </div>
              <div className="space-y-4 p-5">
                <div className="group relative aspect-video overflow-hidden rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-all hover:border-gray-300">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Shop preview"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={() => setPreviewUrl("")}
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="mb-2 h-8 w-8 text-gray-300 transition-colors group-hover:text-gray-400" />
                      <span className="text-xs font-medium">
                        No cover image
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="image_url"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Banner Image URL
                  </label>
                  <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    defaultValue={shop.image_url ?? ""}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-300"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-400">
                    Provide a direct link to an image (e.g., .jpg, .png).
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-800 hover:shadow-md disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
