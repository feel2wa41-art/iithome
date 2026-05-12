import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Eyebrow } from '@/components/ui/Badge';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardIcon } from '@/components/ui/Card';
import { Sparkles, Handshake, Lightbulb, Check } from 'lucide-react';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  const missions = t.raw('mission.items') as string[];

  return (
    <>
      <section className="container-x pb-10 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance text-ink-900 sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg text-slate-600 sm:text-xl">{t('lead')}</p>
        </div>
      </section>

      <Section className="!pt-10">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-5 text-base leading-relaxed text-slate-700">
              <p>{t('body1')}</p>
              <p>{t('body2')}</p>
              <p>{t('body3')}</p>
            </div>
            <aside className="space-y-6">
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                  {t('vision.title')}
                </p>
                <p className="mt-3 text-base leading-relaxed text-ink-900">
                  {t('vision.text')}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                  {t('mission.title')}
                </p>
                <ul className="mt-3 space-y-2.5">
                  {missions.map((m) => (
                    <li key={m} className="flex items-start gap-2.5 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <Section className="bg-slate-50/60">
        <div className="container-x">
          <SectionHeader title={t('values.title')} center />
          <div className="grid gap-5 sm:grid-cols-3">
            {(
              [
                { key: 'quality', icon: Sparkles },
                { key: 'trust', icon: Handshake },
                { key: 'innovation', icon: Lightbulb },
              ] as const
            ).map((v) => {
              const Icon = v.icon;
              return (
                <Card key={v.key}>
                  <CardIcon>
                    <Icon className="h-5 w-5" />
                  </CardIcon>
                  <h3 className="text-lg font-semibold">
                    {t(`values.items.${v.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {t(`values.items.${v.key}.desc`)}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </Section>
    </>
  );
}
