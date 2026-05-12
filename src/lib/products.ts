import fs from 'node:fs';
import path from 'node:path';

export interface CatalogueProduct {
  /** Human readable name derived from the file name */
  name: string;
  /** Public URL (encoded, ready to drop into <img src>) */
  image: string;
  /** Slug derived from the file name */
  slug: string;
}

export interface CatalogueCategory {
  /** URL-safe slug, used in routes */
  slug: string;
  /** Folder name on disk (may contain spaces) */
  folder: string;
  /** Display labels per locale */
  label: { en: string; id: string };
  /** Short description per locale */
  description: { en: string; id: string };
  /** Products inside this category */
  products: CatalogueProduct[];
}

// =========================================================================
// Category metadata. The `folder` field MUST match a folder under
// public/products/ exactly (including spaces).
// To add a new category: create the folder, drop product images in,
// then add an entry here.
// =========================================================================
const CATEGORIES: Omit<CatalogueCategory, 'products'>[] = [
  {
    slug: 'fiber-optic',
    folder: 'fiber optic',
    label: {
      en: 'Fiber Optic',
      id: 'Fiber Optik',
    },
    description: {
      en: 'Cables, connectors, splitters, attenuators and active modules — the core of your network.',
      id: 'Kabel, konektor, splitter, attenuator, dan modul aktif — inti dari jaringan Anda.',
    },
  },
  {
    slug: 'ftth-accessories',
    folder: 'accesories ftth',
    label: {
      en: 'FTTH Accessories',
      id: 'Aksesori FTTH',
    },
    description: {
      en: 'Clamps, brackets, suspensions and mounting hardware for reliable last-mile installations.',
      id: 'Klem, braket, suspensi, dan perangkat keras pemasangan untuk instalasi last-mile yang andal.',
    },
  },
];

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function prettifyName(fileBaseName: string): string {
  // Strip extension, replace separators, title-case, fix some common acronyms.
  const noExt = fileBaseName.replace(/\.[a-z0-9]+$/i, '');
  const spaced = noExt
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
  const titled = spaced
    .split(' ')
    .map((w) =>
      /^(rj45|sfp|qsfp|sc|upc|apc|ftth|utp|tp|tplink|cat6|bts|2|3|4|5v|6to16mm)$/i.test(w)
        ? w.toUpperCase()
        : w[0]?.toUpperCase() + w.slice(1).toLowerCase()
    )
    .join(' ');
  return titled
    .replace(/\bScupc\b/i, 'SC/UPC')
    .replace(/\bScapc\b/i, 'SC/APC')
    .replace(/\bSfpqsfp\b/i, 'SFP / QSFP')
    .replace(/\bTplink\b/i, 'TP-Link')
    .replace(/\bUtp\b/i, 'UTP');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Reads the public/products/* folders at request time (or build time on the
 * server) and returns the catalogue. Returns [] if a folder is missing.
 */
export function getCatalogue(): CatalogueCategory[] {
  const root = path.join(process.cwd(), 'public', 'products');

  return CATEGORIES.map((cat) => {
    const dir = path.join(root, cat.folder);
    let files: string[] = [];
    try {
      files = fs.readdirSync(dir);
    } catch {
      files = [];
    }

    const products: CatalogueProduct[] = files
      .filter((f) => IMAGE_EXT.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b))
      .map((file) => {
        const name = prettifyName(file);
        return {
          name,
          slug: slugify(name),
          // Properly URL-encode each path segment (handles spaces correctly).
          image: `/products/${encodeURIComponent(cat.folder)}/${encodeURIComponent(
            file
          )}`,
        };
      });

    return { ...cat, products };
  });
}

export function getCategoryBySlug(slug: string): CatalogueCategory | undefined {
  return getCatalogue().find((c) => c.slug === slug);
}
