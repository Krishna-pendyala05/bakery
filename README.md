# 🎂 The Sweet Spot — Artisanal Bakery Website

A modern, premium e-commerce website for a local Indian bakery selling artisanal cakes online. Built for performance, SEO, and a delightful user experience.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16+ (App Router) — TypeScript |
| **Styling** | Vanilla CSS Modules (no Tailwind CSS) |
| **Database** | Prisma ORM + SQLite (dev) / Cloudflare D1 (prod) |
| **Auth** | Custom OTP-based (SMS/Email) for users; Email+Password for admins |
| **Payment** | Razorpay (UPI, Cards, Net Banking) |
| **Hosting** | Cloudflare Pages + Cloudflare Workers |
| **Analytics** | Cloudflare Web Analytics |
| **CI/CD** | GitHub Actions (lint + type-check + build + AI review) |

---

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # Server-only API routes
│   │   ├── auth/           # OTP send/verify endpoints
│   │   ├── products/       # Cake catalog endpoints
│   │   ├── orders/         # Order management
│   │   ├── payment/        # Razorpay create-order, verify, webhook
│   │   └── admin/          # Admin-only CRUD endpoints
│   ├── (customer)/         # Customer-facing pages (/, /cakes, /checkout, /orders)
│   ├── admin/              # Admin dashboard (hidden, not linked publicly)
│   ├── globals.css         # Design tokens and global styles ONLY
│   └── layout.tsx          # Root layout (fonts, providers)
├── components/
│   ├── ui/                 # Atomic: Button, Card, Input, Modal
│   ├── layout/             # Navbar, Footer, CookieBanner
│   ├── catalog/            # CakeCard, CakeGrid, FilterBar, CakeModal
│   └── checkout/           # MiniCart, CheckoutForm, CartSummary
├── context/                # CartContext, AuthContext
├── hooks/                  # useCart, useAuth, useLocalStorage
├── lib/                    # prisma.ts (singleton), razorpay.ts
├── types/                  # Shared TypeScript interfaces
└── utils/                  # formatINR, formatDate, generateOTP
prisma/
├── schema.prisma           # DB schema
├── migrations/             # Migration history (committed)
└── seed.ts                 # Dev data seed
.github/
├── workflows/pr-review.yml # CI/CD + AI review pipeline
└── docs/                   # Architecture docs for AI reviewer
```

---

## Development Rules (Must Follow)

1. **No Tailwind CSS** — use CSS Modules only.
2. **CSS variables** from `globals.css` `:root` — never hardcode colors.
3. **Server Components by default** — add `'use client'` only for interactivity/browser APIs.
4. **Never expose secrets** on the client — keep all API keys server-side only.
5. **Component folder pattern**: Each component lives in its own folder with `Component.tsx`, `Component.module.css`, and `index.ts`.
6. **Naming**: `PascalCase` for components, `camelCase` for hooks/utils, `UPPER_SNAKE_CASE` for constants.
7. **JSDoc** on all hooks, utilities, and context exports.
8. **Every PR** must pass: `npm run lint`, `npm run type-check`, `npm run build`.

---

## Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Krishna-pendyala05/bakery.git
cd bakery

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Fill in the values in .env.local

# 4. Run database migrations and seed
npx prisma migrate dev
npx prisma db seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run type-check` | Run TypeScript compiler check |
| `npx prisma migrate dev` | Apply database migrations |
| `npx prisma db seed` | Seed the database |
| `docker compose up --build` | Run via Docker |

---

## Branch Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code |
| `develop` | Integration branch |
| `feat/phase-*` | Feature branches per implementation phase |

All changes go through a PR review. The GitHub Actions pipeline runs automated quality checks and an AI architecture review on every PR.

---

## Environment Variables

See `.env.example` for the full list of required environment variables. Never commit `.env.local` or `.env`.
