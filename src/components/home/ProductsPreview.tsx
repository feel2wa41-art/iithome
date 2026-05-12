import { useTranslations, useLocale } from 'next-intl';
import { Section, SectionHeader } from '@/components/ui/Section';
import { Eyebrow } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { ArrowUpRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getCatalogue } from '@/lib/products';

export function ProductsPreview() {
  const t = useTranslations('home.products');
  const locale = useLocale() as 'en' | 'id';
  const categories = getCatalogue();

  return (
    <Section>
      <div className="container-x">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeader
            className="mb-0"
            eyebrow={<Eyebrow>{t('eyebrow')}</Eyebrow>}
            title={t('title')}
            subtitle={t('subtitle')}
          />
          <LinkButton href="/products" variant="ghost" size="md">
            {t('viewAll')}
            <ArrowUpRight className="h-4 w-4" />
          </LinkButton>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {categories.map((cat) => {
            const sample = cat.products.slice(0, 4);
            return (
              <Link
                key={cat.slug}
                href="/products"
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_30px_80px_-25px_rgba(25,98,245,0.25)]"
              >
                <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-4">
                  {sample.map((p) => (
                    <div
                      key={p.slug}
                      className="aspect-square overflow-hidden bg-white"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                  ))}
                  {sample.length === 0 && (
                    <div className="col-span-full flex aspect-[4/1] items-center justify-center bg-gradient-to-br from-brand-50 to-accent-400/10 text-sm text-slate-500">
                      No products yet
                    </div>
                  )}
                </div>
                <div className="flex items-end justify-between p-6 sm:p-7">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                      {cat.products.length} {locale === 'id' ? 'produk' : 'products'}
                    </p>
                    <h3 className="mt-1.5 text-xl font-semibold text-ink-900 sm:text-2xl">
                      {cat.label[locale]}
                    </h3>
                    <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                      {cat.description[locale]}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 shrink-0 text-slate-400 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-brand-600" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
