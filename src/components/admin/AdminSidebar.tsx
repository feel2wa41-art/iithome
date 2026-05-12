'use client';

import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Boxes,
  Mail,
  Briefcase,
  FileText,
  LogOut,
} from 'lucide-react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from '@/i18n/navigation';

const ITEMS = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Boxes, label: 'Products' },
  { href: '/admin/inquiries', icon: Mail, label: 'Inquiries' },
  { href: '/admin/careers', icon: Briefcase, label: 'Careers' },
  { href: '/admin/content', icon: FileText, label: 'Content' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === '/admin/login') return null;

  async function signOut() {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    router.replace('/admin/login');
  }

  function isActive(href: string) {
    return href === '/admin'
      ? pathname === '/admin'
      : pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile / tablet: horizontal scrollable pill nav */}
      <nav className="-mx-4 mb-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-center gap-2 whitespace-nowrap">
          {ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition',
                  active
                    ? 'border-brand-200 bg-brand-50 text-brand-700'
                    : 'border-slate-200 bg-white text-ink-700 hover:bg-slate-50'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </nav>

      {/* Desktop: vertical sidebar */}
      <aside className="hidden w-60 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-4">
          <p className="px-2 pb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Admin
          </p>
          <nav className="space-y-0.5">
            {ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                    active
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-ink-700 hover:bg-slate-50'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={signOut}
            className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
