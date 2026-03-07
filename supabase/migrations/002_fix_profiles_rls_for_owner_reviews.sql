-- ============================================================
-- Fix: Allow shop owners to see reviewer profiles
-- Previously, profiles RLS only allowed users to view their own
-- profile, causing `profiles` to return null in joined queries
-- on the owner reviews page (showed "Anonymous" instead of names).
-- ============================================================

-- Allow shop owners to view profiles of users who reviewed their shop
CREATE POLICY "Shop owners can view reviewer profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM public.reviews r
      JOIN public.shops s ON s.id = r.shop_id
      WHERE r.user_id = profiles.id
        AND s.owner_id = auth.uid()
    )
  );

-- Allow any authenticated user to view profiles
-- (reviewer names are shown on public shop pages as well)
CREATE POLICY "Authenticated users can view profiles" ON public.profiles
  FOR SELECT USING (auth.uid() IS NOT NULL);
