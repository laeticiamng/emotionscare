import React from 'react';
import { Sentry } from '@/lib/errors/sentry-compat';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Share2 } from 'lucide-react';
import PageSEO from '@/components/seo/PageSEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ff } from '@/lib/flags/ff';
import { b2bRoutes } from '@/lib/routes';
import { useAggregateSummaries, type AggregateSummary } from '@/services/b2b/reportsApi';
import { generateMonthlyNarrative } from '@/features/b2b/reports/narrative';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';
import '@/styles/print-b2b.css';

dayjs.locale('fr');

const formatter = new Intl.DateTimeFormat('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function formatPeriodLabel(period: string): string {
  const parsed = dayjs(`${period}-01`);
  if (!parsed.isValid()) {
    return period;
  }
  const label = parsed.format('MMMM YYYY');
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function buildCsvContent(_period: string, summaries: AggregateSummary[] | undefined): string {
  const header = 'period,instrument,text_summary,action';
  const rows = (summaries ?? []).map(summary => {
    const values = [
      summary.period,
      summary.instrument,
      summary.text.replace(/"/g, '""'),
      summary.action ? summary.action.replace(/"/g, '""') : '',
    ];
    return values.map(value => `"${value}"`).join(',');
  });
  return [header, ...rows].join('\n');
}

const B2BReportDetailPage: React.FC = () => {
  const { period: rawPeriod } = useParams();
  const location = useLocation();
  const period = rawPeriod ?? '';
  const reportsEnabled = ff('FF_B2B_REPORTS');
  const { user } = useAuth();
  const { toast } = useToast();
  const orgId = user?.user_metadata?.org_id as string | undefined;
  const orgName = (user?.user_metadata?.org_name as string | undefined) ?? 'Votre organisation';
  const query = useAggregateSummaries({ orgId, period }, { enabled: reportsEnabled });

  React.useEffect(() => {
    if (!reportsEnabled || !period) {
      return;
    }
    Sentry.addBreadcrumb({
      category: 'b2b:reports:view',
      message: 'detail',
      level: 'info',
      data: { period },
    });
  }, [reportsEnabled, period]);

  const narrative = React.useMemo(() => {
    if (!query.data || query.data.length === 0) {
      return null;
    }
    return generateMonthlyNarrative(query.data);
  }, [query.data]);

  const generationDate = formatter.format(new Date());
  const periodLabel = formatPeriodLabel(period);
  const shareUrl = React.useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }
    const base = `${window.location.origin}${b2bRoutes.reportDetail(period)}`;
    return `${base}?share=staff`;
  }, [period]);

  const handlePrint = React.useCallback(() => {
    window.print();
  }, []);

  const handleShare = React.useCallback(async () => {
    if (!shareUrl) {
      return;
    }
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Rapport ${periodLabel}`,
          text: 'Synthèse mensuelle EmotionsCare (accès staff uniquement)',
          url: shareUrl,
        });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        toast({ description: 'Lien copié pour vos collègues RH.' });
      } else {
        throw new Error('share_unavailable');
      }
    } catch (error) {
      toast({ description: 'Impossible de partager automatiquement. Copiez le lien depuis la barre d’adresse.', variant: 'destructive' });
    }
  }, [shareUrl, periodLabel, toast]);

  const handleExportCsv = React.useCallback(() => {
    if (!query.data || query.data.length === 0) {
      toast({ description: 'Aucun agrégat disponible pour cette période.', variant: 'destructive' });
      return;
    }
    const csv = buildCsvContent(period, query.data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${period}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    Sentry.addBreadcrumb({
      category: 'b2b:reports:export_csv',
      message: 'download_plain_text',
      level: 'info',
      data: { period, rows: query.data.length },
    });
  }, [period, query.data, toast]);

  if (!reportsEnabled) {
    return (
      <ConsentGate>
        <main className="mx-auto max-w-4xl space-y-6 p-6">
          <PageSEO
            title="Rapport mensuel"
            description="Synthèse mensuelle désactivée"
            noIndex
          />
          <Card>
            <CardHeader>
              <CardTitle>Rapport indisponible</CardTitle>
              <CardDescription>
                Les récits mensuels ne sont pas encore activés sur cet environnement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to={b2bRoutes.reports()}>Retour aux rapports</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </ConsentGate>
    );
  }

  if (!period || !orgId) {
    return (
      <ConsentGate>
        <main className="mx-auto max-w-4xl space-y-6 p-6">
          <PageSEO
            title="Rapport mensuel"
            description="Synthèse non disponible"
            noIndex
          />
          <Card>
            <CardHeader>
              <CardTitle>Accès impossible</CardTitle>
              <CardDescription>
                Merci de vérifier les paramètres d’organisation pour consulter les rapports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to={b2bRoutes.reports()}>Retour à la liste</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </ConsentGate>
    );
  }

  const reportContent = (
    <main className="mx-auto max-w-4xl space-y-6 p-6" aria-labelledby="report-title">
      <PageSEO
        title={`Rapport ${periodLabel}`}
        description={`Récit textuel mensuel pour ${orgName}`}
        canonical={`${location.pathname}`}
        noIndex
      />

      <header className="space-y-4">
        <div className="flex items-center gap-3 no-print">
          <Button asChild variant="ghost" size="sm">
            <Link to={b2bRoutes.reports()} aria-label="Retour aux rapports">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Retour
            </Link>
          </Button>
        </div>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-400">Récit mensuel</p>
          <h1 id="report-title" className="text-3xl font-semibold text-slate-900">
            {periodLabel} — {orgName}
          </h1>
          <p className="text-sm text-slate-600">
            Généré le {generationDate}. Périmètre anonymisé, minimum cinq réponses par instrument.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 no-print" role="group" aria-label="Actions de partage">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
            Imprimer
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
            Partager lien staff
          </Button>
          <Button onClick={handleExportCsv}>
            <Download className="mr-2 h-4 w-4" aria-hidden="true" />
            Exporter le récit (texte)
          </Button>
        </div>
      </header>

      <article className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm" aria-live="polite">
        {query.isLoading ? (
          <p className="text-sm text-slate-600">Chargement de la synthèse…</p>
        ) : null}
        {query.error ? (
          <p className="text-sm text-red-600">Impossible de récupérer la synthèse pour cette période.</p>
        ) : null}
        {!query.isLoading && !query.error && (!query.data || query.data.length === 0) ? (
          <p className="text-sm text-slate-600">Aucun signal agrégé n’a encore été partagé pour cette période.</p>
        ) : null}

        {narrative ? (
          <>
            <section>
              <h2 className="text-xl font-semibold text-slate-900">Tendance douce</h2>
              <p className="mt-2 text-sm text-slate-700">{narrative.headline}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
                {narrative.signals.map(signal => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-slate-900">Ce qui a aidé</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {narrative.helpers.map(helper => (
                  <li key={helper}>{helper}</li>
                ))}
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold text-slate-900">Pistes à explorer</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
                {narrative.actions.map(action => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </section>
          </>
        ) : null}
      </article>

      <footer className="text-xs text-slate-500">
        Lien staff (noindex): {shareUrl}
      </footer>
    </main>
  );

  return <ConsentGate>{reportContent}</ConsentGate>;
};

export default B2BReportDetailPage;
