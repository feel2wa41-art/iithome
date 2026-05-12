'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Lock } from 'lucide-react';

export function AdminFab() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <Link
      href="/admin/login"
      className="group fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2.5 text-sm font-medium text-ink-900 shadow-[0_8px_30px_-8px_rgba(10,18,36,0.25)] backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 sm:bottom-8 sm:right-8"
      aria-label={t('admin')}
    >
      <Lock className="h-4 w-4 text-slate-500 group-hover:text-brand-600" />
      {t('admin')}
    </Link>
  );
}
