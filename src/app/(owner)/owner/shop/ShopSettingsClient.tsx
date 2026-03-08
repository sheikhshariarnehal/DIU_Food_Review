"use client";

import { useState } from "react";
import { updateOwnShop } from "@/app/actions/shop";
import { Shop } from "@/lib/types/database";
import { Save, Store, Edit3, Image as ImageIcon, MapPin, Phone, Info } from "lucide-react";
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
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      {/* Header section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Shop Configuration
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Personalize your shop&apos;s appearance and information
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-sm font-semibold text-gray-600">Status</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
              shop.is_active
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-rose-100 text-rose-700 border border-rose-200"
            }`}
          >
            {shop.is_active ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex">
            <div className="flex-shrink-0">
              <Info className="h-5 w-5 text-emerald-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-emerald-700 font-medium">
                Shop details successfully updated!
              </p>
            </div>
          </div>
        </div>
      )}

      <form action={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main info column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-gray-500" />
                  General Information
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shop Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    defaultValue={shop.name}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-colors"
                    placeholder="Enter your shop's official name"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This is the name that students will see when browsing shops.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    defaultValue={shop.description}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white resize-none transition-colors"
                    placeholder="Describe your shop's specialties, history, or atmosphere..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar column */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-500" />
                  Media
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 group transition-all hover:border-blue-400">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Shop preview text"
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                        onError={() => setPreviewUrl("")}
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <ImageIcon className="w-10 h-10 mb-3 text-gray-300 group-hover:text-blue-400 transition-colors" />
                        <span className="text-sm font-medium">No cover image</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Banner Image URL
                    </label>
                    <input
                      name="image_url"
                      type="url"
                      defaultValue={shop.image_url ?? ""}
                      onChange={(e) => setPreviewUrl(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                      placeholder="https://..."
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Provide a direct link to an image (e.g., .jpg, .png).
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden group flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white text-base font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
              <Save className={`w-5 h-5 z-10 ${loading ? "animate-pulse" : ""}`} />
              <span className="z-10">{loading ? "Saving Changes..." : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
