"use client";

import { useState } from "react";
import { createOwnShop } from "@/app/actions/shop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateShopForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = await createOwnShop(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.reload();
    }
    setLoading(false);
  }

  return (
    <Card className="w-full max-w-xl mx-auto border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Shop Details</CardTitle>
        <CardDescription>
          Fill in the information below to create your shop profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6">
            {error}
          </div>
        )}

        <form id="create-shop-form" action={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Shop Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              placeholder="e.g. Campus Burger & Grill"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="Describe your shop, specialties, opening hours, etc."
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Shop Image URL (optional)</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              placeholder="https://example.com/shop-image.jpg"
            />
            <p className="text-[0.8rem] text-muted-foreground mt-1">
              Paste a direct link to your shop&apos;s banner image
            </p>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          form="create-shop-form"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? "Creating Shop..." : "Create My Shop"}
        </Button>
      </CardFooter>
    </Card>
  );
}
