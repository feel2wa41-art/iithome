import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export function Section({
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <section className={cn('section-pad', className)} {...props} />;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  center?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mb-12 max-w-3xl',
        center && 'mx-auto text-center',
        className
      )}
    >
      {eyebrow && <div className="mb-4 flex justify-start">{center ? <div className="mx-auto">{eyebrow}</div> : eyebrow}</div>}
      <h2 className="text-3xl font-semibold text-balance text-ink-900 sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base text-slate-600 sm:text-lg">{subtitle}</p>
      )}
    </div>
  );
}
