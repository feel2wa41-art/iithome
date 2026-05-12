import { setRequestLocale } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/navigation';
import { CategoriesEditor } from '@/components/admin/CategoriesEditor';
import type { DbCategory } from '@/lib/catalogue';

async function load(locale: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { rows: [], configured: false };
  }
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect({ href: '/admin/login', locale: locale as 'en' | 'id' });
  const { data } = await supabase
    .from('product_categories')
    .select('*')
    .order('sort_order', { ascending: true });
  return { rows: (data ?? []) as DbCategory[], configured: true };
}

export default async function AdminCategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { rows, configured } = await load(locale);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">Categories</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage product categories. Slug is the URL-safe identifier
          (don&apos;t change after publishing). Name + description support
          both languages (EN / ID).
        </p>
      </header>

      {!configured ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Supabase is not configured. Set env vars and redeploy first.
        </div>
      ) : (
        <CategoriesEditor initial={rows} />
      )}
    </div>
  );
}
