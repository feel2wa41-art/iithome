'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const NUMBERS = [
  { value: '2023', key: 'since' },
  { value: '50+', key: 'projects' },
  { value: '99.9%', key: 'uptime' },
  { value: '20+', key: 'partners' },
] as const;

export function Stats() {
  const t = useTranslations('home.stats');
  return (
    <section className="border-y border-slate-200 bg-white">
      <div className="container-x grid grid-cols-2 gap-y-8 py-10 sm:py-14 lg:grid-cols-4 lg:gap-x-12">
        {NUMBERS.map((n, i) => (
          <motion.div
            key={n.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            className="flex flex-col items-start sm:items-center sm:text-center"
          >
            <p className="text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              {n.value}
            </p>
            <p className="mt-1 text-sm font-medium uppercase tracking-[0.12em] text-slate-500">
              {t(n.key)}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
