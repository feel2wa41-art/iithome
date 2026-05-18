import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import { BRAND_LOGO_SRC, SITE } from '@/lib/constants';

export function Logo({
  className,
  variant = 'dark',
  src,
}: {
  className?: string;
  variant?: 'dark' | 'light';
  /**
   * Optional logo image override. When `undefined`, falls back to
   * `BRAND_LOGO_SRC` in constants. When explicitly `null`, the
   * built-in SVG fiber mark is used.
   */
  src?: string | null;
}) {
  const finalSrc = src === undefined ? BRAND_LOGO_SRC : src;

  if (finalSrc) {
    return (
      <Link
        href="/"
        className={cn('inline-flex items-center', className)}
        aria-label={SITE.name}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={finalSrc}
          alt={SITE.name}
          className="h-10 w-auto sm:h-12"
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        'group inline-flex items-center gap-2.5 font-semibold tracking-tight',
        variant === 'light' ? 'text-white' : 'text-ink-900',
        className
      )}
      aria-label={SITE.name}
    >
      <BuiltInMark />
      <span className="flex flex-col leading-tight">
        <span className="text-base font-semibold sm:text-lg">
          {SITE.short}
        </span>
        <span
          className={cn(
            'text-[10px] font-medium uppercase tracking-[0.18em]',
            variant === 'light' ? 'text-white/60' : 'text-slate-500'
          )}
        >
          International Information Technology
        </span>
      </span>
    </Link>
  );
}

function BuiltInMark() {
  return (
    <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-[0_8px_24px_-8px_rgba(25,98,245,0.6)]">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M4 6.5C8 6.5 9 17.5 13 17.5C17 17.5 18 6.5 22 6.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M2 12C6 12 7 12 11 12C15 12 16 12 20 12"
          stroke="white"
          strokeOpacity="0.55"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeDasharray="1 2.5"
        />
      </svg>
    </span>
  );
}
