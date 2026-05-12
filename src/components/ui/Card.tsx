import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_20px_60px_-20px_rgba(25,98,245,0.25)]',
        className
      )}
      {...props}
    />
  );
}

export function CardIcon({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-accent-400/10 text-brand-600 ring-1 ring-brand-100',
        className
      )}
      {...props}
    />
  );
}
