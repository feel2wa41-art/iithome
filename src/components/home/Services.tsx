'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Card, CardIcon } from '@/components/ui/Card';
import { Eyebrow } from '@/components/ui/Badge';
import { Cable, RadioTower, PackageOpen, Globe2 } from 'lucide-react';

const SERVICES = [
  { key: 'fiber', icon: Cable },
  { key: 'telecom', icon: RadioTower },
  { key: 'supply', icon: PackageOpen },
  { key: 'trade', icon: Globe2 },
] as const;

export function Services() {
  const t = useTranslations('home.services');
  return (
    <Section>
      <div className="container-x">
        <SectionHeader
          eyebrow={<Eyebrow>{t('eyebrow')}</Eyebrow>}
          title={t('title')}
          subtitle={t('subtitle')}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Card className="h-full">
                  <CardIcon>
                    <Icon className="h-6 w-6" />
                  </CardIcon>
                  <h3 className="text-lg font-semibold text-ink-900">
                    {t(`items.${s.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {t(`items.${s.key}.desc`)}
                  </p>
                  <div className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-300/0 to-transparent transition-all duration-300 group-hover:via-brand-300" />
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
