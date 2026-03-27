alter table public.orders
  add column if not exists items jsonb not null default '[]'::jsonb;

comment on column public.orders.items is 'Snapshot of purchased line items stored as JSON.';
