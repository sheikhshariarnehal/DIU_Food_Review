// Database type definitions matching the Supabase schema

export type UserRole = "student" | "shop_owner" | "super_admin";
export type UserStatus = "active" | "pending" | "suspended";
export type MenuItemStatus = "active" | "stock_out";

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  is_diu_verified: boolean;
  avatar_url: string | null;
  created_at: string;
}

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface MenuItem {
  id: string;
  shop_id: string;
  name: string;
  description: string;
  price: number;
  status: MenuItemStatus;
  image_url: string | null;
  created_at: string;
}

export interface MenuItemWithRating extends MenuItem {
  avg_rating?: number;
  review_count?: number;
}

export interface Review {
  id: string;
  shop_id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
}

export interface ReviewReply {
  id: string;
  review_id: string;
  owner_id: string;
  body: string;
  created_at: string;
}

export interface MenuItemReview {
  id: string;
  menu_item_id: string;
  user_id: string;
  rating: number;
  body: string;
  created_at: string;
}

export interface MenuItemReviewWithProfile extends MenuItemReview {
  profiles: Pick<Profile, "full_name" | "avatar_url">;
}

export interface LeaderboardEntry {
  shop_id: string;
  shop_name: string;
  shop_image_url: string | null;
  avg_rating: number;
  review_count: number;
}

export interface ShopWithRating extends Shop {
  avg_rating: number;
  review_count: number;
}

export interface ReviewWithProfile extends Review {
  profiles: Pick<Profile, "full_name" | "avatar_url">;
  review_replies: ReviewReply[] | ReviewReply | null;
}

// Supabase Database type helper
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      shops: {
        Row: Shop;
        Insert: Omit<Shop, "id" | "created_at">;
        Update: Partial<Omit<Shop, "id" | "created_at">>;
      };
      menu_items: {
        Row: MenuItem;
        Insert: Omit<MenuItem, "id" | "created_at">;
        Update: Partial<Omit<MenuItem, "id" | "created_at">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at">;
        Update: Partial<Omit<Review, "id" | "created_at">>;
      };
      review_replies: {
        Row: ReviewReply;
        Insert: Omit<ReviewReply, "id" | "created_at">;
        Update: Partial<Omit<ReviewReply, "id" | "created_at">>;
      };
      menu_item_reviews: {
        Row: MenuItemReview;
        Insert: Omit<MenuItemReview, "id" | "created_at">;
        Update: Partial<Omit<MenuItemReview, "id" | "created_at">>;
      };
    };
    Views: {
      leaderboard_view: {
        Row: LeaderboardEntry;
      };
    };
    Functions: {
      get_shop_average_rating: {
        Args: { p_shop_id: string };
        Returns: { avg_rating: number; review_count: number }[];
      };
      get_menu_item_average_rating: {
        Args: { p_menu_item_id: string };
        Returns: { avg_rating: number; review_count: number }[];
      };
    };
  };
}
