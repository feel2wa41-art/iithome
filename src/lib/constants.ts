export const SITE = {
  name: 'PT International Information Technology',
  short: 'IIT',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  email: 'contact@iit.co.id',
  phone: '+62 21 0000 0000',
  address: 'Jakarta, Indonesia',
  founded: 2023,
};

/**
 * Custom logo file. Set to a path under /public to override the built-in
 * SVG fiber mark. Leave as null to fall back to the default mark.
 */
export const BRAND_LOGO_SRC: string | null = '/logo/logo_iit.png';

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
