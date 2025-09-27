'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { listReportPeriods } from '@/services/b2b/suiteClient';

export default function B2BReportsIndexPage() {
  const [periods, setPeriods] = useState<string[]>([]);
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;
    listReportPeriods()
      .then((items) => {
        if (!isMounted) return;
        setPeriods(items);
        setStatus('idle');
      })
      .catch((error) => {
        console.error('b2b.report.periods.failed', error);
        if (!isMounted) return;
        setStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6" aria-labelledby="b2b-reports-index">
      <div className="space-y-2">
        <h1 id="b2b-reports-index" className="text-2xl font-semibold text-slate-900">
          Rapports mensuels anonymisés
        </h1>
        <p className="text-sm text-slate-600">
          Retrouver chaque synthèse mensuelle (3 phrases + 1 action faisable), sans chiffre ni données nominatives.
        </p>
      </div>

      {status === 'loading' && (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">Chargement des périodes…</p>
      )}

      {status === 'error' && (
        <p className="rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
          Impossible de charger les périodes disponibles pour le moment.
        </p>
      )}

      {status === 'idle' && periods.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
          Aucun rapport textuel disponible pour l’instant.
        </p>
      )}

      {periods.length > 0 && (
        <ul className="space-y-3">
          {periods.map((period) => (
            <li key={period}>
              <Link
                href={`/b2b/reports/${period}`}
                className="flex flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                <span className="text-sm font-medium text-slate-900">Rapport {period}</span>
                <span className="text-xs uppercase tracking-wide text-slate-500">Organisation complète</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
