'use client';

import { useEffect, useState } from 'react';

import { ReportPrint } from '@/app/(app)/b2b/components/ReportPrint';
import { exportMonthlyReportCsv, fetchMonthlyReport, type MonthlyReportPayload } from '@/services/b2b/suiteClient';

interface ReportPageProps {
  params: {
    period: string;
  };
}

export default function B2BMonthlyReportPage({ params }: ReportPageProps) {
  const { period } = params;
  const [report, setReport] = useState<MonthlyReportPayload | null>(null);
  const [status, setStatus] = useState<'loading' | 'error' | 'idle'>('loading');
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setStatus('loading');
    fetchMonthlyReport(period)
      .then((payload) => {
        if (!isMounted) return;
        setReport(payload);
        setStatus('idle');
      })
      .catch((error) => {
        console.error('b2b.report.fetch.failed', error);
        if (!isMounted) return;
        setStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, [period]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const payload = await exportMonthlyReportCsv(period);
      if (payload.url) {
        window.open(payload.url, '_blank', 'noopener,noreferrer');
        return;
      }
      if (payload.fallback?.csv) {
        const blob = new Blob([payload.fallback.csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `rapport-${period}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('b2b.report.export.error', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 p-6" aria-live="polite">
      {status === 'loading' && (
        <p className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">Chargement du rapport…</p>
      )}

      {status === 'error' && (
        <p className="rounded-lg border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
          Rapport indisponible pour cette période.
        </p>
      )}

      {status === 'idle' && report && (
        <ReportPrint
          title={report.title}
          period={report.period}
          teamLabel={report.team_label}
          summary={report.summary}
          action={report.action}
          onExport={handleExport}
          exportInFlight={exporting}
        />
      )}
    </main>
  );
}
