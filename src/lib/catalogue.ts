/**
 * Catalogue data access — reads products + categories from Supabase,
 * falls back to the filesystem when Supabase is unconfigured or empty.
 */
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { getCatalogue as getFilesystemCatalogue } from '@/lib/products';

export interface DbCategory {
  id: string;
  slug: string;
  name_en: string;
  name_id: string;
  description_en: string | null;
  description_id: string | null;
  sort_order: number;
}

export interface DbProduct {
  id: string;
  category_id: string | null;
  slug: string;
  name_en: string;
  name_id: string;
  short_en: string | null;
  short_id: string | null;
  description_en: string | null;
  description_id: string | null;
  image_url: string | null;
  gallery: string[] | null;
  specs: Record<string, string> | null;
  is_active: boolean;
  sort_order: number;
}

export interface CatalogueCategoryView {
  id: string | null;
  slug: string;
  label: { en: string; id: string };
  description: { en: string; id: string };
  products: CatalogueProductView[];
}

export interface CatalogueProductView {
  id: string | null;
  slug: string;
  name: { en: string; id: string };
  short: { en: string; id: string };
  description: { en: string; id: string };
  image: string | null;
}

/**
 * Returns the public catalogue. Reads from Supabase first; if unconfigured
 * or empty, falls back to the local filesystem scan in `lib/products`.
 */
export async function getCatalogueView(): Promise<CatalogueCategoryView[]> {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = await createSupabaseServerClient();
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase
          .from('product_categories')
          .select('*')
          .order('sort_order', { ascending: true }),
        supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true }),
      ]);

      if (cats && cats.length > 0) {
        const categories = (cats as DbCategory[]).filter(
          (c) => c.slug === 'fiber-optic' || c.slug === 'ftth-accessories' || (prods as DbProduct[] | null)?.some(p => p.category_id === c.id)
        );

        // Build view
        const view: CatalogueCategoryView[] = categories.map((c) => ({
          id: c.id,
          slug: c.slug,
          label: { en: c.name_en, id: c.name_id },
          description: {
            en: c.description_en ?? '',
            id: c.description_id ?? '',
          },
          products: ((prods as DbProduct[] | null) ?? [])
            .filter((p) => p.category_id === c.id)
            .map((p) => ({
              id: p.id,
              slug: p.slug,
              name: { en: p.name_en, id: p.name_id },
              short: { en: p.short_en ?? '', id: p.short_id ?? '' },
              description: {
                en: p.description_en ?? '',
                id: p.description_id ?? '',
              },
              image: p.image_url,
            })),
        }));

        const total = view.reduce((s, c) => s + c.products.length, 0);
        if (total > 0) return view;
      }
    } catch {
      // fall through to filesystem
    }
  }

  // Filesystem fallback
  const fs = getFilesystemCatalogue();
  return fs.map((c) => ({
    id: null,
    slug: c.slug,
    label: c.label,
    description: c.description,
    products: c.products.map((p) => ({
      id: null,
      slug: p.slug,
      name: { en: p.name, id: p.name },
      short: { en: '', id: '' },
      description: { en: '', id: '' },
      image: p.image,
    })),
  }));
}
