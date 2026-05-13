# Dashboard Wiring Plan

## Goal

Wire the dashboard to the real backend APIs so the user can:

- see real orders after checkout
- see real profile data
- update first name and last name

## Why This Is Next

The checkout flow is now aligned and the frontend routes/build issues have been fixed.

The next missing piece is user verification:

- a user can place a fake checkout order
- but the current dashboard still shows dummy purchases
- the current settings form is not connected to the backend

That means the main user loop is still incomplete.

## Backend Endpoints Already Available

- `GET /api/orders/my`
- `GET /api/users/me`
- `PATCH /api/users/me`

## Frontend Helpers Already Added

The shared frontend API layer already contains:

- `getMyOrders(token)`
- `getMyProfile(token)`
- `updateMyProfile(token, profileData)`

File:

- [services/api.js](../services/api.js)

## Planned Changes

### 1. Replace dummy dashboard data

In [app/dashboard/page.jsx](../app/dashboard/page.jsx):

- remove the fake orders list
- fetch the authenticated user's real orders
- render the real backend response

### 2. Replace session-only profile display

- fetch the authenticated user's profile from the backend
- stop relying on the UI-only session fields for editable profile data

### 3. Wire the settings form

- add controlled form state
- submit first name and last name with `PATCH /api/users/me`
- update the UI after save

### 4. Add minimal loading and error states

- one loading state while dashboard data loads
- one save state while profile updates
- one simple error message if requests fail

### 5. Keep complexity low

This work will stay simple:

- no new state library
- no React Query / SWR
- no major refactor
- no new backend changes unless a blocker appears

## Expected Result

After wiring:

1. user logs in
2. user completes fake checkout
3. dashboard shows the created order
4. profile page loads real backend values
5. profile update persists to the backend
