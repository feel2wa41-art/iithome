import { setRequestLocale } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/navigation';
import { Mail, Briefcase, Boxes, Eye } from 'lucide-react';

async function loadStats(locale: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { inquiries: 0, applications: 0, products: 0, configured: false };
  }
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect({ href: '/admin/login', locale: locale as 'en' | 'id' });

  const [{ count: inquiries }, { count: applications }, { count: products }] =
    await Promise.all([
      supabase.from('inquiries').select('*', { count: 'exact', head: true }),
      supabase
        .from('career_applications')
        .select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
    ]);

  return {
    inquiries: inquiries ?? 0,
    applications: applications ?? 0,
    products: products ?? 0,
    configured: true,
  };
}

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const stats = await loadStats(locale);

  const cards = [
    { label: 'New inquiries', icon: Mail, value: stats.inquiries },
    { label: 'Career applications', icon: Briefcase, value: stats.applications },
    { label: 'Products in catalogue', icon: Boxes, value: stats.products },
    { label: 'Live site visits (Vercel)', icon: Eye, value: '—' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Overview of submissions and catalogue state.
        </p>
        {!stats.configured && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            Supabase is not configured yet. Copy <code>.env.local.example</code>{' '}
            to <code>.env.local</code>, fill in your project URL and anon key,
            then run the SQL in{' '}
            <code>src/lib/supabase/schema.sql</code>.
          </div>
        )}
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {c.label}
                </span>
                <Icon className="h-4 w-4 text-slate-400" />
              </div>
              <p className="mt-4 text-3xl font-semibold text-ink-900">
                {c.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
        <h2 className="text-base font-semibold">Next steps</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
          <li>Set <code>NEXT_PUBLIC_SUPABASE_URL</code> &amp; <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>.env.local</code>.</li>
          <li>Run <code>src/lib/supabase/schema.sql</code> in the Supabase SQL editor.</li>
          <li>Create your first admin user in Supabase Auth.</li>
          <li>Deploy to Vercel — push to GitHub and import the repo.</li>
        </ol>
      </div>
    </div>
  );
}
