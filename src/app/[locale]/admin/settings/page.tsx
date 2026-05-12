import { setRequestLocale } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/navigation';
import { SettingsForm } from '@/components/admin/SettingsForm';

async function load(locale: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { logoUrl: null as string | null, configured: false };
  }
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect({ href: '/admin/login', locale: locale as 'en' | 'id' });
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('key', 'logo_url')
    .maybeSingle();
  return {
    logoUrl: (data?.value as string | null) ?? null,
    configured: true,
  };
}

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { logoUrl, configured } = await load(locale);

  if (!configured) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        Supabase is not configured.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Brand & site-wide settings. Changes take effect immediately on the
          public site.
        </p>
      </header>
      <SettingsForm initialLogoUrl={logoUrl} />
    </div>
  );
}
