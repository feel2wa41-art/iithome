import { setRequestLocale } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/navigation';
import type { Inquiry } from '@/types';

async function load(locale: string): Promise<Inquiry[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect({ href: '/admin/login', locale: locale as 'en' | 'id' });
  const { data } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  return (data ?? []) as Inquiry[];
}

export default async function InquiriesAdminPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const rows = await load(locale);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">Inquiries</h1>
        <p className="mt-1 text-sm text-slate-500">
          Submissions from the contact form.
        </p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        {rows.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500">
            No inquiries yet.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(r.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-900">{r.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    <a
                      className="hover:text-brand-700"
                      href={`mailto:${r.email}`}
                    >
                      {r.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{r.company || '—'}</td>
                  <td className="max-w-md truncate px-4 py-3 text-slate-600">
                    {r.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
