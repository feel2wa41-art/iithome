import { setRequestLocale } from 'next-intl/server';

export default async function AdminContentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">Site content</h1>
        <p className="mt-1 text-sm text-slate-500">
          Edit reusable site-wide strings (key + EN / ID value).
        </p>
      </header>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Connect this page to <code>public.site_content</code>. Current copy
        lives in <code>messages/en.json</code> and{' '}
        <code>messages/id.json</code> — move per-string overrides into the
        DB as you go.
      </div>
    </div>
  );
}
