import { setRequestLocale } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import type { DbCategory, DbProduct } from '@/lib/catalogue';

async function load(id: string, locale: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { product: null, categories: [], configured: false } as const;
  }
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect({ href: '/admin/login', locale: locale as 'en' | 'id' });

  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (id === 'new') {
    return {
      product: null,
      categories: (categories ?? []) as DbCategory[],
      configured: true,
    } as const;
  }

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) notFound();

  return {
    product: product as DbProduct,
    categories: (categories ?? []) as DbCategory[],
    configured: true,
  } as const;
}

export default async function AdminProductEditPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const data = await load(id, locale);

  if (!data.configured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Supabase is not configured.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">
          {data.product ? 'Edit product' : 'New product'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Names and descriptions support both languages. Upload an image — it
          gets stored in Supabase Storage (public).
        </p>
      </header>

      <ProductForm
        initial={data.product}
        categories={data.categories}
      />
    </div>
  );
}
