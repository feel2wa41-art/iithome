import { setRequestLocale } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import type { DbCategory } from '@/lib/catalogue';

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Supabase is not configured.
      </div>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect({ href: '/admin/login', locale: locale as 'en' | 'id' });

  const { data: categories } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">New product</h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in names and descriptions in both languages, upload an image,
          and click Create.
        </p>
      </header>
      <ProductForm initial={null} categories={(categories ?? []) as DbCategory[]} />
    </div>
  );
}
