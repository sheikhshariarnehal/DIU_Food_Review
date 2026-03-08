"use client";

import { useState } from "react";
import { updateOwnShop } from "@/app/actions/shop";
import { Shop } from "@/lib/types/database";
import { Save, Store, Edit3, Image as ImageIcon, MapPin, Phone, Info } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight">
            Shop Configuration
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Personalize your shop&apos;s appearance and public information.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-zinc-200 shadow-sm">
          <span className="text-sm font-semibold text-zinc-600">Status</span>
          {shop.is_active ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-emerald-700">Active</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              <span className="text-sm font-semibold text-rose-700">Inactive</span>
            </div>
          )}
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
            <Card className="shadow-sm border-zinc-200 bg-white">
              <CardHeader className="pb-4 border-b border-zinc-100">
                <CardTitle className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-zinc-500" />
                  General Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-semibold text-zinc-700 block">
                    Shop Name <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    minLength={2}
                    defaultValue={shop.name}
                    className="bg-zinc-50/50 focus-visible:ring-zinc-800"
                    placeholder="Enter your shop's official name"
                  />
                  <p className="text-[13px] text-zinc-500">
                    This is the name that students will see when browsing shops.
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="description" className="text-sm font-semibold text-zinc-700 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={shop.description || ""}
                    className="bg-zinc-50/50 resize-none focus-visible:ring-zinc-800"
                    placeholder="Describe your shop's specialties, history, or atmosphere..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar column */}
          <div className="space-y-8">
            <Card className="shadow-sm border-zinc-200 bg-white">
              <CardHeader className="pb-4 border-b border-zinc-100">
                <CardTitle className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-zinc-500" />
                  Media
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="aspect-video relative rounded-xl overflow-hidden bg-zinc-50 border-2 border-dashed border-zinc-200 group transition-all hover:border-zinc-300">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Shop preview text"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setPreviewUrl("")}
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
                        <ImageIcon className="w-10 h-10 mb-3 text-zinc-300 group-hover:text-zinc-400 transition-colors" />
                        <span className="text-sm font-medium">No cover image</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="image_url" className="text-sm font-semibold text-zinc-700 block">
                      Banner Image URL
                    </Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      type="url"
                      defaultValue={shop.image_url ?? ""}
                      onChange={(e) => setPreviewUrl(e.target.value)}
                      className="bg-zinc-50/50 focus-visible:ring-zinc-800"
                      placeholder="https://..."
                    />
                    <p className="text-[13px] text-zinc-500">
                      Provide a direct link to an image (e.g., .jpg, .png).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] group relative overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-10 bg-gradient-to-b from-transparent via-transparent to-black" />
              <div className="flex items-center justify-center gap-2 z-10 relative">
                <Save className={`w-5 h-5 ${loading ? "animate-pulse" : "group-hover:-translate-y-0.5 transition-transform"}`} />
                <span>{loading ? "Saving Changes..." : "Save Changes"}</span>
              </div>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
