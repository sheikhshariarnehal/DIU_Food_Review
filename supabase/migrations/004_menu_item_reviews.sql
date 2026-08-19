-- ============================================================
-- Migration 004: Menu Item Reviews & Ratings
-- Allows students to rate and review individual menu items.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.menu_item_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Enforce one review per student per menu item
  UNIQUE (menu_item_id, user_id)
);

ALTER TABLE public.menu_item_reviews ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view menu item reviews
CREATE POLICY "Anyone can view menu item reviews" ON public.menu_item_reviews
  FOR SELECT USING (TRUE);

-- 2. Authenticated active students can insert reviews
CREATE POLICY "Students can insert menu item reviews" ON public.menu_item_reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'student'
      AND p.status = 'active'
    )
  );

-- 3. Students can update their own reviews
CREATE POLICY "Students can update own menu item reviews" ON public.menu_item_reviews
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Students or Super Admins can delete reviews
CREATE POLICY "Students or admins can delete menu item reviews" ON public.menu_item_reviews
  FOR DELETE USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'super_admin'
    )
  );

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_menu_item_reviews_item_id ON public.menu_item_reviews(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_menu_item_reviews_user_id ON public.menu_item_reviews(user_id);

-- Function: Get Average Rating for a Menu Item
CREATE OR REPLACE FUNCTION public.get_menu_item_average_rating(p_menu_item_id UUID)
RETURNS TABLE(avg_rating NUMERIC, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(ROUND(AVG(r.rating)::NUMERIC, 2), 0) AS avg_rating,
    COUNT(r.id) AS review_count
  FROM public.menu_item_reviews r
  WHERE r.menu_item_id = p_menu_item_id;
END;
$$ LANGUAGE plpgsql STABLE;
