# PetQuirky Launch Checklist

## Environment Variables

```env
NEXT_PUBLIC_SITE_URL=https://petquirky.com

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENV=sandbox

RESEND_API_KEY=
RESEND_FROM_EMAIL=
SELLER_EMAIL=hello@petquirky.com
```

## Supabase

```bash
supabase db push
```

Verify:

- `public.orders` exists
- `public.orders.items` exists
- RLS is enabled
- email/password auth is enabled
- SMTP points to Resend

## PayPal

Verify:

- sandbox checkout succeeds
- client and server keys use the same environment
- switch `PAYPAL_ENV` to `live` only with live credentials

## Resend

Verify:

- sender domain or sender address is verified
- customer confirmation email is delivered
- seller notification email is delivered

## Final QA

```bash
npm run lint
npm run build
```

Manual checks:

- four locales route correctly
- checkout writes orders
- account page reads orders
- blog/legal/404 render correctly
- `/sitemap.xml` and `/robots.txt` respond correctly
