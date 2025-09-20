import React from 'react';
import * as Sentry from '@sentry/react';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { Printer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { B2BHeatmap } from '@/features/b2b/reports/B2BHeatmap';
import { ExportButton } from '@/features/b2b/reports/ExportButton';
import { DEFAULT_INSTRUMENTS, useHeatmap } from '@/services/b2b/reportsApi';
import { groupCellsByInstrument, labelInstrument, type HeatmapCell } from '@/features/b2b/reports/utils';
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

dayjs.extend(isoWeek);

const PERIOD_OPTIONS = Array.from({ length: 8 }).map((_, index) =>
  dayjs().subtract(index, 'week').format('YYYY-[W]WW'),
);

const DEFAULT_PERIOD = PERIOD_OPTIONS[0];

const TEAM_OPTION_ALL = 'all';
const INSTRUMENT_OPTION_ALL = 'all';

function formatPeriodLabel(value: string): string {
  if (!value.includes('W')) {
    return value;
  }
  const [year, week] = value.split('-');
  return `Semaine ${week.replace('W', '')} — ${year}`;
}

export default function B2BReportsHeatmapPage() {
  const { user } = useAuth();
  const heatmapRef = React.useRef<HTMLDivElement>(null);
  const [period, setPeriod] = React.useState<string>(DEFAULT_PERIOD);
  const [selectedTeam, setSelectedTeam] = React.useState<string>(TEAM_OPTION_ALL);
  const [selectedInstrument, setSelectedInstrument] = React.useState<string>(INSTRUMENT_OPTION_ALL);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  const orgId = user?.user_metadata?.org_id as string | undefined;
  const orgName = (user?.user_metadata?.org_name as string | undefined) ?? 'Votre organisation';

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const query = useHeatmap({
    orgId,
    period,
    instruments: selectedInstrument === INSTRUMENT_OPTION_ALL ? undefined : [selectedInstrument],
  });

  const teamOptions = React.useMemo(() => {
    const teams = new Set<string>();
    (query.data ?? []).forEach((cell) => {
      if (cell.team) {
        teams.add(cell.team);
      }
    });
    return Array.from(teams).sort();
  }, [query.data]);

  const filteredCells = React.useMemo(() => {
    if (!query.data) return [];
    return query.data.filter((cell) => {
      if (selectedTeam !== TEAM_OPTION_ALL) {
        return cell.team === selectedTeam;
      }
      return true;
    });
  }, [query.data, selectedTeam]);

  React.useEffect(() => {
    performanceMonitor.recordMetric('b2b_reports.visible_cells', filteredCells.length);
  }, [filteredCells.length]);

  const textualSummaries = React.useMemo(() => {
    if (filteredCells.length === 0) {
      return [];
    }
    const grouped = groupCellsByInstrument(filteredCells);
    return Object.entries(grouped).map(([instrumentKey, instrumentCells]) => {
      const instrumentLabel = labelInstrument(instrumentKey);
      const segments = Array.from(new Set(instrumentCells.map((cell) => cell.team ?? 'Organisation')));
      const highlights = instrumentCells
        .map((cell) => (cell.team ? `${cell.team} : ${cell.text}` : cell.text))
        .filter(Boolean)
        .slice(0, 2);
      return {
        instrument: instrumentLabel,
        total: instrumentCells.length,
        segments,
        highlights,
        hasMore: instrumentCells.length > highlights.length,
      };
    });
  }, [filteredCells]);

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

  const isLoading = query.isLoading || query.isFetching;
  const hasError = Boolean(query.error);

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
              Synthèse textuelle du bien-être, de l’engagement et du risque de burnout. Les agrégats respectent un minimum de cinq réponses.
            </p>
          </div>
          <div className="no-print flex flex-wrap gap-2">
            <ExportButton targetRef={heatmapRef as React.RefObject<HTMLElement>} fileName={`heatmap-${period}.png`} />
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" aria-hidden="true" />
              Imprimer
            </Button>
          </div>
        </div>
        <p className="text-xs text-slate-500">
          Période sélectionnée : {formatPeriodLabel(period)} · Confidentialité renforcée
        </p>
      </header>

      <section className="no-print rounded-xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="Filtres">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="period-select" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Période
            </label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger id="period-select" aria-label="Sélectionner la période">
                <SelectValue placeholder="Choisir une période" />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {formatPeriodLabel(option)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="team-select" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Équipe
            </label>
            <Select
              value={selectedTeam}
              onValueChange={setSelectedTeam}
              disabled={teamOptions.length === 0}
            >
              <SelectTrigger id="team-select" aria-label="Filtrer par équipe">
                <SelectValue placeholder="Toutes les équipes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={TEAM_OPTION_ALL}>Organisation complète</SelectItem>
                {teamOptions.map((team) => (
                  <SelectItem key={team} value={team}>
                    {team}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="instrument-select"
              className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              Instrument
            </label>
            <Select value={selectedInstrument} onValueChange={setSelectedInstrument}>
              <SelectTrigger id="instrument-select" aria-label="Filtrer par instrument">
                <SelectValue placeholder="Tous les instruments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={INSTRUMENT_OPTION_ALL}>Tous</SelectItem>
                {DEFAULT_INSTRUMENTS.map((instrument) => (
                  <SelectItem key={instrument} value={instrument}>
                    {instrument}
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
          <div className="h-24 rounded-xl bg-slate-100" />
          <div className="h-24 rounded-xl bg-slate-100" />
          <div className="h-24 rounded-xl bg-slate-100" />
        </div>
      ) : (
        <>
          <B2BHeatmap ref={heatmapRef} cells={filteredCells} reducedMotion={prefersReducedMotion} />
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
                    <p className="font-semibold text-slate-800">
                      {summary.instrument} · {summary.total}{' '}
                      {summary.total > 1 ? 'segments analysés' : 'segment analysé'}
                    </p>
                    <p>
                      Équipes couvertes : {summary.segments.join(', ')}.
                    </p>
                    {summary.highlights.length > 0 && (
                      <p>
                        Points clés : {summary.highlights.join(' · ')}
                        {summary.hasMore ? '…' : ''}
                      </p>
                    )}
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
