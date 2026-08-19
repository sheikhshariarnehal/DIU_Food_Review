-- ============================================================
-- Migration 005: Menu Item Review Replies & Owner Access
-- Adds reply capabilities to dish reviews for shop owners.
-- ============================================================

ALTER TABLE public.menu_item_reviews 
  ADD COLUMN IF NOT EXISTS reply TEXT,
  ADD COLUMN IF NOT EXISTS reply_created_at TIMESTAMPTZ;

-- Drop policy if exists to avoid conflicts
DROP POLICY IF EXISTS "Shop owners can update reply on their menu item reviews" ON public.menu_item_reviews;

-- Allow shop owners (and super admins) to add/edit replies on menu item reviews
CREATE POLICY "Shop owners can update reply on their menu item reviews" ON public.menu_item_reviews
  FOR UPDATE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.menu_items mi
      JOIN public.shops s ON s.id = mi.shop_id
      WHERE mi.id = menu_item_reviews.menu_item_id
      AND (s.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'
      ))
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.menu_items mi
      JOIN public.shops s ON s.id = mi.shop_id
      WHERE mi.id = menu_item_reviews.menu_item_id
      AND (s.owner_id = auth.uid() OR EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'
      ))
    )
  );
