# PT International Information Technology — Website

Modern, mobile-first, bilingual (English / Bahasa Indonesia) corporate site built
with Next.js, Tailwind CSS and Supabase — designed to replace the existing Wix
site with a faster, fully-controlled, free-to-host stack.

## Stack

- **Framework**: Next.js 15 (App Router, RSC)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom design system
- **Animation**: Framer Motion
- **i18n**: `next-intl` (`/en`, `/id`)
- **DB / Auth / Storage**: Supabase
- **Hosting**: Vercel (free tier)

## Project layout

```
src/
  app/
    [locale]/
      page.tsx              # Home
      about/page.tsx
      products/page.tsx
      contact/page.tsx
      careers/page.tsx
      admin/
        layout.tsx
        page.tsx            # Dashboard
        login/page.tsx
        inquiries/page.tsx
        products/page.tsx
        careers/page.tsx
        content/page.tsx
    api/
      contact/route.ts      # Inquiry POST
      careers/route.ts      # Application POST
  components/
    layout/                 # Header, Footer, Logo, MobileMenu, LanguageSwitcher, AdminFab
    home/                   # Hero, Stats, Services, ProductsPreview, WhyUs, CTA
    contact/                # ContactForm
    admin/                  # AdminSidebar
    ui/                     # Button, Card, Input, Section, Container, Badge
  i18n/                     # next-intl routing + request config
  lib/
    supabase/               # Browser + server clients, schema.sql
    utils.ts
    constants.ts
  types/
messages/
  en.json
  id.json
```

## Getting started

```bash
npm install
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
# http://localhost:3000 → redirects to /en
```

Even without Supabase, the site renders and the contact form responds
gracefully (logs to server console).

## Supabase setup

1. Create a project at https://supabase.com
2. Project Settings → API — copy the URL and `anon` key into `.env.local`
3. SQL editor — paste & run `src/lib/supabase/schema.sql`
4. Authentication → Users — invite or create your admin user (email + password)
5. Sign in at `/en/admin/login`

The schema includes RLS policies that allow:
- public read of products, categories, hero slides, careers, content
- anon inserts for inquiries and applications
- authenticated full access for admin operations

## Deploy to Vercel

1. Push this repo to GitHub
2. Vercel → New Project → import the repo
3. Add env vars (same as `.env.local`)
4. Deploy — Vercel auto-detects Next.js

`NEXT_PUBLIC_SITE_URL` should be the production domain once known.

## Customisation

- **Copy / strings**: edit `messages/en.json` and `messages/id.json`
- **Colors / theme**: `tailwind.config.ts` (brand / accent / ink palettes)
- **Brand info**: `src/lib/constants.ts` (address, email, phone)
- **Logo mark**: `src/components/layout/Logo.tsx`
- **Sections on home**: re-order in `src/app/[locale]/page.tsx`

## Replacing Wix — migration checklist

- [ ] Point your existing domain to Vercel (DNS A/AAAA + CNAME)
- [ ] Export Wix content (texts, images) — drop images into `public/`
- [ ] Seed real products into Supabase (`public.products`)
- [ ] Create career postings in `public.career_postings`
- [ ] Update office address / phone / email in `messages/*.json` + `constants.ts`
- [ ] Replace placeholder OpenStreetMap iframe in `contact/page.tsx` with the
      real address bounding box (or switch to Google Maps embed)
- [ ] Add Vercel Analytics (free) for traffic insights

## Costs

- Vercel Hobby plan: $0
- Supabase Free tier: $0 (500MB DB, 5GB bandwidth, 50k MAUs)
- Domain: existing
- Total per month: **$0** (until you outgrow the free tiers — at which point
  scaling is linear and predictable, unlike Wix)
