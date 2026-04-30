# PetQuirky Pre-Launch Checklist

> Date: 2026-04-30  
> Phase: pre-launch QA review, not production launch  
> QA role: QA Launch Checker  
> Scope: real customer browse -> cart -> checkout -> PayPal sandbox -> success -> Supabase order -> account order views -> emails

## Release Gate

PetQuirky can enter the **next launch-preparation round**, but should **not** be pushed to production until the remaining external-service validation is completed on staging.

Current recommendation after developer retest: **proceed to the next launch-preparation round**.

Primary reason: the previous account-only checkout blocker is fixed. Anonymous users now reach a clear login/register gate before PayPal, automated checks are green, and anonymous order views redirect to login. The remaining must-do item before production is one authenticated PayPal sandbox transaction that proves Supabase order persistence, account order views, and Resend email delivery end to end.

## Retest Summary: 2026-04-30

Developer changes resolved the main checkout gate and refreshed the e2e expectations for account-only checkout.

| Area | Latest Result | Evidence |
|---|---|---|
| Lint | Passed | `npm run lint` |
| Unit tests | Passed | `npm run test:unit`: 23 files, 94 tests |
| Production build | Passed | `npm run build` |
| E2E smoke | Passed | `npm run test:e2e`: 22 passed |
| Browser checkout retest | Passed | Anonymous checkout review shows account-only login/register CTA and does not render PayPal |
| Success warning copy | Improved | Internal Resend failure reasons are no longer rendered to the customer |
| Mobile checkout layout | Needs final staging check | Previous narrow-viewport clipping needs a final visual pass after deployment |

## Environment Checked

| Area | Expected | Result |
|---|---|---|
| Next.js app | Next.js 16.2.1 app builds | Passed |
| Supabase public config | Browser and server clients can be initialized | Present in local env |
| PayPal | Sandbox client/server credentials configured | Present in local env |
| Resend | API key and from email configured | Present in local env |
| Production env | Must not use placeholder live PayPal credentials | Needs cleanup before production |

## Automated Verification

| Check | Command | Result | Notes |
|---|---|---|---|
| Lint | `npm run lint` | Passed | No ESLint errors |
| Unit tests | `npm run test:unit` | Passed | 23 files, 94 tests |
| Production build | `npm run build` | Passed | All app routes compiled |
| E2E smoke | `npm run test:e2e` | Passed | Latest retest: 22 passed. Includes localized home pages, product/list detail, cart, checkout shipping/review, anonymous checkout gate, success cleanup, auth pages, account redirects, cookies, policies. |
| Browser manual smoke | In-app browser on `http://127.0.0.1:3000` | Passed for checkout gate | `/en/checkout?step=review` kept cart/address review, showed "Log in to continue checkout", exposed login/register CTAs, and did not render PayPal for anonymous users. |

## Manual Test Record

### 1. Four-Language Routes

| Route | Expected | Status | Evidence / Notes |
|---|---|---|---|
| `/en` | Home renders English storefront | Passed in browser | Rendered localized H1 |
| `/de` | Home renders German storefront | Passed in browser | Rendered localized H1 |
| `/fr` | Home renders French storefront | Passed in browser | Rendered localized H1 |
| `/es` | Home renders Spanish storefront | Passed in browser | Rendered localized H1 |

Manual browser result:
- `/en`: rendered `Smart Gear for Unique Pets`.
- `/de`: rendered `Smarte Produkte für besondere Haustiere`.
- `/fr`: rendered `Des équipements intelligents pour des animaux uniques`.
- `/es`: rendered `Accesorios inteligentes para mascotas únicas`.

### 2. Browse, Product List, Product Detail

| Flow | Expected | Status | Evidence / Notes |
|---|---|---|---|
| Home -> products | User can discover product list | Passed in browser | `/en/products` showed `Ceramic Sculpted Slow Feeder` |
| Product list -> detail | Product detail opens and shows product content | Passed in browser | `/en/products/ceramic-sculpted-slow-feeder` showed H1, price, quantity controls, shipping/returns copy, reviews |
| Product JSON-LD | Product detail emits structured data | Code check passed | `JsonLd` is used on product detail pages |

### 3. Cart, Checkout, PayPal Sandbox

| Flow | Expected | Status | Evidence / Notes |
|---|---|---|---|
| Add to cart | Product can be added and persisted | Passed in browser | Product detail add-to-cart changed cart badge to `1` |
| Cart -> checkout | Cart items appear in checkout | Passed in browser | Cart showed item, subtotal, shipping, total, and checkout CTA |
| Checkout shipping form | Address can be entered and reviewed | Passed in browser | Test address moved checkout to `?step=review` and displayed order review |
| PayPal order create | Signed-in user can create sandbox PayPal order | Not fully verified | Anonymous API request still returned 401 in developer retest; signed-in sandbox buyer path still needs retest |
| PayPal order capture | Signed-in user can capture sandbox PayPal order | Not fully verified | API requires Supabase session before capture and order persistence |
| Anonymous checkout | Guest checkout is not supported; anonymous buyers must be stopped before PayPal with a clear login requirement | Passed | Browser retest showed "Log in to continue checkout" plus login/register CTAs; PayPal was not rendered for anonymous checkout review |

Browser evidence:

```text
/en/checkout?step=review
Heading: Log in to continue checkout
CTA: Log In -> /en/auth/login?returnTo=%2Fen%2Fcheckout%3Fstep%3Dreview
CTA: Create Account -> /en/auth/register?returnTo=%2Fen%2Fcheckout%3Fstep%3Dreview
PayPal button: not rendered
```

### 4. Checkout Success

| Flow | Expected | Status | Evidence / Notes |
|---|---|---|---|
| Success page | Shows order number, status, total, email, shipping address | Passed with fallback URL | E2E snapshot showed order number, status, total, email, shipping address, and account links |
| Cart cleanup | Cart is cleared after success | Code/e2e coverage present | `CheckoutSuccessClient` clears cart and writes local order history |
| Success with server order | Logged-in user should see Supabase order items on success | Not fully verified | Needs full PayPal sandbox capture with authenticated user |

### 5. Supabase Orders

| Flow | Expected | Status | Evidence / Notes |
|---|---|---|---|
| Order write | Captured order is upserted into `orders` table | Not fully verified | Code path exists in `persistOrderFromServer`; requires successful authenticated PayPal capture |
| Order list | Account page lists logged-in user's orders | Not fully verified | Server reads `orders` by `user_id`; needs real Supabase test order |
| Order detail | Account order detail displays item, customer, shipping, payment data | Requires logged-in retest | Anonymous `/account/orders/...` redirects to login as expected; authenticated order detail still needs a real persisted test order |

### 6. Emails

| Email | Expected | Status | Evidence / Notes |
|---|---|---|---|
| Customer order confirmation | Sent to payer email after capture | Not fully verified | Code calls Resend after persistence; needs full sandbox capture |
| Seller notification | Sent to seller email after capture | Not fully verified | Code calls Resend after customer confirmation |
| Email failure handling | Payment still succeeds but warning is shown | Code/unit coverage passed | Capture route accumulates warnings for confirmation/seller email failure |

### 7. Auth

| Flow | Expected | Status | Evidence / Notes |
|---|---|---|---|
| Login | Existing user can sign in and reach account | Pending real credential retest | Login page renders; full login requires a test account |
| Register | User can create account and accept terms/privacy | Automated validation passed | E2E validates the register page before submission |
| Forgot password | User can request reset email | Automated page flow passed | E2E loads the forgot-password email flow |
| Reset password | User can update password from recovery session | Pending browser retest | Form exists; full email-token path not verified |

### 8. Mobile Layout

| Area | Expected | Status | Evidence / Notes |
|---|---|---|---|
| Home/product/cart/checkout | No blocking overflow or hidden primary actions on mobile | Pending browser retest | Needs mobile viewport pass after e2e/browser setup |
| Mobile nav/cart | Menu and cart drawer usable | Pending browser retest | Components exist; needs visual check |

Latest note: checkout was observed in a narrow viewport. The payment/order summary content is usable, but the step navigation is horizontally clipped (`Shipping` appears cut off). Treat this as high priority before public launch.

### 9. SEO Basics

| Item | Expected | Status | Evidence / Notes |
|---|---|---|---|
| Metadata | Localized title, description, canonical | Code/unit passed | `createPageMetadata` unit tests pass |
| Sitemap | Localized static/product/blog URLs | Code/unit/browser passed | `sitemap.xml` emitted localized static, product, and blog URLs for all four locales |
| Robots | Allows crawl and points to sitemap | Code/unit/browser passed | `robots.txt` emitted allow-all plus sitemap URL |
| Hreflang | Locale alternates for pages | Code/unit passed | `buildAlternates` covers `en`, `de`, `fr`, `es` |
| JSON-LD | Product/blog structured data | Code check passed | `JsonLd` component used on product and blog detail pages |

### 10. GDPR, Cookie, Policies, Trust

| Item | Expected | Status | Evidence / Notes |
|---|---|---|---|
| Cookie banner | Accept all, necessary only, settings persistence | Passed | E2E opens cookie settings and persists preferences |
| Privacy policy | Explains data collection and EEA rights | Code check passed | Policy exists in four languages |
| Returns policy | 14-day returns, shipping timeline | Code/unit passed | Unit test locks 14-day copy |
| Terms | Order/account terms visible | Code check passed | Terms policy exists in four languages |
| Individual seller statement | Visible in footer | Code check passed | Footer receives `individualSeller` copy |

## Blocking Issues

No active code-level blocker remains from this retest for entering the next launch-preparation round.

### B1. Production launch still requires one authenticated payment proof

Impact: the most important revenue path is not proven end-to-end.

Evidence:
- Code paths are present, but the run has not yet completed a real sandbox approval/capture with an authenticated Supabase user.

Required before production launch:
- Run one authenticated sandbox transaction using a dedicated test buyer.
- Confirm order row in Supabase, account order list/detail, customer confirmation email, and seller notification email.

### Resolved: Account-only checkout is enforced before PayPal

Anonymous checkout review now shows a localized login/register gate before payment and does not render PayPal. E2E also verifies anonymous account order lookup and order list routes redirect to login.

## High-Priority Issues

### H1. Production env file still contains placeholder live PayPal credentials while `PAYPAL_ENV=sandbox`

Impact: production deployment could silently remain in sandbox mode or fail live payment configuration.

Evidence:
- `.env.production` contains placeholder PayPal values and `PAYPAL_ENV=sandbox`.

Recommended fix:
- Before production launch, replace live PayPal credentials and set the intended PayPal environment explicitly.
- Keep sandbox config out of production deployment variables unless this is a staging deployment.

### H2. Authenticated account flow still needs a real test account pass

Impact: automated tests prove anonymous gating and page behavior, but do not yet prove login/register/reset-password against a real Supabase account and inbox.

Evidence:
- Login requires a dedicated test user.
- Reset-password requires receiving and opening a Supabase email link.

Recommended fix:
- Use a stable test buyer account for staging QA.
- Verify login, register, forgot-password email delivery, reset-password link, checkout return path, and account order pages.

### H3. Mobile checkout step navigation needs final visual verification

Impact: mobile buyers may see a broken checkout progress indicator, reducing trust during payment.

Evidence:
- Previous in-app browser narrow viewport showed the checkout step bar clipped at the left edge around the `Shipping` label.

Recommended fix:
- Make checkout step navigation wrap, scroll intentionally, or collapse to compact labels on mobile if the issue still reproduces.
- Verify `/en/checkout`, `/en/checkout?step=review`, and payment status UI at mobile width on staging.

### H4. E2E runner depends on a local Playwright browser

Impact: release smoke checks can fail before testing the app on a fresh machine.

Evidence:
- Previous setup needed Chromium in the Playwright cache.

Recommended fix:
- Document `./node_modules/.bin/playwright install chromium` in setup notes or add a guarded CI setup step.

### Resolved Since Previous QA: success warning details are no longer exposed

The success page no longer renders raw `seller-notification-failed:*` or `confirmation-email-failed:*` reasons. It now shows customer-safe pending/internal notice copy while keeping detailed reasons out of the UI.

## Deferrable Issues

### D1. E2E tests cover mostly English flows

Impact: localized checkout/auth copy regressions may be missed.

Recommended follow-up:
- Add at least one smoke path for `/de`, `/fr`, `/es` product detail, cart, checkout form labels, auth pages, and policy pages.

### D2. SEO verification is mostly code-level

Impact: deployed HTML should still be inspected after staging deployment.

Recommended follow-up:
- On staging, inspect actual rendered `metadata`, `sitemap.xml`, `robots.txt`, hreflang links, and JSON-LD with crawlers or browser source.

### D3. Policy content needs human legal review

Impact: text appears reasonable for pre-launch, but legal responsibility remains with the seller.

Recommended follow-up:
- Confirm individual seller identity, return exclusions, support response time, and EU consumer-right wording before public launch.

## Retest Checklist

- [x] `/en`, `/de`, `/fr`, `/es` home pages render.
- [ ] Product list and one product detail page render in each locale.
- [x] Product detail add-to-cart works.
- [x] Cart quantity increase/decrease/remove works.
- [x] Checkout shipping form validates required fields.
- [x] Checkout review shows correct item, shipping, subtotal, shipping, total.
- [x] Anonymous checkout is blocked before PayPal and shows a clear login/register path.
- [ ] Login/register returns the buyer to checkout with cart and shipping state preserved.
- [ ] Signed-in checkout creates PayPal sandbox order.
- [ ] PayPal sandbox approval captures payment.
- [x] Success page shows order data.
- [x] Cart is cleared after success.
- [ ] Supabase `orders` row exists with correct user, items, total, shipping address.
- [ ] Account order list shows the new order.
- [ ] Account order detail shows items, payment, customer, and shipping data.
- [ ] Customer confirmation email is delivered.
- [ ] Seller notification email is delivered.
- [ ] Login works.
- [ ] Register works.
- [ ] Forgot-password email is sent.
- [ ] Reset-password flow works from email link.
- [ ] Mobile home/product/cart/checkout/account pages have no blocking layout issues.
- [x] Cookie banner settings persist.
- [x] Privacy, terms, returns, and individual seller statement are reachable.
- [ ] `sitemap.xml`, `robots.txt`, metadata, hreflang, and JSON-LD are valid on staging.
