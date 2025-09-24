import React from 'react';
import * as Sentry from '@sentry/react';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { FileText, ArrowRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageSEO from '@/components/seo/PageSEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ff } from '@/lib/flags/ff';
import { b2bRoutes } from '@/lib/routes';
import '@/styles/print-b2b.css';
import { withGuard } from '@/routerV2/withGuard';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';

dayjs.locale('fr');

const PERIOD_COUNT = 6;

interface PeriodOption {
  value: string;
  label: string;
  subtitle: string;
}

function buildPeriodOptions(): PeriodOption[] {
  return Array.from({ length: PERIOD_COUNT }).map((_, index) => {
    const date = dayjs().subtract(index, 'month');
    const value = date.format('YYYY-MM');
    const label = date.format('MMMM YYYY');
    const subtitle = index === 0
      ? 'Synthèse la plus récente'
      : index === 1
        ? 'Récit du mois précédent'
        : 'Récit consolidé sur la période antérieure';
    return {
      value,
      label: label.charAt(0).toUpperCase() + label.slice(1),
      subtitle,
    };
  });
}

const EMPTY_STATE = (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-lg">
        <AlertCircle className="h-5 w-5 text-amber-500" aria-hidden="true" />
        Fonctionnalité en préparation
      </CardTitle>
      <CardDescription>
        Les récits mensuels sont en cours d’activation. Vous pouvez continuer à consulter la heatmap textuelle.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Button asChild variant="outline">
        <Link to="/b2b/reports">Accéder à la heatmap</Link>
      </Button>
    </CardContent>
  </Card>
);

const periodOptions = buildPeriodOptions();

const generationNotice = `Chaque récit repose sur les agrégats mensuels (min. cinq réponses) et ne contient jamais de métriques brutes.`;

const B2BReportsPage: React.FC = () => {
  const { user } = useAuth();
  const reportsEnabled = ff('FF_B2B_REPORTS');
  const orgName = (user?.user_metadata?.org_name as string | undefined) ?? 'Votre organisation';

  React.useEffect(() => {
    if (reportsEnabled) {
      Sentry.addBreadcrumb({
        category: 'b2b:reports:view',
        message: 'list',
        level: 'info',
      });
    }
  }, [reportsEnabled]);

  if (!reportsEnabled) {
    return (
      <ConsentGate>
        <main className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
          <PageSEO
            title="Rapports mensuels"
            description="Synthèses texte-only dédiées aux managers"
            canonical="/app/reports"
            noIndex
          />
          {EMPTY_STATE}
        </main>
      </ConsentGate>
    );
  }

  return (
    <ConsentGate>
      <main className="mx-auto max-w-4xl space-y-6 p-6" aria-labelledby="b2b-reporting-title">
        <PageSEO
          title="Rapports mensuels"
          description="Synthèses narratives des ressentis collectifs, sans métriques sensibles."
          canonical="/app/reports"
          noIndex
        />

        <header className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Rapports managers</p>
          <h1 id="b2b-reporting-title" className="text-3xl font-semibold text-slate-900">
            Récits mensuels — {orgName}
          </h1>
          <p className="text-sm text-slate-600">{generationNotice}</p>
          <p className="text-xs text-slate-500">
            Export et impression disponibles. Confidentialité renforcée, aucun identifiant individuel.
          </p>
        </header>

        <section className="grid gap-4" aria-label="Liste des rapports disponibles">
          {periodOptions.map(option => (
            <Card key={option.value} className="transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <FileText className="h-5 w-5 text-slate-500" aria-hidden="true" />
                    {option.label}
                  </CardTitle>
                  <CardDescription>{option.subtitle}</CardDescription>
                </div>
                <Button asChild className="no-print">
                  <Link
                    to={b2bRoutes.reportDetail(option.value)}
                    aria-label={`Ouvrir le rapport ${option.label}`}
                  >
                    Consulter le récit
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600">
                  Synthèse narrative couvrant le bien-être, l’engagement et les signaux d’attention, sans métrique chiffrée.
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </ConsentGate>
  );
};

export default withGuard(B2BReportsPage, [
  { type: 'auth', required: true },
  { type: 'role', roles: ['manager', 'org', 'admin'] },
]);
