# Dashboard Wiring Implementation

## Scope

This note documents the work completed to wire the frontend dashboard to the real backend APIs.

The objective was to replace dummy dashboard data with live authenticated data while keeping the implementation simple.

## Why This Work Was Needed

Before this change:

- the dashboard showed a fake hardcoded order list
- the profile settings form was not connected to the backend
- a user could complete the fake checkout flow but could not verify the result inside the dashboard

That meant the main authenticated user flow was still incomplete.

## What Was Already Available

The backend already exposed the endpoints needed for a low-complexity dashboard:

- `GET /api/orders/my`
- `GET /api/users/me`
- `PATCH /api/users/me`

The frontend API helper layer had also been prepared in:

- [services/api.js](../services/api.js)

with:

- `getMyOrders(token)`
- `getMyProfile(token)`
- `updateMyProfile(token, profileData)`

## What Was Changed

### 1. Dashboard plan document added

File added:

- [DASHBOARD_WIRING_PLAN.md](./DASHBOARD_WIRING_PLAN.md)

Purpose:

- describe the intended dashboard wiring approach before implementation

### 2. Dashboard page rewired

File changed:

- [app/dashboard/page.jsx](../app/dashboard/page.jsx)

The page now:

- redirects unauthenticated users to `/login`
- loads real orders from the backend using the session access token
- loads the real user profile from the backend
- initializes form state from backend profile data
- saves first name and last name through `PATCH /api/users/me`
- displays success and error feedback
- replaces the fake order cards with real backend order data

## Implementation Approach

The implementation was intentionally kept small:

- no new state library
- no React Query / SWR
- no new context
- no backend changes required for dashboard wiring

Everything stays inside the existing dashboard page plus the shared API helper functions.

## Real Data Used By The Dashboard

### Orders tab

The dashboard now reads the backend order response and renders:

- order id
- order status
- total amount
- each purchased item title
- each item quantity
- each item purchase price

### Settings tab

The dashboard now reads the backend profile response and renders:

- email as read-only
- first name as editable
- last name as editable

On save, it updates only:

- `firstname`
- `lastname`

which matches the backend contract.

## What Was Removed

From the dashboard behavior:

- fake order list generated from `[1, 2]`
- session-only editable profile defaults
- unconnected settings form

## Verification

The following checks were run after the implementation:

```text
npm run build
npm run lint -- app/dashboard/page.jsx
```

Result:

- frontend production build passed
- dashboard page lint passed

## Expected User Flow After This Change

1. user logs in
2. user completes fake checkout
3. user opens `/dashboard`
4. real orders are fetched from `/api/orders/my`
5. user profile is fetched from `/api/users/me`
6. user updates first name / last name
7. dashboard saves changes through `PATCH /api/users/me`

## Remaining Notes

This change wires real dashboard data, but some adjacent parts of the project are still incomplete:

- admin page is still mostly static
- quotes feature is still not fully aligned
- some frontend files still use hardcoded backend URLs outside the shared helper layer

Those are separate follow-up tasks.
