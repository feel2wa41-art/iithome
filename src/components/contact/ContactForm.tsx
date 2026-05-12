'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Textarea, Label } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Send } from 'lucide-react';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(5),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations('contact.form');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name" required>
            {t('name')}
          </Label>
          <Input id="name" autoComplete="name" {...register('name')} aria-invalid={!!errors.name} />
        </div>
        <div>
          <Label htmlFor="email" required>
            {t('email')}
          </Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} aria-invalid={!!errors.email} />
        </div>
        <div>
          <Label htmlFor="phone">{t('phone')}</Label>
          <Input id="phone" autoComplete="tel" {...register('phone')} />
        </div>
        <div>
          <Label htmlFor="company">{t('company')}</Label>
          <Input id="company" autoComplete="organization" {...register('company')} />
        </div>
      </div>
      <div>
        <Label htmlFor="subject">{t('subject')}</Label>
        <Input id="subject" {...register('subject')} />
      </div>
      <div>
        <Label htmlFor="message" required>
          {t('message')}
        </Label>
        <Textarea id="message" rows={6} {...register('message')} aria-invalid={!!errors.message} />
      </div>

      {status === 'error' && (
        <p className="text-sm text-rose-600">{t('error')}</p>
      )}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        <Send className="h-4 w-4" />
        {isSubmitting ? t('submitting') : t('submit')}
      </Button>
    </form>
  );
}
