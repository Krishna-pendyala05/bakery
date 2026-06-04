# Bakery Website - Implementation Plan (CI Reference)

This document is read by the AI PR Review Agent to validate pull requests against the planned implementation.

## Tech Stack
- **Framework**: Next.js 16+ App Router with TypeScript
- **Styling**: Vanilla CSS Modules only (NO Tailwind CSS)
- **Database**: Prisma ORM with SQLite
- **State**: React Context + localStorage (CartContext)
- **Runtime**: Node.js 20

## Folder Structure Rules
```
src/
  app/              # Next.js pages, layouts, API routes
    api/            # Server-only route handlers
    globals.css     # Design tokens and global styles ONLY
    layout.tsx      # Root layout with CartProvider
  components/
    ui/             # Atomic: Button, Card, Input, Modal
    layout/         # Navbar, Footer
    catalog/        # CakeCard, FilterBar, CakeGrid
    checkout/       # MiniCart, CheckoutForm, CartSummary
  context/          # CartContext.tsx
  hooks/            # Custom hooks (useXxx pattern)
  lib/              # prisma.ts singleton
  types/            # Shared TS interfaces
  utils/            # formatINR, formatDate etc.
prisma/
  schema.prisma     # Product and Order models
  seed.ts           # Initial product seeding
.github/
  workflows/        # CI/CD definitions
  docs/             # Architecture documents for AI agent
```

## Phase Checklist

### Phase 1 - Foundation (Branch: feat/phase-1-foundation) ✅
- [x] Next.js + TypeScript + ESLint setup (no Tailwind)
- [x] Public assets in /public/images and /public/videos
- [x] prisma/schema.prisma with Product and Order models
- [x] prisma/seed.ts with 6 cake products
- [x] src/lib/prisma.ts singleton
- [x] package.json scripts: dev, build, start, lint, type-check, seed

### Phase 2 - Design & Layout (Branch: feat/phase-2-3-design-and-cart) ✅
- [x] Playfair Display + Outfit fonts in layout.tsx
- [x] CSS custom properties in globals.css (colors, shadows, fonts, transitions)
- [x] Navbar component (sticky, glassmorphism, responsive)
- [x] Footer component (dark cocoa, contact details, compliance links)
- [x] Button, Card, Input atomic UI components

### Phase 3 - Cart State (Branch: feat/phase-2-3-design-and-cart) ✅
- [x] CartContext.tsx (add, remove, updateQuantity, clearCart)
- [x] localStorage hydration (async, no SSR mismatch)
- [x] MiniCart slide-out drawer component

### Phase 4 - Core Pages (Branch: feat/phase-4-core-pages) 🔜
- [ ] Landing page with hero video
- [ ] Cakes catalog page (server-fetched from DB)
- [ ] Checkout wizard (multi-step)

### Phase 5 - Orders & Admin (Branch: feat/phase-5-orders-admin) 🔜
- [ ] POST /api/checkout/create-order route
- [ ] Admin dashboard with order management

### Phase 6 - Docker & DevOps (Branch: feat/phase-6-docker) 🔜
- [ ] Dockerfile (multi-stage, standalone)
- [ ] docker-compose.yml with SQLite volume
- [ ] CI/CD workflow verification

## Critical Rules for AI Reviewer
1. Reject any use of Tailwind CSS classes.
2. Reject any hardcoded hex colors in component files (must use CSS vars).
3. Reject `'use client'` on components that do not need browser APIs or interactivity.
4. Reject API secrets (keys, tokens) anywhere outside server-side files.
5. Reject components placed outside the documented folder structure.
6. Flag missing index.ts barrel exports in component folders.
7. Flag missing JSDoc on hooks and utility functions.
