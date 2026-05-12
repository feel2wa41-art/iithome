import { setRequestLocale } from 'next-intl/server';

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">Products</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage the product catalogue. CRUD UI is scaffolded — use Supabase
          Studio (Table editor) for fast edits today, and we can wire forms
          here next.
        </p>
      </header>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Catalogue editor coming next — for now manage rows directly in
        Supabase Studio → <code>public.products</code>.
      </div>
    </div>
  );
}
