'use client';

import { useEffect, useMemo, useState } from 'react';
import * as Sentry from '@sentry/react';
import { useRouter } from 'next/navigation';

import HeatmapCard from '../components/HeatmapCard';
import { useFlags } from '@/core/flags';
import { deriveHeatmapInsight } from '@/features/b2b/reports/utils';
import type { HeatmapSummary } from '@/services/b2b/heatmapApi';
import { fetchHeatmapCells, fetchHeatmapPeriods } from '@/services/b2b/heatmapApi';

const MONTH_LABELS: Record<string, string> = {
  '01': 'janvier',
  '02': 'février',
  '03': 'mars',
  '04': 'avril',
  '05': 'mai',
  '06': 'juin',
  '07': 'juillet',
  '08': 'août',
  '09': 'septembre',
  '10': 'octobre',
  '11': 'novembre',
  '12': 'décembre',
};

const INSTRUMENT_LABELS: Record<string, string> = {
  WEMWBS: 'Bien-être',
  SWEMWBS: 'Bien-être court',
  CBI: 'Charge émotionnelle',
  UWES: 'Engagement',
};

const INSTRUMENT_ORDER = ['WEMWBS', 'SWEMWBS', 'CBI', 'UWES'];

function formatPeriod(period: string): string {
  const [, month] = period.split('-');
  const label = month ? MONTH_LABELS[month] : null;
  return label ?? period;
}

function buildMatrix(cells: HeatmapSummary[]) {
  const matrix = new Map<string, Map<string, HeatmapSummary>>();
  cells.forEach((cell) => {
    const teamKey = cell.team_id ?? 'org';
    if (!matrix.has(teamKey)) {
      matrix.set(teamKey, new Map());
    }
    matrix.get(teamKey)!.set(cell.instrument, cell);
  });
  return matrix;
}

export default function B2BHeatmapPage() {
  const { has } = useFlags();
  const router = useRouter();

  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [cells, setCells] = useState<HeatmapSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const featureEnabled = has('FF_B2B_HEATMAP') && has('FF_B2B_AGGREGATES');

  useEffect(() => {
    let isMounted = true;
    const loadPeriods = async () => {
      try {
        const available = await fetchHeatmapPeriods();
        if (!isMounted) return;
        if (available.length === 0) {
          setStatus('Aucune période disponible pour l’instant.');
          setPeriods([]);
          setSelectedPeriod(null);
          return;
        }
        setPeriods(available);
        setSelectedPeriod((current) => current ?? available[0]);
      } catch (error) {
        console.error('b2b.heatmap.periods.failed', error);
        if (!isMounted) return;
        setStatus('Impossible de charger les périodes disponibles.');
      }
    };

    if (featureEnabled) {
      void loadPeriods();
    }

    return () => {
      isMounted = false;
    };
  }, [featureEnabled]);

  useEffect(() => {
    if (!featureEnabled || !selectedPeriod) {
      setCells([]);
      return;
    }

    let isMounted = true;
    setLoading(true);
    setStatus(null);

    const loadCells = async () => {
      try {
        const response = await fetchHeatmapCells({ period: selectedPeriod });
        if (!isMounted) return;
        setCells(response);
        Sentry.addBreadcrumb({
          category: 'b2b:heatmap:loaded',
          message: 'success',
          data: { period: selectedPeriod, total: response.length },
          level: 'info',
        });
        if (response.length === 0) {
          setStatus('Aucune synthèse disponible avec la confidentialité renforcée.');
        }
      } catch (error) {
        console.error('b2b.heatmap.fetch.failed', error);
        if (!isMounted) return;
        setStatus('La grille n’a pas pu être chargée. Réessayez plus tard.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadCells();

    return () => {
      isMounted = false;
    };
  }, [featureEnabled, selectedPeriod]);

  const matrix = useMemo(() => buildMatrix(cells), [cells]);

  const teams = useMemo(() => {
    const entries = new Map<string, { id: string | null; label: string }>();
    cells.forEach((cell) => {
      const key = cell.team_id ?? 'org';
      if (!entries.has(key)) {
        entries.set(key, { id: cell.team_id ?? null, label: cell.team_label });
      }
    });
    const ordered = Array.from(entries.values());
    return ordered.sort((a, b) => {
      if (a.id === b.id) return 0;
      if (a.id === null) return -1;
      if (b.id === null) return 1;
      if (a.id === 'aggregated') return 1;
      if (b.id === 'aggregated') return -1;
      return a.label.localeCompare(b.label, 'fr');
    });
  }, [cells]);

  const instruments = useMemo(() => {
    const found = new Set<string>();
    cells.forEach((cell) => {
      found.add(cell.instrument);
    });
    const ordered = INSTRUMENT_ORDER.filter((instrument) => found.has(instrument));
    const extras = Array.from(found).filter((instrument) => !INSTRUMENT_ORDER.includes(instrument)).sort();
    return [...ordered, ...extras];
  }, [cells]);

  const handleCellClick = (team: { id: string | null; label: string }, instrument: string) => {
    if (!selectedPeriod) return;
    Sentry.addBreadcrumb({
      category: 'b2b:heatmap:cell:click',
      message: 'navigate',
      data: {
        period: selectedPeriod,
        team: team.id ?? 'org',
        instrument,
      },
      level: 'info',
    });
    const params = new URLSearchParams();
    params.set('period', selectedPeriod);
    params.set('instrument', instrument);
    params.set('team', team.id ?? 'org');
    router.push(`/b2b/reports?${params.toString()}`);
  };

  if (!featureEnabled) {
    return (
      <section className="space-y-4 p-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">Heatmap RH</h1>
          <p className="text-sm text-slate-600">
            Cette vue est désactivée. Activez FF_B2B_HEATMAP et FF_B2B_AGGREGATES pour consulter les agrégats textuels.
          </p>
        </header>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 p-6" aria-labelledby="heatmap-title">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-slate-500">Synthèse collective</p>
        <h1 id="heatmap-title" className="text-3xl font-semibold text-slate-900">Heatmap RH textuelle</h1>
        <p className="text-sm text-slate-600">
          Grille qualitative du climat d’équipe. Chaque cellule respecte un minimum de cinq réponses et agrège les micro-équipes.
        </p>
      </header>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(14rem,18rem)_1fr]">
        <div className="space-y-2">
          <label htmlFor="period-select" className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Mois de référence
          </label>
          <select
            id="period-select"
            value={selectedPeriod ?? ''}
            onChange={(event) => setSelectedPeriod(event.target.value)}
            className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            aria-label="Choisir le mois analysé"
          >
            {periods.map((period) => (
              <option key={period} value={period}>
                {formatPeriod(period)}
              </option>
            ))}
          </select>
        </div>
        <p className="self-end text-sm text-slate-600" aria-live="polite">
          {status ?? 'Synthèse confidentielle sans aucun chiffre. Les propositions renvoient vers les rapports détaillés.'}
        </p>
      </div>

      <div className="overflow-x-auto" role="region" aria-live="polite" aria-label="Grille du climat d’équipe">
        <table className="min-w-full divide-y divide-slate-200" role="grid">
          <thead className="bg-slate-100">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600">
                Équipe
              </th>
              {instruments.map((instrument) => (
                <th
                  key={instrument}
                  scope="col"
                  id={`instrument-${instrument}`}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  {INSTRUMENT_LABELS[instrument] ?? instrument}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {loading ? (
              <tr>
                <td colSpan={instruments.length + 1} className="px-4 py-8 text-center text-sm text-slate-500">
                  Chargement textuel en cours…
                </td>
              </tr>
            ) : teams.length === 0 ? (
              <tr>
                <td colSpan={instruments.length + 1} className="px-4 py-8 text-center text-sm text-slate-500">
                  {status ?? 'Aucune donnée agrégée pour cette période.'}
                </td>
              </tr>
            ) : (
              teams.map((team) => (
                <tr key={team.id ?? 'org'} className="align-top">
                  <th scope="row" className="px-4 py-3 text-left text-sm font-semibold text-slate-800">
                    {team.label}
                  </th>
                  {instruments.map((instrument) => {
                    const cell = matrix.get(team.id ?? 'org')?.get(instrument);
                    const insight = deriveHeatmapInsight(cell?.summary ?? '');
                    return (
                      <td key={`${team.id ?? 'org'}-${instrument}`} className="px-4 py-3">
                        {cell ? (
                          <HeatmapCard
                            instrument={INSTRUMENT_LABELS[instrument] ?? instrument}
                            summary={cell.summary}
                            tone={insight.tone}
                            onClick={() => handleCellClick(team, instrument)}
                            describedBy={`instrument-${instrument}`}
                          />
                        ) : (
                          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
                            Synthèse indisponible pour cette combinaison.
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="border-t border-dashed border-slate-200 pt-4 text-xs text-slate-500">
        Minimum cinq réponses par cellule. Les micro-équipes sont regroupées pour préserver l’anonymat.
      </footer>
    </section>
  );
}
