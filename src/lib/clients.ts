// =========================================================================
// Our Clients — homepage "Our Clients" section.
// Drop a logo into public/clients/  then add an entry below.
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
  { name: 'FiberStar',  logo: '/clients/FIBERSTAR.png' },
  { name: 'iForte',     logo: '/clients/IFORTE.png' },
  { name: 'Iconnet',    logo: '/clients/Iconnet-1.png' },
  { name: 'Lintasarta', logo: '/clients/Logo-Lintasarta-new.png' },
  { name: 'Link Net',   logo: '/clients/default-thumbnail-ln-new.png' },
  { name: 'MyRepublic', logo: '/clients/myrepublic.webp' },
  { name: 'SKD',        logo: '/clients/SKD.png' },
  { name: 'TBG',        logo: '/clients/TBG HD.png' },
  { name: 'BTS Attendance', logo: '/clients/logo-aaattendance-bts.png' },
];
