'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Badge';
import { ShieldCheck, Wrench, Headset, TrendingUp } from 'lucide-react';

const ITEMS = [
  { key: 'premium', icon: ShieldCheck },
  { key: 'team', icon: Wrench },
  { key: 'support', icon: Headset },
  { key: 'scale', icon: TrendingUp },
] as const;

export function WhyUs() {
  const t = useTranslations('home.why');
  return (
    <Section className="bg-slate-50/60">
      <div className="container-x">
        <SectionHeader
          eyebrow={<Eyebrow>{t('eyebrow')}</Eyebrow>}
          title={t('title')}
        />
        <div className="grid gap-4 lg:grid-cols-2">
          {ITEMS.map((it, i) => {
            const Icon = it.icon;
            return (
              <motion.div
                key={it.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="flex items-start gap-5 rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7"
              >
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-900 text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-ink-900">
                    {t(`items.${it.key}.title`)}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                    {t(`items.${it.key}.desc`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
