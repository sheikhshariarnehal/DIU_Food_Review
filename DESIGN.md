---
name: DIU Food Review
description: Campus-tailored dining discovery, individual dish ratings, and student feedback platform
colors:
  primary: "#16a34a"
  primary-dark: "#15803d"
  primary-light: "#dcfce7"
  secondary: "#1e40af"
  secondary-light: "#eff6ff"
  accent-amber: "#f59e0b"
  accent-amber-light: "#fef3c7"
  neutral-bg: "#ffffff"
  neutral-surface: "#f9fafb"
  neutral-surface-subtle: "#f3f4f6"
  neutral-border: "#e5e7eb"
  neutral-text: "#111827"
  neutral-text-muted: "#6b7280"
  neutral-text-subtle: "#9ca3af"
typography:
  display:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.25rem, 5vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.025em"
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
  button-secondary:
    backgroundColor: "{colors.neutral-surface-subtle}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.md}"
    padding: "10px 18px"
  card-shop:
    backgroundColor: "{colors.neutral-bg}"
    rounded: "{rounded.lg}"
    padding: "16px"
  chip-filter:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text-muted}"
    rounded: "{rounded.md}"
    padding: "8px 14px"
  chip-filter-active:
    backgroundColor: "{colors.neutral-text}"
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    padding: "8px 14px"
---

# Design System: DIU Food Review

## Overview

**Creative North Star: "The Campus Culinary Pulse"**

DIU Food Review's design system is built for the high-tempo rhythm of university life. Clean, energetic, and transparent, the interface balances punchy collegiate emerald accents with calm white surfaces and subtle micro-borders. It treats food information as instant visual data: large dish imagery, immediate price markers, clear stock indicators, and pixel-exact rating stars give students and food shop owners complete clarity at a glance.

The visual language avoids gratuitous skeuomorphism in favor of tactile modern web craft: 16px soft-radius cards, crisp 1px borders (`#f3f4f6`), glassmorphism floating badges, and silky hover micro-interactions that make exploring campus eats feel responsive and alive.

**Key Characteristics:**
- **Vibrant Campus Emerald**: DIU green (`#16a34a`) drives focal calls-to-action and authentic verified badges.
- **Micro-Structured Depth**: Minimalist soft borders and low-spread ambient shadows over heavy blur drops.
- **Dish-Level Precision**: Floating pill badges with dual-layer fractional rating stars for high scannability.
- **Vendor-Student Dual-Tone**: Crisp white cards for consumer content paired with subtle emerald-tinted threaded reply panels for vendor interactions.

## Colors

The color palette is anchored by DIU Collegiate Emerald, balanced with clean neutral whites and grays, accented by warm star amber.

### Primary
- **DIU Emerald Green** (`#16a34a`): Primary brand color used for main action buttons, verified student pills, active indicators, and interactive focus states.
- **DIU Emerald Deep** (`#15803d`): Used for button hover states and high-contrast text on light green backgrounds.
- **DIU Emerald Surface** (`#dcfce7`): Light tint for badges, icon containers, and owner reply backgrounds.

### Secondary
- **DIU Academic Blue** (`#1e40af`): Secondary brand color for statistics, analytics links, and leaderboard highlights.

### Accent
- **Amber Rating Gold** (`#f59e0b`): Dedicated exclusively to rating stars, trophy medals, and critical score badges.

### Neutral
- **Canvas White** (`#ffffff`): Card surfaces, modal containers, and default background.
- **Surface Gray** (`#f9fafb`): Page background, toolbar containers, and input default backgrounds.
- **Border Gray** (`#e5e7eb` / `#f3f4f6`): Subtle card borders, dividers, and input outlines.
- **Text Ink** (`#111827`): High-contrast primary headings, item names, and prices.
- **Text Muted** (`#6b7280`): Descriptions, meta details, and secondary timestamps.

### Named Rules
**The Single-Accent Authority Rule.** Green is reserved for primary actions, success states, and verified indicators. Amber is reserved exclusively for scores and ratings. Never use green for ratings or amber for buttons.

## Typography

**Display Font:** Inter (fallback: system-ui, sans-serif)  
**Body Font:** Inter (fallback: system-ui, sans-serif)  

**Character:** Modern, clean, and highly legible with proportional numeric tabular figures for prices and ratings.

### Hierarchy
- **Display** (800 font-weight, `clamp(2.25rem, 5vw, 3.75rem)`, 1.1 line-height): Hero banners and major page titles.
- **Headline** (700 font-weight, 1.5rem, 1.3 line-height): Section headers and primary view titles.
- **Title** (600 font-weight, 1.125rem, 1.4 line-height): Shop names, menu item titles, and modal headers.
- **Body** (400 font-weight, 0.875rem, 1.5 line-height): Reviews, shop descriptions, and general copy.
- **Label** (600 font-weight, 0.75rem, 1.4 line-height, uppercase tracking): Badges, table headers, and category pills.

### Named Rules
**The Tabular Price Rule.** All prices (৳) must render in bold sans-serif font with tabular numeric spacing to prevent layout shifts during status updates.

## Layout

- **Grid Model**: 12-column fluid grid system on desktop, collapsing to 2-column on tablets and 1-column on mobile.
- **Container**: Max width 1280px (`max-w-7xl`) centered with `px-4 sm:px-6 lg:px-8` responsive padding.
- **Card Rhythm**: 16px to 20px gap (`gap-4 sm:gap-5`) between shop and dish cards.
- **Density**: Moderate-high density on dashboards for rapid scanning; spacious layout on hero and detail pages.

## Elevation & Depth

Surfaces rely primarily on clean tonal contrast and subtle 1px borders (`#f3f4f6`), elevated by delicate ambient shadows on hover.

### Shadow Vocabulary
- **Rest Shadow** (`box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`): Standard card and input shadow at rest.
- **Hover Lift** (`box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.08)`): Interactive card hover elevation with a -2px Y-translation.
- **Modal Overlay** (`box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1)`): Dialog and drawer elevation.

### Named Rules
**The Rested Surface Rule.** Cards rest flat with subtle 1px borders. Elevation shadows activate strictly as a response to user focus, hover, or modal states.

## Shapes

- **Cards & Modals**: 16px to 24px corner radius (`rounded-2xl` to `rounded-3xl`) for friendly, modern contours.
- **Buttons & Form Fields**: 12px corner radius (`rounded-xl`).
- **Tags & Status Badges**: Pill-shaped (`rounded-full`) for instant category recognition.

## Components

### Buttons
- **Shape**: 12px radius (`rounded-xl`), min-height 40px (desktop) / 44px (touch).
- **Primary**: Solid emerald (`#16a34a`) or dark zinc (`#18181b`) with white text and smooth 150ms hover transition.
- **Outline / Ghost**: 1px subtle border, neutral surface hover (`hover:bg-gray-100`).

### Cards (Shop & Menu Item)
- **Shape**: 16px radius (`rounded-2xl`), overflow hidden, white background.
- **Image Banner**: 16:9 or 44h aspect ratio with object-cover and graceful fallback on load error.
- **Overlays**: Floating frosted pills (`bg-black/65 backdrop-blur-md text-white`) for ratings and availability.

### Rating Component (StarRating)
- **Shape**: Dual-layer SVG stars (base empty star + percentage-clipped filled star) rendering exact float scores.

### Inputs & Filters
- **Shape**: 12px radius (`rounded-xl`), background `#f9fafb`, 1px border `#e5e7eb`, emerald focus ring (`focus:ring-2 focus:ring-emerald-500`).

## Do's and Don'ts

### Do:
- **Do** use `SafeImage` for all user-uploaded and remote shop/dish images to prevent broken layout gaps.
- **Do** display fractional star ratings with exact float text (e.g. `4.3`) alongside star glyphs.
- **Do** format food prices prominently with the currency symbol `৳`.
- **Do** provide clear empty states with icons and reset buttons for search results.

### Don't:
- **Don't** use generic default browser alert boxes or confirm modals; use custom Radix/Tailwind dialogs.
- **Don't** allow review text to cause horizontal layout shifts; enforce `line-clamp` and `truncate` where appropriate.
- **Don't** hardcode external image domains; use Next.js wildcard remote patterns.
- **Don't** hide owner replies inside nested accordions; keep replies directly visible under the reviewer's comment.
