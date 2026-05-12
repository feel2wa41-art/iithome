'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { LinkButton } from '@/components/ui/Button';
import { Eyebrow, Dot } from '@/components/ui/Badge';
import { ArrowRight, Boxes } from 'lucide-react';

export function Hero() {
  const t = useTranslations('home.hero');

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 hero-grid" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-hero-glow" aria-hidden="true" />

      {/* Falling fiber lines */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {[10, 25, 40, 55, 70, 85].map((left, i) => (
          <span
            key={i}
            className="fiber-line"
            style={{
              left: `${left}%`,
              animationDelay: `${i * 0.9}s`,
              animationDuration: `${5 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      <div className="container-x relative pb-20 pt-16 sm:pt-20 lg:pb-32 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <Eyebrow>
            <Dot />
            {t('eyebrow')}
          </Eyebrow>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-balance text-ink-900 sm:text-5xl md:text-6xl lg:text-[4.25rem] lg:leading-[1.05]">
            {t('title').split('—')[0]}
            <span className="gradient-text"> {t('title').split(' ').slice(-2).join(' ')}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base text-slate-600 sm:text-lg sm:leading-relaxed">
            {t('subtitle')}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: 'easeOut' }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <LinkButton href="/contact" variant="primary" size="lg">
              {t('primary')}
              <ArrowRight className="h-4 w-4" />
            </LinkButton>
            <LinkButton href="/products" variant="outline" size="lg">
              <Boxes className="h-4 w-4" />
              {t('secondary')}
            </LinkButton>
          </motion.div>
        </motion.div>

        {/* Hero card / preview */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br from-ink-900 via-ink-800 to-brand-950 p-1 shadow-[0_30px_120px_-30px_rgba(10,18,36,0.45)]">
            <div className="relative overflow-hidden rounded-[20px] bg-ink-900">
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
              <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-3 lg:p-16">
                <NetworkMetric
                  label="Backbone fiber"
                  value="48 ~ 288 core"
                  delay={0.1}
                />
                <NetworkMetric
                  label="FTTH coverage"
                  value="GPON · XGS-PON"
                  delay={0.2}
                />
                <NetworkMetric
                  label="Service level"
                  value="24/7 NOC"
                  delay={0.3}
                />
              </div>
              {/* Animated pulse */}
              <div className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[80%] -translate-x-1/2 rounded-full bg-accent-500/20 blur-3xl" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function NetworkMetric({
  label,
  value,
  delay,
}: {
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur"
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/50">
        {label}
      </p>
      <p className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
        {value}
      </p>
      <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-accent-400 to-brand-400 [background-size:200%_100%] animate-shimmer" />
      </div>
    </motion.div>
  );
}
