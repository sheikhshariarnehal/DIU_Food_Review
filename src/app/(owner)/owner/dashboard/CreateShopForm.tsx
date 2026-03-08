"use client";

import { useState } from "react";
import { createOwnShop } from "@/app/actions/shop";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function CreateShopForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);

    const result = await createOwnShop(formData);

    if (result?.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success("Shop created successfully!");
      window.location.reload();
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-base font-bold text-gray-900">Shop Details</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          Fill in the information below to create your shop profile.
        </p>
      </div>

      <form action={handleSubmit} className="space-y-5 p-5">
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
            placeholder="e.g. Campus Burger & Grill"
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-300"
          />
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
            rows={3}
            placeholder="Describe your shop, specialties, opening hours, etc."
            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-300"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="image_url"
            className="block text-sm font-medium text-gray-700"
          >
            Shop Image URL (optional)
          </label>
          <input
            id="image_url"
            name="image_url"
            type="url"
            placeholder="https://example.com/shop-image.jpg"
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-gray-300 focus:bg-white focus:ring-1 focus:ring-gray-300"
          />
          <p className="text-xs text-gray-400">
            Paste a direct link to your shop&apos;s banner image
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:opacity-50"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Creating Shop..." : "Create My Shop"}
        </button>
      </form>
    </div>
  );
}
