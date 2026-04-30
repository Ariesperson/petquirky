# Order Detail Redesign

## Context

- Route: `src/app/[locale]/account/orders/[id]/page.tsx`
- Phase: Phase 3 (`account`, `checkout`, `order completion`)
- Design reference: `stitch/checkout_review_interactive/`
- Problem: the current order detail page only shows a minimal summary card and does not feel consistent with the richer checkout review experience.

## Goal

Rebuild the account order detail page into a premium editorial review screen that helps signed-in customers:

- understand what they bought at a glance
- navigate from ordered items back to product detail pages
- review shipping, payment, and pricing details without leaving the page
- understand order progress even when the database only stores a minimal order record

## UX Requirements

### Layout

- Use a two-column desktop layout inspired by `stitch/checkout_review_interactive/code.html`.
- Left column focuses on the order narrative:
  - page title and order identity
  - lightweight progress/timeline module
  - shipping summary
  - itemized product cards
- Right column acts as a sticky summary rail:
  - payment summary
  - subtotal / shipping / total breakdown
  - support and policy links
  - back-to-orders CTA

### Visual Rules

- Follow the PetQuirky editorial system:
  - no hard divider-heavy dashboard styling
  - rounded, layered surfaces
  - warm coral gradients for primary actions
  - tonal separation instead of prominent borders where possible
- Reuse the same visual language as checkout review so account order details feel like the post-purchase continuation of checkout.
- Mobile layout must be intentionally stacked with the summary rail appearing after the main narrative content.

### Content Blocks

The new page should include:

- hero block with order number, localized order date, and status badge
- order progress/timeline derived from current order status
- shipping address card
- payment/customer card
- itemized ordered products with:
  - product image
  - product name
  - quantity
  - unit price
  - line total
  - link to the product detail page when the product still exists
- pricing summary with subtotal, shipping, total
- delivery/help card with:
  - estimated delivery message
  - 14-day returns reminder
  - links to privacy, terms, and returns/shipping policy pages
- actions:
  - back to orders
  - continue shopping

## Data Requirements

### Existing persisted data

The current order persistence already stores:

- `id`
- `status`
- `total`
- `currency`
- `createdAt`
- `payerEmail`
- `shippingAddress`
- `items[]`

Each item currently stores:

- `productId`
- `name`
- `image`
- `quantity`
- `unitPrice`
- `lineTotal`

### Derived data required for the new page

The redesign must work without a breaking database migration. Therefore, the detail page should derive the following server-side:

- `subtotal`: sum of all line totals
- `shippingAmount`: `max(total - subtotal, 0)`
- `itemCount`: sum of quantities
- `paymentMethodLabel`: default to PayPal for current completed orders
- `paymentStatusLabel`: derived from order status
- `deliveryEstimateLabel`: derived from existing shipping policy (`5-10 business days`)
- `timelineSteps`: derived from `status` plus `createdAt`
- `linkedProductSlug`: resolved by matching `item.productId` to the current product catalog

### Compatibility rules

- Old orders without item arrays must still render safely.
- Old orders without a matching current product should render the item as a static card without product link.
- If shipping amount cannot be trusted from persisted fields, derive it from `total - subtotal` and clamp at `0`.
- The page must never require new Supabase columns to render.

## Engineering Requirements

- Keep the route page thin; push view-model shaping into reusable server-side helpers under `src/lib/`.
- Keep the page server-rendered.
- New user-facing strings must be added to all locale dictionaries.
- Do not break the checkout success page or account order list.
- Use existing product data helpers where possible to link orders back to product detail pages.

## Acceptance Criteria

- `/[locale]/account/orders/[id]` matches the new layered editorial layout on desktop and mobile.
- The page shows itemized product cards instead of a plain text item list.
- Users can open a product detail page from an order item when the product still exists.
- Pricing breakdown shows subtotal, shipping, and total with EU price formatting.
- Help/legal area includes links to privacy, terms, and shipping/returns pages.
- The implementation works for both newly created orders and previously stored orders.
- Existing authenticated order detail access rules remain unchanged.
