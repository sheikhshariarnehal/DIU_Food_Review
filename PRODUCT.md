# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

1. **DIU Students (Primary Consumer)**: Undergraduate and graduate students at Daffodil International University searching for quality food on campus, checking prices, rating shops and individual menu items, and discovering top-rated dining spots.
2. **Campus Food Shop Owners (Primary Operator)**: Campus food vendors managing menu items, pricing, real-time stock availability, and building trust by replying to student reviews.
3. **Super Administrators (Oversight)**: Campus culinary/facilities managers monitoring shop operations, inviting shop owners via email, managing user statuses, and maintaining review integrity.

## Product Purpose

DIU Food Review is a community-driven dining discovery, rating, and feedback ecosystem tailored specifically for Daffodil International University. It exists to elevate food quality across the DIU campus by providing transparent, verified student reviews, individual dish-level ratings, live leaderboards, and direct merchant-student engagement.

## Positioning

Unlike generic public review platforms (like Google Maps or Yelp), DIU Food Review is deeply localized to the DIU campus environment. It features verified student feedback, dish-by-dish micro-ratings (e.g. rating a specific burger or biryani rather than only the whole stall), a competitive live leaderboard, and integrated vendor response channels.

## Operating Context

- **Student Context**: Rapid mobile-first lookups between classes, checking prices before ordering, searching for specific cravings (e.g., coffee, khichuri, burgers), writing quick ratings after meals.
- **Shop Owner Context**: Fast updates to item prices, marking items as "Available" vs "Stock Out" during lunch rush hours, answering student feedback from a clean desktop/tablet dashboard.
- **Admin Context**: Oversight of all campus vendors, inviting new shop owners by email, reviewing platform health and review moderation.

## Capabilities and Constraints

### Capabilities
- Real-time search across shops, descriptions, and active dishes
- Dual-layer fractional star rating rendering (e.g. 75% fill for 3.75 stars)
- Individual menu item review dialogs and aggregate dish scores
- Live campus leaderboard with top-rated podium and statistical badges
- Verified student reviews with shop owner direct reply threading
- Email invitation workflow for shop owner onboarding
- Role-based access control (Student, Shop Owner, Super Admin) powered by Supabase Auth and RLS

### Constraints
- Web application built with Next.js 16 (App Router), React 19, Tailwind CSS, and Lucide Icons
- Supabase SSR backend with PostgreSQL Row Level Security (RLS) policies
- Responsive across mobile smartphones (primary student surface) and desktop browsers (owner/admin dashboards)

## Brand Commitments

- **Name**: DIU Food Review
- **Colors**: Vibrant DIU emerald/green accents (#16a34a, #22c55e), clean slate and zinc neutrals, warm amber stars (#f59e0b)
- **Tone & Voice**: Authentic, collegiate, trustworthy, clear, and encouraging
- **Aesthetic**: Premium modern web craft, glassmorphism cards, micro-interactions, responsive typography, and clear visual hierarchy

## Evidence on Hand

- Active Next.js 16 codebase with all routes (`/`, `/shops`, `/shops/[shopId]`, `/leaderboard`, `/my-reviews`, `/owner/*`, `/admin/*`)
- Supabase schema migrations for profiles, shops, menu items, reviews, review replies, and menu item reviews
- Live production deployment at `https://diu-food-review.vercel.app`

## Product Principles

1. **Speed & Scanability First**: Students and owners need answers in seconds—menu prices, average dish ratings, and stock status must be instantly readable.
2. **Honest & Direct Feedback**: Verified student reviews paired with transparent vendor replies foster mutual accountability and better campus food quality.
3. **Dish-Level Granularity**: Overall stall ratings aren't enough; specific ratings on individual food items help students know exactly what to order.
4. **Resilient & Fallback-Safe**: Broken image links or missing descriptions should never disrupt layout or degrade the user experience.

## Accessibility & Inclusion

- Semantic HTML5 structure with accessible buttons, dialogs, and interactive star controls (ARIA labels, keyboard navigation).
- WCAG AA contrast compliance across light-mode cards, badges, and text elements.
- Clean mobile touch targets (minimum 44x44px for buttons and review actions).
