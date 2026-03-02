-- ============================================================
-- DIU Food Review & Rating System — Full Database Schema
-- Run this in the Supabase SQL Editor or via CLI migrations
-- ============================================================

-- ========================
-- 1. PROFILES TABLE
-- ========================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'shop_owner', 'super_admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  is_diu_verified BOOLEAN NOT NULL DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Super admins can update any profile" ON public.profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can delete profiles" ON public.profiles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- ========================
-- 2. SHOPS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Shops RLS policies (public read)
CREATE POLICY "Anyone can view active shops" ON public.shops
  FOR SELECT USING (TRUE);

CREATE POLICY "Super admins can insert shops" ON public.shops
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

CREATE POLICY "Shop owners can update own shop" ON public.shops
  FOR UPDATE USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Super admins can update any shop" ON public.shops
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can delete shops" ON public.shops
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'super_admin'
    )
  );

-- ========================
-- 3. MENU ITEMS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'stock_out')),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

-- Menu Items RLS policies (public read, owner write)
CREATE POLICY "Anyone can view menu items" ON public.menu_items
  FOR SELECT USING (TRUE);

CREATE POLICY "Shop owners can insert menu items for own shop" ON public.menu_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shops s WHERE s.id = shop_id AND s.owner_id = auth.uid()
    )
  );

CREATE POLICY "Shop owners can update menu items for own shop" ON public.menu_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.shops s WHERE s.id = shop_id AND s.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.shops s WHERE s.id = shop_id AND s.owner_id = auth.uid()
    )
  );

CREATE POLICY "Shop owners can delete menu items for own shop" ON public.menu_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.shops s WHERE s.id = shop_id AND s.owner_id = auth.uid()
    )
  );

-- ========================
-- 4. REVIEWS TABLE
-- ========================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Enforce one review per user per shop
  UNIQUE (shop_id, user_id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Reviews RLS policies (public read, insert-only for authenticated students)
CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (TRUE);

CREATE POLICY "Authenticated students can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
      AND p.role = 'student'
      AND p.status = 'active'
    )
  );

-- No UPDATE or DELETE policies for users — reviews are immutable

-- ========================
-- 5. REVIEW REPLIES TABLE
-- ========================
CREATE TABLE IF NOT EXISTS public.review_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- One reply per review
  UNIQUE (review_id)
);

ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;

-- Review Replies RLS policies
CREATE POLICY "Anyone can view review replies" ON public.review_replies
  FOR SELECT USING (TRUE);

CREATE POLICY "Shop owners can reply to reviews on their shop" ON public.review_replies
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.reviews r
      JOIN public.shops s ON s.id = r.shop_id
      WHERE r.id = review_id AND s.owner_id = auth.uid()
    )
  );

-- No UPDATE or DELETE on replies

-- ========================
-- 6. INDEXES FOR PERFORMANCE
-- ========================
CREATE INDEX IF NOT EXISTS idx_reviews_shop_id ON public.reviews(shop_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_shop_id ON public.menu_items(shop_id);
CREATE INDEX IF NOT EXISTS idx_shops_owner_id ON public.shops(owner_id);
CREATE INDEX IF NOT EXISTS idx_review_replies_review_id ON public.review_replies(review_id);

-- ========================
-- 7. FUNCTION: Get Shop Average Rating
-- ========================
CREATE OR REPLACE FUNCTION public.get_shop_average_rating(p_shop_id UUID)
RETURNS TABLE(avg_rating NUMERIC, review_count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(ROUND(AVG(r.rating)::NUMERIC, 2), 0) AS avg_rating,
    COUNT(r.id) AS review_count
  FROM public.reviews r
  WHERE r.shop_id = p_shop_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- ========================
-- 8. LEADERBOARD VIEW
-- ========================
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT
  s.id AS shop_id,
  s.name AS shop_name,
  s.image_url AS shop_image_url,
  COALESCE(ROUND(AVG(r.rating)::NUMERIC, 2), 0) AS avg_rating,
  COUNT(r.id) AS review_count
FROM public.shops s
LEFT JOIN public.reviews r ON r.shop_id = s.id
WHERE s.is_active = TRUE
GROUP BY s.id, s.name, s.image_url
HAVING COUNT(r.id) >= 5
ORDER BY avg_rating DESC;

-- ========================
-- 9. TRIGGER: Auto-create profile on signup
-- ========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, status, is_diu_verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    CASE
      WHEN COALESCE(NEW.raw_user_meta_data->>'role', 'student') = 'shop_owner' THEN 'pending'
      ELSE 'active'
    END,
    CASE
      WHEN NEW.email LIKE '%@diu.edu.bd' THEN TRUE
      ELSE FALSE
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if any
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
