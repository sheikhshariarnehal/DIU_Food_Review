"use client";

import { useState } from "react";
import { updateOwnShop } from "@/app/actions/shop";
import { Shop } from "@/lib/types/database";
import { Save, Store, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { Card, CardHeader, CardContent, CardAction, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
    <div className="max-w-3xl mx-auto space-y-4 px-0">

      {/* ── Page Header ── */}
      <Card className="py-0">
        <CardHeader className="py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              <Store className="w-4 h-4 text-gray-500" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-base font-semibold text-gray-900">Shop Settings</CardTitle>
              <CardDescription className="text-xs text-gray-400 mt-0.5">Update your shop&apos;s profile and appearance</CardDescription>
            </div>
          </div>
          <CardAction>
            {shop.is_active ? (
              <Badge variant="outline" className="text-[11px] text-green-700 border-green-200 bg-green-50">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Active
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[11px] text-red-700 border-red-200 bg-red-50">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Inactive
              </Badge>
            )}
          </CardAction>
        </CardHeader>
      </Card>

      {/* ── Alerts ── */}
      {error && (
        <div className="flex items-center gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2.5 rounded-lg border border-green-200 bg-green-50 px-3.5 py-2.5 text-sm text-green-700">
          <CheckCircle2 className="w-4 h-4 shrink-0" strokeWidth={1.5} />
          Shop details saved successfully.
        </div>
      )}

      {/* ── Form ── */}
      <form action={handleSubmit} className="space-y-4">

        {/* General Info */}
        <Card className="py-0 gap-0">
          <CardHeader className="py-3 border-b">
            <CardTitle className="text-sm font-semibold">General Information</CardTitle>
          </CardHeader>
          <CardContent className="py-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Shop Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                defaultValue={shop.name}
                placeholder="e.g. Campus Burger & Grill"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                The name students will see when browsing shops.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={shop.description}
                placeholder="Describe your shop's specialties, opening hours, etc."
                className="resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="py-0 gap-0">
          <CardHeader className="py-3 border-b">
            <CardTitle className="text-sm font-semibold">Shop Image</CardTitle>
          </CardHeader>
          <CardContent className="py-4 space-y-4">
            {/* Preview */}
            <div className="aspect-video relative rounded-lg overflow-hidden bg-gray-50 border border-dashed border-gray-200">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Shop preview"
                  fill
                  className="object-cover"
                  onError={() => setPreviewUrl("")}
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                  <ImageIcon className="w-8 h-8 mb-2" strokeWidth={1.5} />
                  <span className="text-xs font-medium">No image set</span>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                type="url"
                defaultValue={shop.image_url ?? ""}
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <p className="text-[0.8rem] text-muted-foreground">
                Paste a direct link to a .jpg or .png image.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
        >
          <Save className={`w-4 h-4 ${loading ? "animate-pulse" : ""}`} />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
}
