import { cache } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { BRAND_LOGO_SRC } from '@/lib/constants';

export interface SiteSettings {
  logoUrl: string | null;
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const defaults: SiteSettings = { logoUrl: BRAND_LOGO_SRC };
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return defaults;
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase
      .from('site_settings')
      .select('key, value')
      .in('key', ['logo_url']);
    const map = new Map<string, string | null>(
      (data ?? []).map((r) => [r.key as string, r.value as string | null])
    );
    return {
      logoUrl: map.get('logo_url') ?? defaults.logoUrl,
    };
  } catch {
    return defaults;
  }
});
