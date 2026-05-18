import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AdminFab } from '@/components/layout/AdminFab';
import { getSiteSettings } from '@/lib/site-settings';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isId = locale === 'id';

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    ),
    title: {
      default: 'PT International Information Technology',
      template: '%s — PT International Information Technology',
    },
    description: isId
      ? 'PT International Information Technology — penyedia solusi Fiber Optic, FTTH, dan telekomunikasi terpercaya di Indonesia.'
      : 'PT International Information Technology — fiber optic, FTTH and telecommunication solutions trusted across Indonesia.',
    openGraph: {
      type: 'website',
      locale: isId ? 'id_ID' : 'en_US',
      siteName: 'PT International Information Technology',
    },
    alternates: {
      languages: {
        en: '/en',
        id: '/id',
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32' },
        { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
        { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
        { url: '/favicon-192.png', type: 'image/png', sizes: '192x192' },
        { url: '/favicon-512.png', type: 'image/png', sizes: '512x512' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
      shortcut: '/favicon.ico',
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'id')) {
    notFound();
  }
  setRequestLocale(locale);
  const [messages, settings] = await Promise.all([
    getMessages(),
    getSiteSettings(),
  ]);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Header logoSrc={settings.logoUrl} />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <AdminFab />
    </NextIntlClientProvider>
  );
}
