import { setRequestLocale } from 'next-intl/server';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import type { ReactNode } from 'react';

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <AdminSidebar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
