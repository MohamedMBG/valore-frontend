# Frontend System Documentation

## 1. Task Summary

This document explains the full `valore-frontend` application for onboarding, maintenance, and exam presentation.

It covers:

- the frontend tech stack
- the App Router structure
- what each important file is for
- authentication flow
- API integration with the Spring Boot backend
- state management
- styling and animation choices
- deployment configuration
- current limitations and unfinished areas

The goal is to make the frontend understandable without reading the whole codebase file by file.

---

## 2. Problem

Before this document:

- the frontend had implementation-specific audit files in `docs/`
- there was no single document explaining the whole frontend architecture
- it was hard to understand which files are core, which are support files, and which are leftovers
- the project could work in an exam demo, but explaining it clearly required reverse-engineering the code

The main issue was not missing code. The issue was missing system-level documentation.

---

## 3. Solution Implemented

I created a frontend system documentation file that explains:

- the overall purpose of the frontend
- how Next.js App Router is used
- where routing, layout, auth, and shared providers live
- how products, checkout, quotes, dashboard, and admin features are wired
- what each important folder and file is responsible for
- how the frontend communicates with the backend
- what is static, what is dynamic, and what is simulated

This document is meant to be both:

- an engineering handoff document
- an exam preparation guide

---

## 4. Files Modified

- `docs/2026-05-20-frontend-system-documentation.md`

---

## 5. Frontend Overview

`valore-frontend` is a **Next.js 16** application built with the **App Router**.

It is the user-facing layer of the Valoré/Veloir project and provides:

- a cinematic marketing homepage
- a product shop
- product detail pages
- simulated checkout
- authentication through NextAuth credentials
- a customer dashboard
- an admin dashboard
- a mindset/quotes area
- a local quote battle page
- a scroll-driven stories page
- a studio/service presentation page

The frontend talks to the backend REST API hosted separately. The backend is the source of truth for:

- users
- authentication
- products
- orders
- admin statistics
- quotes

The frontend is responsible for:

- presentation
- routing
- session handling
- form submission
- protected page access
- local interaction states

---

## 6. Tech Stack

### Core Framework

- `Next.js 16.2.4`
- `React 19.2.4`
- `React DOM 19.2.4`

### Authentication

- `next-auth`

Used for:

- credentials login
- JWT session storage on the frontend side
- exposing `session.accessToken` to protected pages

### UI / Styling

- `Tailwind CSS 4`
- custom CSS in `app/globals.css`
- Google fonts through `next/font/google`

### Motion / Interaction

- `framer-motion`

Used mainly for:

- intro animation
- mobile menu animation
- cinematic UI transitions

### Icons

- `lucide-react`

### Utilities

- `clsx`
- `tailwind-merge`

### HTTP

- native `fetch` for most app-to-backend calls
- `axios` is still used inside the NextAuth credentials route

---

## 7. High-Level Architecture

The frontend follows this structure:

- `app/` = routes, layout, route handlers, page entrypoints
- `components/` = reusable UI sections and interactive blocks
- `context/` = shared product state
- `services/` = backend API helper functions
- `hooks/` = custom hooks
- `public/` = static assets served directly
- `anim/` = local image frames for the stories page
- `docs/` = engineering audit trail and documentation
- `scripts/` = asset generation/fetch scripts

Architecturally, this is a **single frontend app** with:

- server-rendered route shells where practical
- client components for stateful UI
- one shared product context
- one shared NextAuth session provider

This is not a heavy enterprise frontend with Redux, React Query, or a full design system. It is intentionally simpler.

---

## 8. Root Files And Their Purpose

### [app/layout.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/layout.jsx:1)

This is the root layout for the whole application.

It is responsible for:

- loading global CSS
- loading Google fonts
- defining metadata
- wrapping the app with shared providers
- rendering the global navbar and footer
- wrapping page content inside `IntroWrapper`

This file defines the global page shell.

### [app/providers.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/providers.jsx:1)

This is a client component that mounts app-wide providers:

- `SessionProvider` from NextAuth
- `ProductProvider` from the custom product context

Without this file:

- authentication session data would not be accessible in client pages
- product state would not be shared across the shop pages

### [app/globals.css](C:/Users/pc/projectw/valore/valore-frontend/app/globals.css:1)

This file defines:

- theme variables
- global typography defaults
- reusable cinematic visual effects
- custom animations
- scrollbar styling
- marquee keyframes
- shimmer text animation

It is a major styling file, not a minor reset.

### [next.config.mjs](C:/Users/pc/projectw/valore/valore-frontend/next.config.mjs:1)

This file configures:

- `output: 'standalone'` for deployment
- Next Image remote patterns
- optimized image formats

Important point:

- remote images are currently allowed from `images.unsplash.com`

### [tailwind.config.js](C:/Users/pc/projectw/valore/valore-frontend/tailwind.config.js:1)

This file extends Tailwind with:

- custom colors
- app fonts
- shared container settings
- custom keyframes and animations

It centralizes the design tokens used across pages.

### [package.json](C:/Users/pc/projectw/valore/valore-frontend/package.json:1)

This file defines:

- app metadata
- scripts: `dev`, `build`, `start`, `lint`
- dependencies and dev dependencies

---

## 9. Routing And Pages

The project uses the **Next.js App Router**, so every folder under `app/` can define a route.

### [app/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/page.jsx:1) — Home Page

Purpose:

- brand landing page
- presents Veloir identity
- promotes products
- promotes the studio
- encourages newsletter subscription

Important details:

- uses `next/image`
- lazy-loads `ShowcaseSection` with `dynamic()`
- uses static featured products instead of backend data for the homepage section

This page is mostly a marketing surface, not a data-heavy page.

### [app/shop/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/shop/page.jsx:1) — Shop Listing

Purpose:

- display the full product catalog
- allow search
- allow category filtering

Data source:

- `ProductContext`

Important behavior:

- products are loaded once by the shared provider
- this page filters in memory on the client

### [app/shop/[id]/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/shop/[id]/page.jsx:1) — Product Detail

Purpose:

- show one product in detail
- let the user start checkout

Important behavior:

- gets the product id from the route
- finds the product inside `ProductContext`
- if user is not logged in, redirects to `/login` with a callback URL
- if user is logged in, calls backend checkout-session creation
- redirects to `/checkout` with query parameters after backend creates the order

This page is the start of the purchase flow.

### [app/checkout/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/checkout/page.jsx:1) — Simulated Payment Form

Purpose:

- simulate a payment page after order creation

Important behavior:

- reads `orderId`, `title`, `category`, and `price` from query parameters
- does not contact a real payment provider
- posts to backend `/stripe/complete-order`
- redirects to `/checkout/success`

This is intentionally a fake bank/payment page for the academic project.

### [app/checkout/success/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/checkout/success/page.jsx:1) — Checkout Success

Purpose:

- confirm that the simulated payment is complete
- send the user to the dashboard

### [app/login/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/login/page.jsx:1) — Login / Signup

Purpose:

- let users log in
- let users register

Important behavior:

- login uses `signIn('credentials')` through NextAuth
- signup sends a direct `fetch` to backend `/auth/register`
- after successful registration, it immediately tries to log the user in

This page combines two flows in one screen:

- authentication
- registration

### [app/dashboard/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/dashboard/page.jsx:1) — Customer Dashboard

Purpose:

- show user orders
- show and edit basic profile information

Important behavior:

- protected route on the frontend side
- redirects unauthenticated users to login
- loads profile and orders from backend
- separates profile failure from order failure to avoid total page failure

### [app/admin/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/admin/page.jsx:1) — Admin Dashboard

Purpose:

- show business stats
- show recent orders
- manage products

Important behavior:

- checks that the authenticated user has role `ADMIN`
- redirects non-admin users back to `/dashboard`
- loads stats, orders, and products
- supports create/update/delete product actions

This is the operational/admin area of the frontend.

### [app/mindset/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/mindset/page.jsx:1)

Purpose:

- renders the quotes page via `QuotesSection`

### [app/stories/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/stories/page.jsx:1)

Purpose:

- renders the cinematic stories page

Important behavior:

- server-side reads the `anim/` directory
- generates local frame URLs
- passes them into `StoriesSection`

### [app/battle/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/battle/page.jsx:1)

Purpose:

- renders the quote battle page

### [app/studio/page.jsx](C:/Users/pc/projectw/valore/valore-frontend/app/studio/page.jsx:1)

Purpose:

- present video/studio services
- show packages
- show a service quote request form

Current limitation:

- the form is visual only and is not connected to a backend endpoint

### `app/products/`

Folders exist under:

- `app/products/new`
- `app/products/[id]`
- `app/products/[id]/edit`

But they are currently empty and do not contain active route files.

This means they are placeholders or leftovers, not active user flows.

---

## 10. API Route Handlers

### [app/api/auth/[...nextauth]/route.js](C:/Users/pc/projectw/valore/valore-frontend/app/api/auth/[...nextauth]/route.js:1)

Purpose:

- configure NextAuth credentials login

How it works:

- receives login credentials from the frontend
- sends them to backend `/auth/authenticate`
- if backend returns a JWT, stores it in the NextAuth token/session

Important session fields:

- `session.accessToken`
- `session.user.role`
- `session.user.firstname`
- `session.user.lastname`
- `session.user.email`

This route is the bridge between:

- frontend login UI
- backend authentication API

### [app/anim/[file]/route.js](C:/Users/pc/projectw/valore/valore-frontend/app/anim/[file]/route.js:1)

Purpose:

- safely serve image frames from the local `anim/` directory

Why it exists:

- the stories page needs local frame-by-frame image access
- the route prevents directory traversal by normalizing the file path

This is a custom file-serving route, not a business API.

---

## 11. Shared State And Data Flow

### [context/ProductContext.jsx](C:/Users/pc/projectw/valore/valore-frontend/context/ProductContext.jsx:1)

Purpose:

- centralize product loading and sharing

State provided:

- `products`
- `loading`
- `fetchProducts`

Important behavior:

- fetches products from `${API_BASE_URL}/products`
- falls back to local hardcoded products if backend is unavailable
- delays initial fetch with `setTimeout(..., 0)` so the intro animation is not blocked

This context powers:

- shop page
- product detail page
- any shared product consumer

### [hooks/useFetch.js](C:/Users/pc/projectw/valore/valore-frontend/hooks/useFetch.js:1)

Purpose:

- generic fetch hook

Current role:

- reusable utility
- not the main state architecture of the app

### [services/api.js](C:/Users/pc/projectw/valore/valore-frontend/services/api.js:1)

Purpose:

- centralize frontend-to-backend API calls

Contains helpers for:

- quotes
- dashboard profile
- dashboard orders
- admin stats
- admin orders
- admin products CRUD

This file is the frontend service layer.

---

## 12. Authentication Flow

Authentication is split into two layers:

### Backend

The Spring Boot backend:

- registers users
- authenticates users
- returns a JWT

### Frontend

The frontend:

- uses NextAuth credentials mode
- stores auth state in session/JWT
- exposes `session.accessToken` to protected pages

### Login Flow

1. User submits email and password on `/login`
2. `signIn('credentials')` is called
3. NextAuth route sends request to backend `/auth/authenticate`
4. Backend returns JWT + role + name data
5. NextAuth stores that in session
6. Protected pages use `useSession()` and attach `Authorization: Bearer ...`

### Signup Flow

1. User switches to signup mode on `/login`
2. Frontend directly calls backend `/auth/register`
3. If registration succeeds, frontend immediately triggers `signIn('credentials')`
4. User enters the app already authenticated

### Role Handling

The navbar and dashboards use `session.user.role`:

- `ADMIN` goes to `/admin`
- regular users go to `/dashboard`

---

## 13. Main Reusable Components

### [components/Navbar.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/Navbar.jsx:1)

Purpose:

- global navigation
- desktop and mobile menus
- auth-aware links

Important behavior:

- hides itself on `/stories`
- shows dashboard/admin shortcut based on session role
- uses `AnimatePresence` and `motion` for mobile menu animation

### [components/Footer.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/Footer.jsx:1)

Purpose:

- global footer with brand, links, and legal placeholders

### [components/ProductCard.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/ProductCard.jsx:1)

Purpose:

- reusable product display card

Used by:

- homepage featured products
- shop page

### [components/QuotesSection.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/QuotesSection.jsx:1)

Purpose:

- display static and backend quotes
- filter and search quotes
- let logged-in users submit a quote

Important behavior:

- merges local static quotes with backend quotes
- opens login if user tries to submit while unauthenticated

### [components/QuoteBattle.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/QuoteBattle.jsx:1)

Purpose:

- local interactive quote competition page

Important behavior:

- state is stored in `localStorage`
- no backend persistence
- includes an admin-like control bar to force battle rounds

This page is self-contained and mostly independent from the backend.

### [components/ShowcaseSection.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/ShowcaseSection.jsx:1)

Purpose:

- animated portfolio showcase

Important implementation details:

- uses duplicated arrays for continuous marquee effect
- hoists `ShowcaseCard` outside the parent to avoid remounting
- memoizes cards to reduce hover-related rerenders

This is one of the more performance-aware components in the frontend.

### [components/StoriesSection.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/StoriesSection.jsx:1)

Purpose:

- cinematic scroll-driven story experience

Important implementation details:

- preloads local frame images
- draws them on a `canvas`
- uses scroll progress + `requestAnimationFrame`
- uses linear interpolation (`lerp`) for smoother frame transitions
- overlays editorial content on top of the sticky canvas

This is the most technically advanced visual component in the frontend.

### [components/IntroWrapper.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/IntroWrapper.jsx:1)

Purpose:

- show intro animation only on homepage
- hide it from all other pages

Important implementation detail:

- `IntroAnimation` is loaded dynamically with `ssr: false`
- this prevents unnecessary client cost on non-home pages

### [components/IntroAnimation.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/IntroAnimation.jsx:1)

Purpose:

- full-screen cinematic intro before homepage content appears

Important implementation details:

- plays local MP4 video
- uses framer-motion extensively
- computes random particle positions once with `useMemo`
- waits for animation exit before revealing content

### [components/NewsletterForm.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/NewsletterForm.jsx:1)

Purpose:

- newsletter signup UI

Important limitation:

- it is simulated only
- there is no backend newsletter endpoint yet

### [components/Spinner.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/Spinner.jsx:1)

Purpose:

- reusable loading indicator

### [components/CinematicDivider.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/CinematicDivider.jsx:1)

Purpose:

- decorative cinematic divider with timecode styling

Current role:

- utility/decorative component
- not a central application dependency

### [components/CinematicFrame.jsx](C:/Users/pc/projectw/valore/valore-frontend/components/CinematicFrame.jsx:1)

Purpose:

- decorative fixed cinematic overlay frame

Current role:

- stylistic support component
- not essential to data flow

---

## 14. Styling System

The styling approach is a mix of:

- Tailwind utility classes
- custom global CSS tokens/effects
- inline styles in a few components

### Tailwind Usage

Most layout and spacing are handled through Tailwind classes inside components and pages.

### Global CSS Usage

`app/globals.css` contains:

- theme variables
- neon color system
- utility classes such as `.luxury-btn`, `.luxury-card`, `.glow-line-bottom`, `.glow-text-hover`
- keyframes for shimmer and marquee behavior

### Fonts

Loaded in `app/layout.jsx`:

- `Outfit` for body/sans text
- `Bebas Neue` for large display headlines

This gives the site a cinematic/editorial look instead of generic default typography.

---

## 15. Rendering Strategy

The app uses mixed rendering based on the page’s needs.

### Mostly Server Components

Examples:

- `app/layout.jsx`
- `app/page.jsx`
- `app/stories/page.jsx`
- simple metadata wrapper pages

These do not need browser-only hooks directly.

### Client Components

Used where the page needs:

- React state
- effects
- auth session hooks
- router hooks
- localStorage
- animations
- canvas drawing

Examples:

- `app/shop/page.jsx`
- `app/shop/[id]/page.jsx`
- `app/login/page.jsx`
- `app/dashboard/page.jsx`
- `app/admin/page.jsx`
- `components/StoriesSection.jsx`

### Dynamic Import

Used in:

- `app/page.jsx` for `ShowcaseSection`
- `components/IntroWrapper.jsx` for `IntroAnimation`

Reason:

- reduce initial homepage cost
- avoid loading heavy client animation logic where it is not needed

---

## 16. Data And Feature Flows

### Product Browsing Flow

1. `ProductProvider` loads products from backend
2. `/shop` displays and filters them
3. `/shop/[id]` reads one product by route id

### Checkout Flow

1. User opens product detail
2. User clicks buy
3. If not logged in, redirect to login
4. Backend creates checkout session/order
5. Frontend redirects to `/checkout`
6. User submits simulated payment form
7. Frontend confirms order through backend
8. User sees success page
9. User can later see the order in `/dashboard`

### Quote Flow

1. `/mindset` renders `QuotesSection`
2. Static quotes are always available
3. Backend quotes are fetched and merged in
4. Logged-in users can submit a new quote

### Admin Product Flow

1. Admin logs in
2. `/admin` validates role from session
3. Admin loads stats, orders, and product list
4. Admin creates/edits/deletes products through service helpers

---

## 17. Environment Variables And Deployment

### Frontend Environment Variables

Defined by expectation in [.env.example](C:/Users/pc/projectw/valore/valore-frontend/.env.example:1):

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `NEXT_PUBLIC_API_URL`

### Their Purpose

- `NEXTAUTH_URL` = public frontend URL
- `NEXTAUTH_SECRET` = secret for NextAuth JWT/session signing
- `NEXT_PUBLIC_API_URL` = backend base API URL

### Hosting

Recommended deployment split:

- frontend on Vercel
- backend on Render
- database on Neon

---

## 18. Important Folders And Assets

### `public/`

Contains static assets served directly:

- generated hero assets
- studio images
- local MP4 file
- default SVG assets

### `anim/`

Contains many image frames used by the stories page animation.

These are not decorative leftovers. They are a real input to the stories canvas sequence.

### `scripts/`

Contains utility scripts:

- `fetch-images.mjs`
- `generate-images.mjs`

These support asset workflows rather than runtime app logic.

### `docs/`

Contains implementation audit documents for specific frontend tasks.

This new file is the broad system-level explanation.

---

## 19. Known Limitations

- the homepage featured products are static, while the shop page uses backend-loaded products
- the newsletter form is simulated and does not save subscriptions to a backend
- the studio contact form is visual only and is not connected to an API
- `app/products/*` folders are present but currently empty
- some UI text still contains encoding/accent inconsistencies
- the auth layer still uses `axios` inside the NextAuth route while most of the app has moved to `fetch`
- the quote battle page persists only in browser `localStorage`, not in the backend
- the stories page is visually advanced but can be heavy on low-end devices because it preloads many frames

---

## 20. Important Technical Decisions

### Why Next.js App Router

- clear route-based structure
- built-in layouts
- server/client component split
- easy deployment to Vercel

### Why NextAuth Credentials

- backend already owns authentication
- frontend only needs a session wrapper around backend JWTs
- avoids building a custom auth state layer from scratch

### Why ProductContext Instead Of Redux

- product state is small
- one shared product list is enough
- using a large state library would be unnecessary complexity

### Why Dynamic Imports For Intro/Showcase

- reduce initial JS where possible
- keep heavy animation logic out of unrelated pages

### Why Canvas For Stories

- a frame-by-frame scroll experience is easier to control through a canvas than many layered DOM images
- canvas also keeps the cinematic sequence independent from normal page layout

---

## 21. Performance Impact

This documentation task did not change runtime behavior.

No significant performance impact.

Documented existing frontend performance-aware choices include:

- dynamic import for intro and showcase
- memoized showcase cards
- shared product context instead of repeated per-page product fetching
- `requestAnimationFrame`-driven canvas updates for stories
- image optimization through `next/image`

---

## 22. UI/UX Impact

This documentation task did not directly change the UI.

However, the documented frontend itself has these UX characteristics:

- strong cinematic branding
- neon/editorial visual direction
- mobile menu support
- protected dashboard/admin flows
- clear shop-to-checkout funnel
- highly visual stories experience

---

## 23. Testing And Validation

For this documentation task:

- validated the structure by reading the actual frontend source files
- validated route and component responsibilities against the codebase
- validated environment expectations against deployment config files

Not performed for this task:

- browser interaction testing
- device testing
- visual regression testing
- API smoke testing from the frontend UI

This file is based on direct code inspection rather than a complete UI QA pass.

---

## 24. Before / After Behavior

### Before

- the project had many narrow implementation notes
- there was no single frontend architecture document
- explaining the project in an exam required opening many files and reconstructing the architecture manually

### After

- there is now one broad frontend documentation file
- the main routes, shared files, and data flows are explained in one place
- a developer or examiner can understand the application faster

---

## 25. Exam Summary

If you need to explain this frontend quickly in an exam, say this:

`valore-frontend` is a Next.js 16 App Router application. It uses React 19, Tailwind CSS, NextAuth credentials authentication, and a small custom ProductContext for shared catalog state. The frontend is split between marketing pages and authenticated application pages. Public pages include the homepage, shop, studio, mindset, stories, and quote battle. Authenticated pages include the user dashboard and admin dashboard. The backend provides products, authentication, orders, quotes, and admin statistics through REST endpoints. The frontend stores the backend JWT inside NextAuth session state and reuses it for protected API calls. Styling combines Tailwind utilities with custom cinematic CSS classes and framer-motion animations. The most advanced frontend feature is the stories page, which renders local animation frames on a canvas and synchronizes them to scroll progress.`

---

## 26. Short File Map

Use this as a quick memory map:

- `app/layout.jsx` = global shell
- `app/providers.jsx` = SessionProvider + ProductProvider
- `app/page.jsx` = homepage
- `app/shop/page.jsx` = shop listing
- `app/shop/[id]/page.jsx` = product detail + start checkout
- `app/checkout/page.jsx` = payment simulation
- `app/checkout/success/page.jsx` = payment confirmation
- `app/login/page.jsx` = login + signup
- `app/dashboard/page.jsx` = user dashboard
- `app/admin/page.jsx` = admin dashboard
- `app/mindset/page.jsx` = quote page wrapper
- `app/stories/page.jsx` = stories page entry
- `app/battle/page.jsx` = quote battle entry
- `app/studio/page.jsx` = studio services page
- `app/api/auth/[...nextauth]/route.js` = NextAuth credentials bridge
- `app/anim/[file]/route.js` = local animation frame serving
- `context/ProductContext.jsx` = shared product state
- `services/api.js` = backend API helper layer
- `components/Navbar.jsx` = global nav
- `components/Footer.jsx` = global footer
- `components/ProductCard.jsx` = reusable product card
- `components/QuotesSection.jsx` = mindset page content
- `components/QuoteBattle.jsx` = local quote competition
- `components/ShowcaseSection.jsx` = animated portfolio strip
- `components/StoriesSection.jsx` = scroll-driven canvas story
- `components/IntroWrapper.jsx` = homepage intro gate
- `components/IntroAnimation.jsx` = cinematic intro
- `app/globals.css` = global styling system
- `next.config.mjs` = Next.js deployment/image config
- `tailwind.config.js` = Tailwind design tokens

