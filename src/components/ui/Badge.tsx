import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export function Eyebrow({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700',
        className
      )}
      {...props}
    />
  );
}

export function Dot() {
  return (
    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-500">
      <span className="absolute inset-0 inline-flex h-full w-full animate-ping rounded-full bg-accent-500 opacity-60" />
    </span>
  );
}
