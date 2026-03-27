# Phase Map

## Phase 1

Primary outcomes:

- locale infrastructure
- global layout
- homepage

Primary routes and files:

- `src/proxy.ts`
- `src/lib/i18n.ts`
- `src/i18n/*.json`
- `src/app/[locale]/layout.tsx`
- `src/app/[locale]/page.tsx`
- `src/components/layout/*`
- `src/components/home/*`

Acceptance highlights:

- four locales work
- cookie consent persists in `localStorage`
- header and footer visually match the target
- mobile `375px` layout is intentional

## Phase 2

Primary outcomes:

- product data
- listing
- detail
- search

Primary routes and files:

- `src/data/products/*`
- `src/data/reviews.json`
- `src/data/shipping.json`
- `src/lib/products.ts`
- `src/lib/shipping.ts`
- `src/lib/search.ts`
- `src/app/[locale]/products/page.tsx`
- `src/app/[locale]/products/[slug]/page.tsx`
- `src/components/product/*`
- `src/components/layout/SearchOverlay.tsx`

Acceptance highlights:

- filter, sort, and search work
- review distribution is rendered from static data
- only approved badges are used
- mobile add-to-cart stays fixed
- sitemap covers products across locales

## Phase 3

Primary outcomes:

- cart
- auth
- checkout
- order completion

Primary routes and files:

- `src/context/CartContext.tsx`
- `src/context/AuthContext.tsx`
- `src/hooks/useCart.ts`
- `src/hooks/useAuth.ts`
- `src/lib/auth.ts`
- `src/lib/supabase/*`
- `src/app/[locale]/cart/page.tsx`
- `src/app/[locale]/auth/**/*`
- `src/app/[locale]/account/**/*`
- `src/app/[locale]/checkout/**/*`
- `src/app/api/paypal/**/*`
- `src/app/api/contact/route.ts`
- `src/components/cart/*`
- `src/components/auth/*`
- `src/components/account/*`
- `src/components/checkout/*`

Acceptance highlights:

- guest checkout works end to end
- sandbox PayPal succeeds
- successful payment clears cart and persists order
- free shipping threshold is `50 €`

## Phase 4

Primary outcomes:

- blog
- legal pages
- SEO

Primary routes and files:

- `src/data/blog/*`
- `src/lib/blog.ts`
- `src/lib/seo.ts`
- `src/app/[locale]/blog/**/*`
- `src/app/[locale]/policies/**/*`
- `src/app/[locale]/about/page.tsx`
- `src/app/[locale]/contact/page.tsx`
- `src/app/not-found.tsx`
- `src/app/sitemap.ts`
- `src/app/robots.ts`
- `src/components/blog/*`
- `src/components/seo/JsonLd.tsx`

Acceptance highlights:

- legal pages respect 14-day returns
- page metadata includes canonical, hreflang, OG, and Twitter cards
- product pages use Product schema
- blog pages use Article schema
