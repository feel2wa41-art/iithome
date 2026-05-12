'use client';

import { useEffect } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { NAV_LINKS } from '@/lib/constants';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Logo } from './Logo';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LinkButton } from '@/components/ui/Button';

export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations('nav');
  const tCta = useTranslations('cta');
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-ink-900/60 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
      />
      <div
        className={cn(
          'absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <Logo />
          <button
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-ink-900 hover:bg-slate-50"
            aria-label={t('close')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    onClick={onClose}
                    href={link.href}
                    className={cn(
                      'flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium transition',
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-900 hover:bg-slate-50'
                    )}
                  >
                    {t(link.key)}
                    <span className="text-xs uppercase tracking-wider text-slate-400">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="space-y-3 border-t border-slate-100 px-6 py-5">
          <LanguageSwitcher />
          <LinkButton href="/contact" variant="primary" size="md" className="w-full">
            {tCta('getInTouch')}
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
