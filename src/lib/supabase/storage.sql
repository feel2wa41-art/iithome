-- =========================================================================
-- Supabase Storage setup — run AFTER schema.sql in the SQL editor.
-- =========================================================================
-- Creates:
--   * "products" bucket (public) — product images uploaded from admin
--   * "branding" bucket (public) — logo + brand assets
-- =========================================================================

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do update set public = true;

-- ---- Public read policies (anyone can fetch the image URL) ----
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'public read products'
  ) then
    create policy "public read products"
      on storage.objects for select
      using (bucket_id = 'products');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'public read branding'
  ) then
    create policy "public read branding"
      on storage.objects for select
      using (bucket_id = 'branding');
  end if;

  -- ---- Authenticated users (admins) can upload + manage ----
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'auth insert products'
  ) then
    create policy "auth insert products"
      on storage.objects for insert
      with check (bucket_id = 'products' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'auth update products'
  ) then
    create policy "auth update products"
      on storage.objects for update
      using (bucket_id = 'products' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'auth delete products'
  ) then
    create policy "auth delete products"
      on storage.objects for delete
      using (bucket_id = 'products' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'auth insert branding'
  ) then
    create policy "auth insert branding"
      on storage.objects for insert
      with check (bucket_id = 'branding' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'auth update branding'
  ) then
    create policy "auth update branding"
      on storage.objects for update
      using (bucket_id = 'branding' and auth.role() = 'authenticated');
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'auth delete branding'
  ) then
    create policy "auth delete branding"
      on storage.objects for delete
      using (bucket_id = 'branding' and auth.role() = 'authenticated');
  end if;
end $$;

-- =========================================================================
-- Settings table — single-row key/value store used by admin Settings page.
-- =========================================================================
create table if not exists public.site_settings (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'site_settings'
      and policyname = 'public read settings'
  ) then
    create policy "public read settings"
      on public.site_settings for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'site_settings'
      and policyname = 'auth write settings'
  ) then
    create policy "auth write settings"
      on public.site_settings for all
      using (auth.role() = 'authenticated')
      with check (auth.role() = 'authenticated');
  end if;
end $$;
