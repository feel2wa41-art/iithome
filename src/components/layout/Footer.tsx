import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Logo } from './Logo';
import { Mail, MapPin, Phone } from 'lucide-react';
import { SITE } from '@/lib/constants';

export function Footer() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-600">
              {t('brand.tagline')} —{' '}
              {t('home.hero.subtitle').slice(0, 140)}…
            </p>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-brand-600" />
                <span>{SITE.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-brand-600" />
                <a
                  href={`mailto:${SITE.email}`}
                  className="hover:text-ink-900"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-brand-600" />
                <span>{SITE.phone}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-900">
              {t('footer.explore')}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <Link className="hover:text-ink-900" href="/about">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link className="hover:text-ink-900" href="/products">
                  {t('nav.products')}
                </Link>
              </li>
              <li>
                <Link className="hover:text-ink-900" href="/careers">
                  {t('nav.careers')}
                </Link>
              </li>
              <li>
                <Link className="hover:text-ink-900" href="/contact">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink-900">
              {t('footer.legal')}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                <Link className="hover:text-ink-900" href="/">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link className="hover:text-ink-900" href="/">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>
            © {year} {SITE.name}. {t('footer.rights')}
          </p>
          <p>Built with Next.js · Vercel · Supabase</p>
        </div>
      </div>
    </footer>
  );
}
