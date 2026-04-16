# Frontend Project Context (multi-vendor)

This document summarizes the frontend at:
`C:\Users\STAR-\Desktop\multi-vendor e-commerce\multi-vendor`

## 1) Stack and Runtime

- Framework: Next.js App Router (`next@16.2.3`)
- UI: React (`react@19.2.4`)
- Language: Mixed TypeScript and JavaScript
- Styling: Tailwind CSS v4 + global CSS
- State: React Context (`AuthContext`, `CartContext`)

## 2) High-Level Structure

- `app/`: App Router pages, route segments, and app-level providers/hooks
- `components/`: UI, cards, navbar, and dashboard components
- `lib/api.js`: fetch wrapper for backend calls
- `app/context/*.tsx`: actual context implementations
- `context/*.js`: bridge exports that re-export from `app/context` for compatibility

## 3) Route Map (Existing Pages)

- `/` Home
- `/products` Product listing
- `/products/[id]` Product detail
- `/cart` Cart
- `/checkout` Checkout
- `/login` Login
- `/register` Register
- `/dashboard` Generic dashboard
- `/dashboard/admin` Admin dashboard
- `/dashboard/seller` Seller dashboard
- `/dashboard/buyer` Buyer dashboard

Notes:
- Navbar links to `/services`, but no `app/services/page.*` currently exists.
- Some dashboard data is static mock data (not API-driven yet).

## 4) App Composition

- `app/layout.tsx` wraps all pages with:
  - `Providers` -> `AuthProvider` + `CartProvider`
  - `Navbar`
- `components/Providers.jsx` uses `@/context/AuthContext` and `@/context/CartContext`, which resolve through `context/*.js` bridge files.

## 5) Auth Flow (Current Frontend Behavior)

- Auth state stored in localStorage:
  - `token`
  - `user`
- `AuthContext` computes:
  - `isAuthenticated`
  - `isBuyer` (`role === "buyer"` OR `"user"`)
  - `isSeller` (`role === "seller"`)
  - `isAdmin` (`role === "admin"`)
- Login:
  - Calls `apiFetch('/login', POST)`
  - Expects `user` and `accessToken` or `token`
  - Redirects by role to `/dashboard/admin|seller|buyer`
- Register:
  - Calls `apiFetch('/register', POST)`
  - Expects token and user
  - Stores credentials and routes to `/dashboard`

## 6) Cart and Checkout Flow

- `CartContext` persists cart in localStorage.
- `ProductCard` and `ServiceCard` call `addToCart(...)`.
- `/cart` calculates shipping by selected country.
- `/checkout` simulates order processing (timeout), then:
  - `clearCart()`
  - redirect to `/dashboard/buyer?order=success`

## 7) Backend Integration and Contract Assumptions

- Frontend API wrapper uses `API_BASE_URL = '/api'` in `lib/api.js`.
- `next.config.ts` rewrite proxies only `/api/v1/:path*` to `http://localhost:5000/api/v1/:path*`.

Implication:
- Requests made to `/api/...` may not be rewritten to backend if rewrite only matches `/api/v1/...`.
- This can cause frontend/backend path mismatch unless either:
  - frontend uses `/api/v1` base, or
  - rewrite rule also supports `/api/:path*`.

Auth transport assumptions:
- `apiFetch` sends both:
  - `Authorization: Bearer <token>` if localStorage token exists
  - `credentials: 'include'` for cookies
- This is a hybrid strategy and should match backend middleware expectations.

## 8) Notable Gaps / Risks

- Missing `/services` page although linked from navbar/home.
- Mixed JS/TS and mixed API response shape expectations across pages.
- Product and dashboard features are mostly mock data currently.
- Image upload expects `/api/upload` endpoint.
- Seller create listing expects `/api/products` endpoint.

## 9) Suggested Alignment Plan

1. Align API base and rewrite strategy (`/api` vs `/api/v1`) first.
2. Standardize auth response contract (`token` vs `accessToken`, where `user` lives).
3. Decide one auth transport approach (cookie-only or bearer-only, or clean hybrid).
4. Implement missing `/services` route or remove links until ready.
5. Replace mock dashboard/product data with backend-backed queries incrementally.

