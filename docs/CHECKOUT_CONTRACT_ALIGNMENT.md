# Checkout Contract Alignment

## Goal

This change aligns the frontend and backend checkout flow with the smallest possible contract for the MVP.

The project previously had two mismatches:

- the frontend sent `productIds`, while the backend expected `items`
- the frontend completed checkout with `session_id`, while the backend completed orders with `orderId`

## New Contract

### Create checkout session

Frontend now sends:

```json
{
  "items": [
    { "productId": 1, "quantity": 1 }
  ]
}
```

Backend now returns:

```json
{
  "sessionId": "fake-session-...",
  "orderId": 123
}
```

### Complete checkout

Frontend now calls:

```text
POST /api/stripe/complete-order?orderId=123
```

## Why This Version Was Chosen

This is the lowest-complexity version because:

- it keeps the backend order model intact
- it avoids introducing a fake `session_id` mapping layer
- it works with the existing `Order` and `OrderItem` model
- it lets the fake checkout MVP finish an order immediately

## Files Changed

Backend:

- [CheckoutSessionResponse.java](../../valore-backend/src/main/java/com/valore/backend/Order/CheckoutSessionResponse.java)
- [OrderService.java](../../valore-backend/src/main/java/com/valore/backend/Order/OrderService.java)
- [CheckoutController.java](../../valore-backend/src/main/java/com/valore/backend/Order/CheckoutController.java)

Frontend:

- [app/shop/[id]/page.jsx](../app/shop/[id]/page.jsx)
- [app/checkout/success/page.jsx](../app/checkout/success/page.jsx)

## Behavior

1. User clicks "Acheter maintenant" on the product page.
2. Frontend creates a pending order with one item and quantity `1`.
3. Backend returns the generated `orderId`.
4. Frontend redirects to `/checkout/success?orderId=...`.
5. Success page calls the backend completion endpoint with that `orderId`.
6. Backend marks the order as `COMPLETED`.

## Verification

The following checks passed after the change:

```text
./mvnw test
npm run build
```

## Remaining Notes

This is still a fake checkout flow.

- there is no real Stripe redirect
- there is no webhook verification
- the frontend jumps directly to the success page after order creation

That is intentional for the MVP.
