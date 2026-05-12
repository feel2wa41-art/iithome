'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Send, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const MESSAGES = {
  en: {
    name: 'Please enter at least 2 characters.',
    email: 'Please enter a valid email address.',
    message: 'Message must be at least 5 characters.',
  },
  id: {
    name: 'Minimal 2 karakter.',
    email: 'Masukkan alamat email yang valid.',
    message: 'Pesan minimal 5 karakter.',
  },
} as const;

function buildSchema(locale: string) {
  const m = MESSAGES[locale as 'en' | 'id'] ?? MESSAGES.en;
  return z.object({
    name: z.string().min(2, { message: m.name }),
    email: z.string().email({ message: m.email }),
    phone: z.string().optional(),
    company: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(5, { message: m.message }),
  });
}

type FormValues = z.infer<ReturnType<typeof buildSchema>>;

export function ContactForm() {
  const t = useTranslations('contact.form');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors, isSubmitted },
  } = useForm<FormValues>({
    resolver: zodResolver(buildSchema(locale)),
    mode: 'onBlur',
  });

  async function onSubmit(values: FormValues) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-8 text-emerald-900">
        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        <p className="mt-4 text-base font-medium">{t('success')}</p>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="name"
          label={t('name')}
          required
          error={errors.name?.message}
        >
          <Input
            id="name"
            autoComplete="name"
            {...register('name')}
            aria-invalid={!!errors.name}
            className={cn(errors.name && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10')}
          />
        </Field>
        <Field
          id="email"
          label={t('email')}
          required
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            className={cn(errors.email && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10')}
          />
        </Field>
        <Field id="phone" label={t('phone')}>
          <Input id="phone" autoComplete="tel" {...register('phone')} />
        </Field>
        <Field id="company" label={t('company')}>
          <Input id="company" autoComplete="organization" {...register('company')} />
        </Field>
      </div>
      <Field id="subject" label={t('subject')}>
        <Input id="subject" {...register('subject')} />
      </Field>
      <Field
        id="message"
        label={t('message')}
        required
        error={errors.message?.message}
      >
        <Textarea
          id="message"
          rows={6}
          {...register('message')}
          aria-invalid={!!errors.message}
          className={cn(errors.message && 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10')}
        />
      </Field>

      {status === 'error' && (
        <p className="flex items-start gap-2 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {t('error')}
        </p>
      )}

      {isSubmitted && errorCount > 0 && status !== 'error' && (
        <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {locale === 'id'
            ? 'Mohon periksa kolom yang ditandai.'
            : 'Please check the highlighted fields.'}
        </p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        <Send className="h-4 w-4" />
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} required={required}>
        {label}
      </Label>
      {children}
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
