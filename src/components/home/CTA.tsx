'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { LinkButton } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  const t = useTranslations('home.cta');

  return (
    <section className="container-x py-16 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-brand-950 to-ink-900 px-6 py-14 text-white sm:px-12 sm:py-20 lg:px-20"
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage:
              'radial-gradient(ellipse at 50% 50%, black 30%, transparent 80%)',
          }}
          aria-hidden="true"
        />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent-500/30 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-5xl">
              {t('title')}
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/70 sm:text-lg">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <LinkButton href="/contact" variant="primary" size="lg">
              {t('primary')}
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton
              href="/about"
              variant="ghost"
              size="lg"
              className="!bg-white/10 !text-white hover:!bg-white/15"
            >
              {t('secondary')}
            </LinkButton>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
