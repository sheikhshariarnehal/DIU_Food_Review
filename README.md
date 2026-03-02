# DIU Food Review & Rating System

A full-stack food review and rating platform for Daffodil International University (DIU), built with **Next.js 16**, **Supabase**, and **Tailwind CSS**.

---

## Demo Accounts

Use these pre-seeded accounts to test all three roles without signing up.

### 🔴 Super Admin
> Full platform control — manage shops, approve/reject owners, manage users.

| Field    | Value                        |
|----------|------------------------------|
| Email    | `testadmin@diu.edu.bd`       |
| Password | `Test@12345`                 |
| Redirects to | `/admin/dashboard`       |

**What you can test:**
- View system analytics (total shops, users, reviews, avg rating, pending approvals)
- Add / Edit / Delete shops
- Approve or Reject pending shop owner applications
- Change user status (Active / Suspended) with role-based filters

---

### 🟡 Shop Owner
> Manage a single assigned shop — menu items and customer reviews.

| Field    | Value                        |
|----------|------------------------------|
| Email    | `testowner@diu.edu.bd`       |
| Password | `Test@12345`                 |
| Shop     | Campus Burger & Grill        |
| Redirects to | `/owner/dashboard`       |

**What you can test:**
- View shop stats (avg rating, review count, menu item count, status)
- Add / Edit / Delete menu items
- Mark menu items as Stock Out / Active
- View and reply to customer reviews

---

### 🟢 Student
> Browse shops, write reviews, and track your review history.

| Field    | Value                        |
|----------|------------------------------|
| Email    | `teststudent@diu.edu.bd`     |
| Password | `Test@12345`                 |
| Redirects to | `/shops`                 |

**What you can test:**
- Browse all active shops and their menus
- Submit a star rating + written review (one per shop)
- View the leaderboard of top-rated shops
- View your own review history at `/my-reviews`

---

## Demo Shops

Five shops are pre-loaded with menu items:

| Shop | Items |
|------|-------|
| Bismillah Canteen | 5 items |
| Mama's Kitchen | 5 items |
| Campus Burger & Grill *(owned by testowner)* | 5 items |
| Green Leaf Café | 5 items |
| Dhaka Biryani House | 5 items |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase project with the schema from `supabase/migrations/001_initial_schema.sql`

### Environment Variables
Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Run the development server

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database & Auth | Supabase (PostgreSQL + RLS) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Image hosting | Unsplash (remote URLs) |

---

## Role-Based Access

| Route | Role Required |
|-------|--------------|
| `/shops`, `/leaderboard`, `/my-reviews`, `/shops/*` | Any authenticated user |
| `/owner/*` | `shop_owner` with `active` status |
| `/admin/*` | `super_admin` |
