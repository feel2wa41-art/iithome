'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const LABELS: Record<string, string> = {
  en: 'English',
  id: 'Indonesia',
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function change(next: string) {
    router.replace(pathname, { locale: next as 'en' | 'id' });
    setOpen(false);
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 text-sm font-medium text-ink-900 transition hover:border-slate-300 hover:bg-slate-50"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="h-4 w-4 text-slate-500" />
        <span className="uppercase tracking-wider">{locale}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg"
        >
          {routing.locales.map((l) => (
            <li key={l}>
              <button
                onClick={() => change(l)}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-2.5 text-sm hover:bg-slate-50',
                  l === locale && 'font-semibold text-brand-600'
                )}
              >
                <span>{LABELS[l]}</span>
                <span className="text-xs uppercase tracking-wider text-slate-400">
                  {l}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
