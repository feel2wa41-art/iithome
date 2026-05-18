export const SITE = {
  name: 'PT International Information Technology',
  short: 'IIT',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  email: 'Rian@iitjkt.id',
  phone: '+62 852-8322-5892',
  address:
    'Jl. Amil No.26C, RT.2/RW.5, Kalibata, Kec. Pancoran, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12740',
  hoursEn: 'Mon – Fri · 8:00 am – 5:00 pm',
  hoursId: 'Sen – Jum · 08:00 – 17:00 WIB',
  founded: 2023,
};

/**
 * Custom logo file. Set to a path under /public to override the built-in
 * SVG fiber mark. Leave as null to fall back to the default mark.
 *
 * The "_clean" version has been chroma-keyed (white background removed)
 * by scripts/process-logo.mjs so it looks good on dark sections too.
 * Re-run `npm run logo` after replacing logo_iit.png to regenerate.
 */
export const BRAND_LOGO_SRC: string | null = '/logo/logo_iit_clean.png';

export const NAV_LINKS = [
  { href: '/', key: 'home' as const },
  { href: '/about', key: 'about' as const },
  { href: '/products', key: 'products' as const },
  { href: '/careers', key: 'careers' as const },
  { href: '/contact', key: 'contact' as const },
];

export const PRODUCT_CATEGORIES = [
  { slug: 'cable', key: 'cable' as const },
  { slug: 'ftth', key: 'ftth' as const },
  { slug: 'splice', key: 'splice' as const },
  { slug: 'active', key: 'active' as const },
  { slug: 'accessory', key: 'accessory' as const },
];
