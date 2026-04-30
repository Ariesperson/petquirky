# PetQuirky

PetQuirky is a multilingual Next.js 16 storefront for unique pets.

## Setup

1. Create `.env.local` from `.env.example`
2. Install dependencies
3. Apply Supabase migrations
4. Start the dev server

```bash
npm install
supabase db push
npm run dev
```

## Verification

```bash
npm run lint
npm run build
```

## Important Paths

- `src/app/[locale]/*` storefront routes
- `src/app/api/paypal/*` PayPal handlers
- `src/app/api/email/*` email handlers
- `src/lib/supabase/*` Supabase helpers
- `supabase/migrations/*` database schema
- `docs/01-launch/launch-checklist.md` launch prep

## Required External Services

- Supabase
- PayPal
- Resend

## Notes

- returns policy is `14 days`
- EUR prices use the `€` suffix
- checkout, auth, and email flows require valid environment variables
