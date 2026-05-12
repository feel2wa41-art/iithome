import { setRequestLocale } from 'next-intl/server';

export default async function AdminCareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">Careers</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage open positions and review applications.
        </p>
      </header>
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
        Careers admin coming next — manage <code>public.career_postings</code>{' '}
        and <code>public.career_applications</code> directly in Supabase
        Studio in the meantime.
      </div>
    </div>
  );
}
