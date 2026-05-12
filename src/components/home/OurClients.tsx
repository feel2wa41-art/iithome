'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Badge';
import { CLIENTS } from '@/lib/clients';

export function OurClients() {
  const t = useTranslations('home.clients');

  // If no clients have been added yet, hide the section entirely.
  if (CLIENTS.length === 0) return null;

  return (
    <Section className="bg-white">
      <div className="container-x">
        <SectionHeader
          eyebrow={<Eyebrow>{t('eyebrow')}</Eyebrow>}
          title={t('title')}
          subtitle={t('subtitle')}
          center
        />

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-200/80 sm:grid-cols-3 lg:grid-cols-6">
          {CLIENTS.map((client, i) => {
            const inner = (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={client.logo}
                alt={client.name}
                title={client.name}
                loading="lazy"
                className="max-h-12 w-auto max-w-[140px] object-contain opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
            );

            return (
              <motion.div
                key={client.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35, delay: (i % 6) * 0.04 }}
                className="group flex aspect-[3/2] items-center justify-center bg-white p-6 sm:aspect-[5/3]"
              >
                {client.href ? (
                  <a
                    href={client.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={client.name}
                  >
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
