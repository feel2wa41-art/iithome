'use client';

import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { NAV_LINKS } from '@/lib/constants';
import { Logo } from './Logo';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileMenu } from './MobileMenu';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LinkButton } from '@/components/ui/Button';

export function Header() {
  const t = useTranslations('nav');
  const tCta = useTranslations('cta');
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-300',
          scrolled
            ? 'border-b border-slate-200/70 bg-white/85 backdrop-blur-xl'
            : 'bg-transparent'
        )}
      >
        <div className="container-x flex h-16 items-center justify-between gap-4 sm:h-20">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-brand-700'
                      : 'text-ink-700 hover:text-ink-900'
                  )}
                >
                  {t(link.key)}
                  {isActive && (
                    <span className="absolute inset-x-4 -bottom-px h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher className="hidden sm:block" />
            <LinkButton
              href="/contact"
              variant="primary"
              size="sm"
              className="hidden md:inline-flex"
            >
              {tCta('getInTouch')}
            </LinkButton>
            <button
              onClick={() => setOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink-900 transition hover:bg-slate-50 lg:hidden"
              aria-label={t('menu')}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  );
}
