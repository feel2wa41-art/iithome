import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function pickLocale(
  obj: Record<string, unknown> | object,
  field: string,
  locale: string
): string {
  const o = obj as Record<string, unknown>;
  return (o[`${field}_${locale}`] as string) ?? (o[`${field}_en`] as string) ?? '';
}
