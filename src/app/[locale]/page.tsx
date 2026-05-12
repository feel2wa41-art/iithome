import { setRequestLocale } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { Stats } from '@/components/home/Stats';
import { Services } from '@/components/home/Services';
import { ProductsPreview } from '@/components/home/ProductsPreview';
import { WhyUs } from '@/components/home/WhyUs';
import { OurClients } from '@/components/home/OurClients';
import { CTA } from '@/components/home/CTA';
import type { Locale } from '@/types';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Stats />
      <Services />
      <ProductsPreview locale={locale as Locale} />
      <WhyUs />
      <OurClients />
      <CTA />
    </>
  );
}
