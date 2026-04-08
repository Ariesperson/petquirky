# Supabase Setup

This project persists authenticated customer orders in `public.orders`.

## Apply migrations

Run the migration with the Supabase CLI against your project:

```bash
supabase db push
```

Or apply the SQL manually in the Supabase SQL editor using:

- `supabase/migrations/20260326173000_create_orders.sql`
- `supabase/migrations/20260326190000_add_items_to_orders.sql`

## Expected environment variables

Set these values in your local `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_SITE_URL=...
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
PAYPAL_ENV=sandbox
RESEND_API_KEY=...
RESEND_FROM_EMAIL=...
SELLER_EMAIL=969939390@qq.com
```

## Orders table shape

The app expects:

- `id text primary key`
- `user_id uuid references auth.users(id)`
- `status text`
- `total numeric(10,2)`
- `currency text`
- `items jsonb`
- `payer_email text`
- `shipping_address jsonb`
- `created_at timestamptz`
