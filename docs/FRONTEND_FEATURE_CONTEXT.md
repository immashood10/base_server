# Frontend Feature Context (multi-vendor)

This file documents the frontend in a feature-wise format.

Frontend root:
`C:\Users\STAR-\Desktop\multi-vendor e-commerce\multi-vendor`

## Core Platform

### Framework and Runtime
- Next.js App Router (`next@16.2.3`)
- React (`react@19.2.4`)
- Mixed TS/JS codebase
- Tailwind CSS v4

### App Shell
- Root layout: `app/layout.tsx`
- Global providers: `components/Providers.jsx`
  - `AuthProvider`
  - `CartProvider`
- Global nav: `components/navbar/Navbar.jsx`

### API Client
- File: `lib/api.js`
- Wrapper: `apiFetch(endpoint, options)`
- Sends:
  - `Authorization` bearer token from localStorage (if present)
  - `credentials: 'include'` for cookie-based auth
- Supports helper methods: `api.get/post/put/delete`

## Feature: Authentication

### Pages
- `app/login/page.tsx`
- `app/register/page.tsx`

### State Management
- Main implementation: `app/context/AuthContext.tsx`
- Compatibility re-export: `context/AuthContext.js`
- Derived flags:
  - `isAuthenticated`
  - `isBuyer`
  - `isSeller`
  - `isAdmin`

### Behavior
- Login requests `/api/login`.
- Register requests `/api/register`.
- Token + user saved to localStorage.
- Role-based redirects to dashboard routes.

## Feature: Catalog Browsing

### Product Listing
- Page: `app/products/page.tsx`
- Uses local mock dataset + client filtering/sorting.

### Product Detail
- Page: `app/products/[id]/page.tsx`
- Uses local mock details + quantity selector.

### Cards
- `components/cards/ProductCard.jsx`
- `components/cards/ServiceCard.jsx`
- Both can push items into cart.

## Feature: Cart and Checkout

### Cart State
- Main implementation: `app/context/CartContext.tsx`
- Compatibility re-export: `context/CartContext.js`
- Persisted in localStorage.

### Cart Page
- `app/cart/page.js`
- Supports quantity update, remove, shipping calculation.

### Checkout
- `app/checkout/page.tsx`
- Collects shipping/payment inputs.
- Simulated checkout (timeout), then clears cart and redirects.

## Feature: Dashboard System

### Shared Dashboard UX
- Sidebar: `components/dashboard/Sidebar.jsx`
- Stats UI: `components/dashboard/StatsCard.jsx`

### Pages
- Generic dashboard: `app/dashboard/page.tsx`
- Admin dashboard: `app/dashboard/admin/page.tsx`
- Seller dashboard: `app/dashboard/seller/page.tsx`
- Buyer dashboard: `app/dashboard/buyer/page.tsx`

### Behavior
- Role-gated navigation driven by `AuthContext`.
- Most dashboard tables/charts currently use mock/static data.
- Seller page includes modal forms for new product/service drafts.

## Feature: Route Protection

- Component: `components/ui/ProtectedRoute.jsx`
- Redirect strategy:
  - unauthenticated -> `/login`
  - wrong role -> `/dashboard`
- Some pages also implement direct guard logic in-page.

## Backend Contract Alignment Notes

### Rewrite vs API Base
- `next.config.ts` rewrite currently maps `/api/v1/:path*`.
- `lib/api.js` currently calls `/api/...`.
- This mismatch can break proxying if not standardized.

### Token Transport
- Frontend supports both bearer token and cookie credentials.
- Backend currently has mixed auth implementations; needs one shared contract.

## Current Missing / Partial Features

- `/services` route linked in navbar/home but page is missing.
- Product/service CRUD endpoints are assumed by UI but not fully wired end-to-end.
- Checkout is UI-only simulation, no order API call yet.

## Suggested Feature-Wise Implementation Order

1. Auth contract unification (request/response + token transport).
2. API base/rewrite alignment (`/api` vs `/api/v1`).
3. Product listing/detail from backend instead of mock data.
4. Order placement and buyer order history APIs.
5. Seller listing management APIs and dashboard integration.
6. Admin moderation/management APIs and table wiring.

