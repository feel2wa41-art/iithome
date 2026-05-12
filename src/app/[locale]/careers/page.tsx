import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Eyebrow } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { pickLocale } from '@/lib/utils';
import type { CareerPosting } from '@/types';
import { Briefcase, MapPin } from 'lucide-react';

async function getPostings(): Promise<CareerPosting[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('career_postings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    if (error) return [];
    return (data ?? []) as CareerPosting[];
  } catch {
    return [];
  }
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('careers');
  const tCta = await getTranslations('cta');

  const postings = await getPostings();

  return (
    <section className="container-x py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance text-ink-900 sm:text-5xl lg:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-6 text-lg text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="mx-auto mt-16 max-w-4xl">
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          {t('open')}
        </h2>

        {postings.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-base text-slate-600">{t('noOpenings')}</p>
            <div className="mt-6 flex justify-center">
              <LinkButton href="/contact" variant="primary" size="md">
                {tCta('getInTouch')}
              </LinkButton>
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {postings.map((p) => (
              <li
                key={p.id}
                className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 transition hover:border-brand-200 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-ink-900">
                    {pickLocale(p, 'title', locale)}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                    {p.type && (
                      <span className="inline-flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5" />
                        {p.type}
                      </span>
                    )}
                    {p.location && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {p.location}
                      </span>
                    )}
                  </div>
                </div>
                <LinkButton
                  href={`/contact?position=${encodeURIComponent(p.slug)}`}
                  variant="primary"
                  size="sm"
                >
                  {t('apply')}
                </LinkButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
