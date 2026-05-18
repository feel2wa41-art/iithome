import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { BRAND_LOGO_SRC, SITE } from '@/lib/constants';

export interface SiteSettings {
  logoUrl: string | null;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  contactHoursEn: string;
  contactHoursId: string;
}

const SETTING_KEYS = [
  'logo_url',
  'contact_address',
  'contact_phone',
  'contact_email',
  'contact_hours_en',
  'contact_hours_id',
] as const;

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const defaults: SiteSettings = {
    logoUrl: BRAND_LOGO_SRC,
    contactAddress: SITE.address,
    contactPhone: SITE.phone,
    contactEmail: SITE.email,
    contactHoursEn: SITE.hoursEn,
    contactHoursId: SITE.hoursId,
  };
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return defaults;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', SETTING_KEYS as unknown as string[]);
    const map = new Map<string, string | null>(
      (data ?? []).map((r) => [r.key as string, r.value as string | null])
    );
    return {
      logoUrl: map.get('logo_url') ?? defaults.logoUrl,
      contactAddress: map.get('contact_address') || defaults.contactAddress,
      contactPhone: map.get('contact_phone') || defaults.contactPhone,
      contactEmail: map.get('contact_email') || defaults.contactEmail,
      contactHoursEn: map.get('contact_hours_en') || defaults.contactHoursEn,
      contactHoursId: map.get('contact_hours_id') || defaults.contactHoursId,
    };
  } catch {
    return defaults;
  }
});
