import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import Link from 'next/link';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-700 shadow-[0_8px_30px_-8px_rgba(25,98,245,0.6)] hover:-translate-y-0.5',
  secondary:
    'bg-ink-900 text-white hover:bg-ink-800 shadow-[0_8px_30px_-8px_rgba(10,18,36,0.5)] hover:-translate-y-0.5',
  ghost: 'text-ink-900 hover:bg-slate-100',
  outline:
    'border border-slate-300 text-ink-900 hover:border-ink-900 hover:bg-white',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-12 px-7 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = 'primary', size = 'md', ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

interface LinkButtonProps {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

export function LinkButton({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  target,
  rel,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
