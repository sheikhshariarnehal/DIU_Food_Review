-- Migration 005: Add reply column and update RLS for menu_item_reviews
-- Allows shop owners to reply to student reviews on their menu items

ALTER TABLE public.menu_item_reviews 
ADD COLUMN IF NOT EXISTS reply text,
ADD COLUMN IF NOT EXISTS reply_created_at timestamptz;

-- Policy: Shop owners can update reply for items belonging to their shop
DROP POLICY IF EXISTS "Shop owners can reply to dish reviews" ON public.menu_item_reviews;

CREATE POLICY "Shop owners can reply to dish reviews"
ON public.menu_item_reviews
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.menu_items mi
    JOIN public.shops s ON s.id = mi.shop_id
    WHERE mi.id = menu_item_reviews.menu_item_id
    AND s.owner_id = auth.uid()
  )
);
