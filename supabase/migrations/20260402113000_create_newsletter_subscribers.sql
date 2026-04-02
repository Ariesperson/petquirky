create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  locale text,
  source text not null default 'homepage',
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists newsletter_subscribers_email_lower_idx
  on public.newsletter_subscribers (lower(email));

alter table public.newsletter_subscribers enable row level security;

drop policy if exists "newsletter_insert_public" on public.newsletter_subscribers;
create policy "newsletter_insert_public"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

comment on table public.newsletter_subscribers is 'Homepage newsletter signups collected through the PetQuirky marketing form.';
