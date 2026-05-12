import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Eyebrow } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { getCatalogue } from '@/lib/products';
import { MessageSquare } from 'lucide-react';
import type { Locale } from '@/types';

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const tCta = await getTranslations('cta');
  const categories = getCatalogue();
  const lang = (locale as Locale) ?? 'en';

  const totalProducts = categories.reduce((s, c) => s + c.products.length, 0);

  return (
    <>
      <section className="container-x pb-10 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance text-ink-900 sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg text-slate-600">{t('subtitle')}</p>
          {totalProducts > 0 && (
            <p className="mt-4 text-sm font-medium uppercase tracking-[0.14em] text-slate-400">
              {totalProducts} {lang === 'id' ? 'produk dalam katalog' : 'products in catalogue'}
            </p>
          )}
        </div>
      </section>

      {totalProducts === 0 ? (
        <section className="container-x pb-24">
          <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-base text-slate-600">{t('comingSoon')}</p>
            <div className="mt-6 flex justify-center">
              <LinkButton href="/contact" variant="primary" size="md">
                <MessageSquare className="h-4 w-4" />
                {tCta('requestQuote')}
              </LinkButton>
            </div>
          </div>
        </section>
      ) : (
        <section className="container-x pb-24">
          <div className="space-y-20">
            {categories.map((cat) => (
              <div key={cat.slug} id={cat.slug} className="scroll-mt-24">
                <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
                      {cat.products.length} {lang === 'id' ? 'produk' : 'products'}
                    </p>
                    <h2 className="mt-1 text-2xl font-semibold text-ink-900 sm:text-3xl">
                      {cat.label[lang]}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                      {cat.description[lang]}
                    </p>
                  </div>
                </div>

                {cat.products.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                    {t('comingSoon')}
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {cat.products.map((p) => (
                      <article
                        key={p.slug}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_20px_60px_-20px_rgba(25,98,245,0.25)]"
                      >
                        <div className="relative aspect-square overflow-hidden bg-slate-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="h-full w-full object-contain p-4 transition duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-4">
                          <h3 className="text-sm font-semibold leading-snug text-ink-900">
                            {p.name}
                          </h3>
                          <a
                            href={`/${locale}/contact?product=${encodeURIComponent(p.name)}`}
                            className="mt-3 inline-flex items-center text-xs font-medium text-brand-600 hover:text-brand-700"
                          >
                            {t('inquire')} →
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 rounded-3xl bg-gradient-to-br from-ink-900 via-brand-950 to-ink-900 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <h3 className="text-2xl font-semibold sm:text-3xl">
              {lang === 'id'
                ? 'Tidak menemukan yang Anda cari?'
                : "Can't find what you're looking for?"}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              {lang === 'id'
                ? 'Tim kami menyediakan ratusan SKU tambahan dan dapat melakukan sumber khusus untuk proyek Anda.'
                : 'Our team stocks hundreds of additional SKUs and can custom-source for your project.'}
            </p>
            <div className="mt-6 inline-flex">
              <LinkButton href="/contact" variant="primary" size="lg">
                <MessageSquare className="h-4 w-4" />
                {tCta('requestQuote')}
              </LinkButton>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
