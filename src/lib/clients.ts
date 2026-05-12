// =========================================================================
// Our Clients — edit this list to add / remove clients on the homepage.
// =========================================================================
// 1. Drop the logo file into public/clients/  (e.g. public/clients/telkom.svg)
// 2. Add an entry below.
// 3. Commit & push — Vercel redeploys automatically.
//
// Tip: prefer SVG. PNG with transparent background also works fine.
// =========================================================================

export interface Client {
  /** Display name (used as alt text + tooltip) */
  name: string;
  /** Path under /public — must start with "/clients/..." */
  logo: string;
  /** Optional website URL — wraps the logo in a link if set */
  href?: string;
}

export const CLIENTS: Client[] = [
  // ---- Examples (replace with real clients once you have permission) ----
  // { name: 'Telkom Indonesia', logo: '/clients/telkom.svg', href: 'https://telkom.co.id' },
  // { name: 'Indosat Ooredoo Hutchison', logo: '/clients/indosat.svg' },
  // { name: 'XL Axiata', logo: '/clients/xl.svg' },
  // { name: 'Bank Negara Indonesia', logo: '/clients/bni.svg' },
  // { name: 'PLN', logo: '/clients/pln.svg' },
  // { name: 'Pertamina', logo: '/clients/pertamina.svg' },
];
