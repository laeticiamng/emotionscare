// @ts-nocheck
import React from 'react';
import { captureException } from '@/lib/ai-monitoring';
import { Sentry } from '@/lib/errors/sentry-compat';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import { useNavigate } from 'react-router-dom';
import { Printer, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useFlags } from '@/core/flags';
import { hasRolePermission } from '@/lib/role-mappings';
import { B2BHeatmap } from '@/features/b2b/reports/B2BHeatmap';
import { ExportButton } from '@/features/b2b/reports/ExportButton';
import { DEFAULT_INSTRUMENTS, useHeatmapMatrix } from '@/services/b2b/reportsApi';
import { deriveHeatmapInsight, labelInstrument } from '@/features/b2b/reports/utils';
import { performanceMonitor } from '@/lib/performance/performanceMonitor';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import '@/styles/print-b2b.css';

dayjs.locale('fr');

const MONTH_WINDOW = 3;
const PERIOD_OPTION_COUNT = 6;
const ORG_TEAM_LABEL = 'Organisation';

function formatPeriod(value: string): string {
  const parsed = dayjs(value, 'YYYY-MM');
  if (!parsed.isValid()) {
    return value;
  }
  return parsed.format('MMMM YYYY');
}

function buildPeriods(anchor: string): string[] {
  const parsed = dayjs(anchor, 'YYYY-MM');
  if (!parsed.isValid()) {
    return [anchor];
  }
  return Array.from({ length: MONTH_WINDOW }).map((_, index) => parsed.subtract(index, 'month').format('YYYY-MM'));
}

function normalizeTeam(team?: string | null): string {
  const value = team?.trim();
  return value && value.length > 0 ? value : ORG_TEAM_LABEL;
}

const PERIOD_OPTIONS = Array.from({ length: PERIOD_OPTION_COUNT }).map((_, index) =>
  dayjs().subtract(index, 'month').format('YYYY-MM'),
);

export default function B2BReportsHeatmapPage() {
  const { user } = useAuth();
  const { has } = useFlags();
  const navigate = useNavigate();
  const heatmapRef = React.useRef<HTMLDivElement>(null);
  const [anchorPeriod, setAnchorPeriod] = React.useState<string>(PERIOD_OPTIONS[0]);
  const [selectedTeam, setSelectedTeam] = React.useState<string>('all');
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  const orgId = user?.user_metadata?.org_id as string | undefined;
  const orgName = (user?.user_metadata?.org_name as string | undefined) ?? 'Votre organisation';
  const userRole = (user?.user_metadata?.role as string | undefined) ?? 'consumer';
  const isAdmin = hasRolePermission(userRole as any, 'admin');
  const visiblePeriods = React.useMemo(() => buildPeriods(anchorPeriod), [anchorPeriod]);

  React.useEffect(() => {
    Sentry.addBreadcrumb({ category: 'b2b:heatmap:view', message: 'open', level: 'info' });
  }, []);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const featureEnabled = has('FF_B2B_RH') && has('FF_B2B_AGGREGATES');
  const query = useHeatmapMatrix(
    {
      orgId,
      periods: visiblePeriods,
      instruments: DEFAULT_INSTRUMENTS.slice(),
    },
    { enabled: Boolean(orgId && featureEnabled) },
  );

  const allCells = query.data ?? [];
  const normalizedSelectedTeam = selectedTeam === 'all' ? null : selectedTeam;

  const teamOptions = React.useMemo(() => {
    const teams = new Set<string>();
    teams.add(ORG_TEAM_LABEL);
    allCells.forEach((cell) => {
      teams.add(normalizeTeam(cell.team));
    });
    if (normalizedSelectedTeam && !teams.has(normalizedSelectedTeam)) {
      teams.add(normalizedSelectedTeam);
    }
    return Array.from(teams).sort((a, b) => {
      if (a === ORG_TEAM_LABEL) return -1;
      if (b === ORG_TEAM_LABEL) return 1;
      return a.localeCompare(b, 'fr');
    });
  }, [allCells, normalizedSelectedTeam]);

  const visibleCellCount = React.useMemo(
    () =>
      allCells.filter((cell) =>
        normalizedSelectedTeam ? normalizeTeam(cell.team) === normalizedSelectedTeam : true,
      ).length,
    [allCells, normalizedSelectedTeam],
  );

  React.useEffect(() => {
    performanceMonitor.recordMetric('b2b_reports.visible_cells', visibleCellCount);
  }, [visibleCellCount]);

  const textualSummaries = React.useMemo(() => {
    if (allCells.length === 0) {
      return [];
    }
    const periodRank = new Map<string, number>();
    visiblePeriods.forEach((period, index) => {
      periodRank.set(period, index);
    });

    return DEFAULT_INSTRUMENTS.map((instrument) => {
      const instrumentCells = allCells
        .filter(
          (cell) =>
            cell.instrument === instrument &&
            (normalizedSelectedTeam ? normalizeTeam(cell.team) === normalizedSelectedTeam : true),
        )
        .sort((a, b) => (periodRank.get(a.period) ?? 99) - (periodRank.get(b.period) ?? 99));

      if (instrumentCells.length === 0) {
        return null;
      }

      const highlights = instrumentCells.slice(0, 4).map((cell) => {
        const insight = deriveHeatmapInsight(cell.text, cell.action);
        const team = normalizeTeam(cell.team);
        return `${formatPeriod(cell.period)} · ${team} : ${insight.label}`;
      });

      return {
        instrument: labelInstrument(instrument),
        highlights,
      };
    }).filter(Boolean) as Array<{ instrument: string; highlights: string[] }>;
  }, [allCells, normalizedSelectedTeam, visiblePeriods]);

  const handlePrint = React.useCallback(() => {
    Sentry.addBreadcrumb({ category: 'b2b:print', message: 'trigger', level: 'info' });
    window.print();
  }, []);

  if (!orgId) {
    return (
      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Heatmap RH</h1>
          <p className="text-sm text-slate-600">
            Aucun identifiant d’organisation détecté. Merci de contacter le support pour activer l’accès PeopleOps.
          </p>
        </header>
      </main>
    );
  }

  if (!featureEnabled) {
    return (
      <main className="mx-auto max-w-4xl space-y-6 p-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Heatmap RH</h1>
          <p className="text-sm text-slate-600">
            Cette vue est désactivée. Activez FF_B2B_RH et FF_B2B_AGGREGATES pour consulter les agrégats confidentiels.
          </p>
        </header>
      </main>
    );
  }

  const isLoading = query.isLoading || query.isFetching;
  const hasError = Boolean(query.error);
  const todayLabel = dayjs().format('D MMMM YYYY');

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6" aria-labelledby="b2b-reports-title">
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">Rapport collectif</p>
            <h1 id="b2b-reports-title" className="text-3xl font-semibold text-slate-900">
              Heatmap RH — {orgName}
            </h1>
            <p className="text-sm text-slate-600">
              Synthèse textuelle du bien-être, de l’engagement et du risque de burnout. Les agrégats respectent un minimum de cinq réponses par cellule.
            </p>
            <p className="text-xs text-slate-500">Dernière consultation : {todayLabel}</p>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            {isAdmin && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/system-health')}
                className="gap-2"
              >
                <Activity className="h-4 w-4" aria-hidden="true" />
                System Health
              </Button>
            )}
            <ExportButton targetRef={heatmapRef as React.RefObject<HTMLElement>} fileName={`heatmap-${visiblePeriods[0]}.png`} />
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
              Imprimer
            </Button>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Périodes affichées : {visiblePeriods.map(formatPeriod).join(' · ')} · Confidentialité renforcée
        </p>
      </header>

      <section className="no-print rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Filtres">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="period-select" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Mois de référence
            </label>
            <Select value={anchorPeriod} onValueChange={setAnchorPeriod}>
              <SelectTrigger id="period-select" aria-label="Sélectionner la période">
                <SelectValue placeholder="Choisir un mois" />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {formatPeriod(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="team-select" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Équipe
            </label>
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger id="team-select" aria-label="Filtrer par équipe">
                <SelectValue placeholder="Toutes les équipes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Organisation complète</SelectItem>
                {teamOptions.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {hasError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          Impossible de charger les synthèses. Merci de réessayer plus tard.
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4" role="status" aria-live="polite">
          <div className="h-28 rounded-xl bg-slate-100" />
          <div className="h-28 rounded-xl bg-slate-100" />
          <div className="h-28 rounded-xl bg-slate-100" />
        </div>
      ) : (
        <>
          <B2BHeatmap
            ref={heatmapRef}
            cells={allCells}
            periods={visiblePeriods}
            teamFilter={selectedTeam}
            reducedMotion={prefersReducedMotion}
            formatPeriodLabel={formatPeriod}
            instrumentOrder={DEFAULT_INSTRUMENTS.slice()}
          />
          {textualSummaries.length > 0 && (
            <section
              aria-label="Synthèse textuelle des tendances"
              aria-live="polite"
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <h2 className="text-base font-semibold text-slate-800">Résumé textuel accessible</h2>
              <p className="mt-1 text-sm text-slate-600">
                Aperçu lisible des constats clés pour les lecteurs d’écran et l’impression.
              </p>
              <ul className="mt-3 space-y-3 text-sm text-slate-700">
                {textualSummaries.map((summary) => (
                  <li key={summary.instrument} className="space-y-1">
                    <p className="font-semibold text-slate-800">{summary.instrument}</p>
                    <ul className="space-y-1">
                      {summary.highlights.map((highlight, index) => (
                        <li key={index} className="text-slate-600">
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <footer className="border-t border-dashed border-slate-200 pt-4 text-xs text-slate-500">
        Données agrégées issues d’org_assess_rollups. Aucun score individuel n’est accessible. Minimum cinq réponses par cellule.
      </footer>
    </main>
  );
}
