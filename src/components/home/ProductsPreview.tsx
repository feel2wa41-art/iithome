'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { ArrowUpRight, Cable, Network, Wrench, Cpu, Plug } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cable: Cable,
  ftth: Network,
  splice: Wrench,
  active: Cpu,
  accessory: Plug,
};

export function ProductsPreview() {
  const t = useTranslations('home.products');
  const tCat = useTranslations('products.categories');

  return (
    <Section>
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            className="mb-0"
            eyebrow={<Eyebrow>{t('eyebrow')}</Eyebrow>}
            title={t('title')}
            subtitle={t('subtitle')}
          />
          <LinkButton href="/products" variant="ghost" size="md">
            {t('viewAll')}
            <ArrowUpRight className="h-4 w-4" />
          </LinkButton>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PRODUCT_CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.key];
            return (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
              >
                <Link
                  href="/products"
                  className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_20px_60px_-20px_rgba(25,98,245,0.25)]"
                >
                  <Icon className="h-7 w-7 text-brand-600" />
                  <div className="mt-12">
                    <p className="text-base font-semibold text-ink-900">
                      {tCat(cat.key)}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors group-hover:text-brand-600">
                      <span>View</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br from-brand-100 to-accent-400/20 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
