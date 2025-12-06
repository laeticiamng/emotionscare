'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/react';

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n-core';

import '@/styles/print-b2b.css';

interface ReportPrintProps {
  title: string;
  period: string;
  teamLabel?: string | null;
  summary: string[];
  action: string;
  onExport?: () => Promise<void> | void;
  exportInFlight?: boolean;
}

export function ReportPrint({
  title,
  period,
  teamLabel,
  summary,
  action,
  onExport,
  exportInFlight = false,
}: ReportPrintProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');

  const handlePrint = () => {
    try {
      Sentry.addBreadcrumb({ category: 'b2b:report:print', level: 'info' });
    } catch (error) {
      console.debug('sentry.print.breadcrumb.failed', error);
    }
    window.print();
  };

  const handleExport = async () => {
    if (!onExport) {
      return;
    }
    setStatus('idle');
    try {
      await onExport();
      setStatus('done');
      try {
        Sentry.addBreadcrumb({ category: 'b2b:report:export_csv', level: 'info' });
      } catch (error) {
        console.debug('sentry.export.breadcrumb.failed', error);
      }
    } catch (error) {
      console.error('b2b.report.export.failed', error);
      setStatus('error');
    }
  };

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">{period}</p>
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          {teamLabel && <p className="text-sm text-slate-600">{teamLabel}</p>}
        </div>
        <p className="text-sm text-slate-500">{t('b2b.print.hint')}</p>
        <div className="flex flex-wrap gap-3 no-print">
          <Button onClick={handlePrint} variant="outline">
            Imprimer
          </Button>
          {onExport && (
            <Button onClick={handleExport} disabled={exportInFlight}>
              {t('b2b.report.export.csv')}
            </Button>
          )}
          {status === 'done' && <span className="text-sm text-emerald-600">Export prêt.</span>}
          {status === 'error' && <span className="text-sm text-rose-600">Export indisponible.</span>}
        </div>
      </header>

      <article className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="b2b-report-summary">
        <h2 id="b2b-report-summary" className="text-lg font-semibold text-slate-900">
          {t('b2b.report.summary.title')}
        </h2>
        <ul className="space-y-2">
          {summary.map((sentence, index) => (
            <li key={`${sentence}-${index}`} className="text-sm leading-relaxed text-slate-700" data-testid="report-summary-line">
              {sentence}
            </li>
          ))}
        </ul>
      </article>

      <article className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-labelledby="b2b-report-action">
        <h2 id="b2b-report-action" className="text-lg font-semibold text-slate-900">
          {t('b2b.report.action.title')}
        </h2>
        <p className="text-sm text-slate-700" data-testid="report-action-text">
          {action}
        </p>
      </article>
    </section>
  );
}
