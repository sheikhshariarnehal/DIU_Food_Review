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
  ExternalLink,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { toast } from "sonner";
import Link from "next/link";

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
    <div className="w-full space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Shop Configuration & Profile
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Personalize your shop&apos;s public branding, description, and campus appearance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/shops/${shop.id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition-colors hover:bg-gray-50 hover:text-gray-900"
          >
            <span>View Public Page</span>
            <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
          </Link>

          <div className="inline-flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-3.5 py-2 shadow-2xs">
            <span className="text-xs font-medium text-gray-500">Status:</span>
            {shop.is_active ? (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-emerald-700">
                  Active
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-xs font-bold text-rose-700">
                  Inactive
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main info column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-2xs overflow-hidden">
              <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                <Edit3 className="h-4 w-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-900">
                  General Stall Information
                </h2>
              </div>
              <div className="space-y-5 p-5">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                  >
                    Shop Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    defaultValue={shop.name}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Enter your shop's official stall name"
                  />
                  <p className="text-xs text-gray-400">
                    Displayed across student search, leaderboards, and dish listings.
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="description"
                    className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                  >
                    Description & Specialties
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={shop.description || ""}
                    className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="Describe your shop's specialty dishes, operating hours, and location on campus..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-100 bg-white shadow-2xs overflow-hidden">
              <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                <ImageIcon className="h-4 w-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-gray-900">Cover Media</h2>
              </div>
              <div className="space-y-4 p-5">
                <div className="group relative aspect-video overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  <SafeImage
                    src={previewUrl || ""}
                    alt="Shop preview"
                    fill
                    fallbackType="store"
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 320px"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="image_url"
                    className="block text-xs font-bold uppercase tracking-wider text-gray-700"
                  >
                    Banner Image URL
                  </label>
                  <input
                    id="image_url"
                    name="image_url"
                    type="url"
                    defaultValue={shop.image_url ?? ""}
                    onChange={(e) => setPreviewUrl(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 outline-none transition-colors focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="https://..."
                  />
                  <p className="text-xs text-gray-400">
                    Direct image link (.jpg, .png, .webp).
                  </p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-2xs transition-all hover:bg-gray-800 hover:shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              <span>{loading ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
