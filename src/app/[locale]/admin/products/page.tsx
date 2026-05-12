import { setRequestLocale } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect, Link } from '@/i18n/navigation';
import { Button, LinkButton } from '@/components/ui/Button';
import { Plus, ImageOff } from 'lucide-react';
import type { DbCategory, DbProduct } from '@/lib/catalogue';

async function load(locale: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { products: [], categories: [], configured: false };
  }
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect({ href: '/admin/login', locale: locale as 'en' | 'id' });

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('product_categories')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);

  return {
    products: (products ?? []) as DbProduct[],
    categories: (categories ?? []) as DbCategory[],
    configured: true,
  };
}

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { products, categories, configured } = await load(locale);

  const byCategory = new Map<string | null, DbProduct[]>();
  for (const p of products) {
    const key = p.category_id;
    const list = byCategory.get(key) ?? [];
    list.push(p);
    byCategory.set(key, list);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage the product catalogue. Inactive products are hidden from
            the public site but kept in the database.
          </p>
        </div>
        <LinkButton href="/admin/products/new" size="sm">
          <Plus className="h-4 w-4" />
          Add product
        </LinkButton>
      </header>

      {!configured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Supabase is not configured.
        </div>
      )}

      {categories.length === 0 && configured && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          No categories yet — <Link className="underline" href="/admin/categories">create at least one category</Link> before adding products.
        </div>
      )}

      <div className="space-y-8">
        {categories.map((cat) => {
          const items = byCategory.get(cat.id) ?? [];
          return (
            <section key={cat.id}>
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {cat.name_en} · <span className="text-slate-400">{cat.slug}</span>
                </h2>
                <span className="text-xs text-slate-400">{items.length} items</span>
              </div>
              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                  No products in this category yet.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {items.map((p) => (
                    <Link
                      key={p.id}
                      href={`/admin/products/${p.id}`}
                      className="group flex gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                        {p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image_url}
                            alt={p.name_en}
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-slate-300">
                            <ImageOff className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink-900">
                          {p.name_en}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-slate-500">
                          {p.slug}
                        </p>
                        <div className="mt-1.5 flex gap-1.5">
                          {!p.is_active && (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600">
                              hidden
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          );
        })}

        {byCategory.has(null) && (
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
              Uncategorised
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {byCategory.get(null)!.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/products/${p.id}`}
                  className="group flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/40 p-3 transition hover:-translate-y-0.5 hover:border-amber-300"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
                    {p.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={p.name_en} className="h-full w-full object-contain" />
                    )}
                  </div>
                  <p className="truncate text-sm font-semibold text-ink-900">{p.name_en}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
