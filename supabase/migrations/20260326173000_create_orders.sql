create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending',
  total numeric(10, 2) not null check (total >= 0),
  currency text not null default 'EUR' check (currency = 'EUR'),
  payer_email text,
  items jsonb not null default '[]'::jsonb,
  shipping_address jsonb not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

create index if not exists orders_status_idx
  on public.orders (status);

alter table public.orders enable row level security;

drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own"
  on public.orders
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own"
  on public.orders
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "orders_update_own" on public.orders;
create policy "orders_update_own"
  on public.orders
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.orders is 'PetQuirky customer orders synced from checkout success flow.';
comment on column public.orders.items is 'Snapshot of purchased line items stored as JSON.';
comment on column public.orders.shipping_address is 'Checkout shipping address snapshot stored as JSON.';
