'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

import ZeroNumberBoundary from '@/components/accessibility/ZeroNumberBoundary';

const NAV_ITEMS = [
  { href: '/b2b', label: 'Accueil' },
  { href: '/b2b/rh', label: 'Climat RH' },
  { href: '/b2b/teams', label: 'Équipes' },
  { href: '/b2b/events', label: 'Événements' },
  { href: '/b2b/optimisation', label: 'Optimisation' },
  { href: '/b2b/security', label: 'Sécurité' },
  { href: '/b2b/audit', label: 'Audit' },
  { href: '/b2b/help-center', label: 'Centre d’aide' },
];

export function B2BLayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <ZeroNumberBoundary as="div" className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-slate-500">Suite B2B</p>
            <h1 className="text-2xl font-semibold text-slate-900">Pilotage des équipes</h1>
            <p className="text-sm text-slate-600">Gestion unifiée des équipes, événements, sécurité et conformité.</p>
          </div>
          <nav aria-label="Navigation B2B" className="flex flex-wrap gap-2 text-sm font-medium">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-3 py-1 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          {children}
        </div>
      </main>
    </ZeroNumberBoundary>
  );
}
