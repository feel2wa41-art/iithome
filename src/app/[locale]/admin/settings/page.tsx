import { setRequestLocale } from 'next-intl/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/navigation';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { SITE } from '@/lib/constants';

const CONTACT_KEYS = [
  'logo_url',
  'contact_address',
  'contact_phone',
  'contact_email',
  'contact_hours_en',
  'contact_hours_id',
] as const;

async function load(locale: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { configured: false as const };
  }
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect({ href: '/admin/login', locale: locale as 'en' | 'id' });

  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
    .in('key', CONTACT_KEYS as unknown as string[]);

  const map = new Map<string, string | null>(
    (data ?? []).map((r) => [r.key as string, r.value as string | null])
  );

  return {
    configured: true as const,
    logoUrl: map.get('logo_url') ?? null,
    contactAddress: map.get('contact_address') ?? SITE.address,
    contactPhone: map.get('contact_phone') ?? SITE.phone,
    contactEmail: map.get('contact_email') ?? SITE.email,
    contactHoursEn: map.get('contact_hours_en') ?? SITE.hoursEn,
    contactHoursId: map.get('contact_hours_id') ?? SITE.hoursId,
  };
}

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const result = await load(locale);

  if (!result.configured) {
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
      <SettingsForm
        initialLogoUrl={result.logoUrl}
        initialContact={{
          address: result.contactAddress,
          phone: result.contactPhone,
          email: result.contactEmail,
          hoursEn: result.contactHoursEn,
          hoursId: result.contactHoursId,
        }}
      />
    </div>
  );
}
