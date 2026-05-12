import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Eyebrow } from '@/components/ui/Badge';
import { ContactForm } from '@/components/contact/ContactForm';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');

  const info = [
    { icon: MapPin, key: 'office', value: 'officeAddress' },
    { icon: Mail, key: 'email', value: 'emailValue' },
    { icon: Phone, key: 'phone', value: 'phoneValue' },
    { icon: Clock, key: 'hours', value: 'hoursValue' },
  ] as const;

  return (
    <section className="container-x py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Eyebrow>{t('eyebrow')}</Eyebrow>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance text-ink-900 sm:text-5xl lg:text-6xl">
          {t('title')}
        </h1>
        <p className="mt-6 text-lg text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-10 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {info.map((row) => {
              const Icon = row.icon;
              return (
                <div
                  key={row.key}
                  className="flex items-start gap-4 rounded-2xl border border-slate-200/80 bg-white p-5"
                >
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      {t(`info.${row.key}`)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-ink-900">
                      {t(`info.${row.value}`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <iframe
              title="Office location"
              className="block h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.openstreetmap.org/export/embed.html?bbox=106.7%2C-6.35%2C106.95%2C-6.1&layer=mapnik"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
