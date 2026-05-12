import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Eyebrow } from '@/components/ui/Badge';
import { Card, CardIcon } from '@/components/ui/Card';
import { LinkButton } from '@/components/ui/Button';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { Cable, Network, Wrench, Cpu, Plug, MessageSquare } from 'lucide-react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { pickLocale } from '@/lib/utils';
import type { Product } from '@/types';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  cable: Cable,
  ftth: Network,
  splice: Wrench,
  active: Cpu,
  accessory: Plug,
};

async function getProducts(): Promise<Product[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    if (error) return [];
    return (data ?? []) as Product[];
  } catch {
    return [];
  }
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('products');
  const tCta = await getTranslations('cta');

  const products = await getProducts();

  return (
    <>
      <section className="container-x pb-10 pt-16 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance text-ink-900 sm:text-5xl lg:text-6xl">
            {t('title')}
          </h1>
          <p className="mt-6 text-lg text-slate-600">{t('subtitle')}</p>
        </div>
      </section>

      {/* Categories */}
      <section className="container-x pb-20">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PRODUCT_CATEGORIES.map((cat) => {
            const Icon = ICONS[cat.key];
            return (
              <Card key={cat.slug} className="!p-5">
                <CardIcon>
                  <Icon className="h-5 w-5" />
                </CardIcon>
                <h3 className="text-base font-semibold text-ink-900">
                  {t(`categories.${cat.key}`)}
                </h3>
              </Card>
            );
          })}
        </div>

        {/* Catalogue */}
        <div className="mt-16">
          {products.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-base text-slate-600">{t('comingSoon')}</p>
              <div className="mt-6 flex justify-center">
                <LinkButton href="/contact" variant="primary" size="md">
                  <MessageSquare className="h-4 w-4" />
                  {tCta('requestQuote')}
                </LinkButton>
              </div>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <Card key={p.id} className="!p-0 overflow-hidden">
                  <div className="aspect-[4/3] w-full bg-gradient-to-br from-brand-50 to-accent-400/10">
                    {p.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.image_url}
                        alt={pickLocale(p, 'name', locale)}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-ink-900">
                      {pickLocale(p, 'name', locale)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {pickLocale(p, 'short', locale) ||
                        pickLocale(p, 'description', locale)}
                    </p>
                    <div className="mt-4">
                      <LinkButton href="/contact" variant="outline" size="sm">
                        {t('inquire')}
                      </LinkButton>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
