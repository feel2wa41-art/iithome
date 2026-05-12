-- =========================================================
-- PT International Information Technology — Supabase schema
-- Run this in the Supabase SQL editor for your new project.
-- =========================================================

-- Categories for the product catalogue
create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_id text not null,
  description_en text,
  description_id text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.product_categories(id) on delete set null,
  slug text unique not null,
  name_en text not null,
  name_id text not null,
  short_en text,
  short_id text,
  description_en text,
  description_id text,
  specs jsonb,
  image_url text,
  gallery jsonb,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Hero slides / banners (editable in admin)
create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_id text not null,
  subtitle_en text,
  subtitle_id text,
  image_url text,
  cta_label_en text,
  cta_label_id text,
  cta_href text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Contact form inquiries
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  subject text,
  message text not null,
  source text default 'contact_form',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Career postings
create table if not exists public.career_postings (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_en text not null,
  title_id text not null,
  location text,
  type text,
  description_en text,
  description_id text,
  requirements_en text,
  requirements_id text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Career applications
create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  posting_id uuid references public.career_postings(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  resume_url text,
  cover_letter text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- Site-wide editable strings (key/value, EN + ID)
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value_en text,
  value_id text,
  updated_at timestamptz not null default now()
);

-- =========================================================
-- Row Level Security (RLS)
-- =========================================================
alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.hero_slides enable row level security;
alter table public.inquiries enable row level security;
alter table public.career_postings enable row level security;
alter table public.career_applications enable row level security;
alter table public.site_content enable row level security;

-- Public read for catalogue and content
create policy "public read categories"
  on public.product_categories for select using (true);
create policy "public read products"
  on public.products for select using (is_active = true);
create policy "public read hero"
  on public.hero_slides for select using (is_active = true);
create policy "public read careers"
  on public.career_postings for select using (is_active = true);
create policy "public read site_content"
  on public.site_content for select using (true);

-- Public can insert into inquiries / applications (anon)
create policy "anon submit inquiry"
  on public.inquiries for insert with check (true);
create policy "anon submit application"
  on public.career_applications for insert with check (true);

-- Authenticated (admin) users can do everything.
-- In production: lock this down further by checking auth.jwt() role,
-- or use the service-role key from secure server routes only.
create policy "auth all categories"
  on public.product_categories for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all products"
  on public.products for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth all hero"
  on public.hero_slides for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth read inquiries"
  on public.inquiries for select using (auth.role() = 'authenticated');
create policy "auth update inquiries"
  on public.inquiries for update using (auth.role() = 'authenticated');
create policy "auth all careers"
  on public.career_postings for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth read applications"
  on public.career_applications for select using (auth.role() = 'authenticated');
create policy "auth all site_content"
  on public.site_content for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- =========================================================
-- Seed sample categories so the catalogue page is not empty
-- =========================================================
insert into public.product_categories (slug, name_en, name_id, sort_order) values
  ('cable',     'Fiber Cables',       'Kabel Fiber',         1),
  ('ftth',      'FTTH Equipment',     'Perangkat FTTH',      2),
  ('splice',    'Splice & Tools',     'Splice & Peralatan',  3),
  ('active',    'Active Equipment',   'Perangkat Aktif',     4),
  ('accessory', 'Accessories',        'Aksesori',            5)
  on conflict (slug) do nothing;
