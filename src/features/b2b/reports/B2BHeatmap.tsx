// @ts-nocheck
import React from 'react';
import clsx from 'clsx';
import {
  deriveHeatmapInsight,
  labelInstrument,
  type HeatmapCell,
  type HeatmapTone,
} from './utils';

const ORG_TEAM_LABEL = 'Organisation';

function normalizeTeam(team?: string | null): string {
  const value = team?.trim();
  return value && value.length > 0 ? value : ORG_TEAM_LABEL;
}

const TONE_STYLE_MAP: Record<HeatmapTone, { background: string; border: string; label: string; summary: string; action: string }> = {
  calm: {
    background: 'bg-emerald-50',
    border: 'border-emerald-200',
    label: 'text-emerald-700',
    summary: 'text-emerald-900',
    action: 'text-emerald-800',
  },
  energized: {
    background: 'bg-sky-50',
    border: 'border-sky-200',
    label: 'text-sky-700',
    summary: 'text-sky-900',
    action: 'text-sky-800',
  },
  fatigue: {
    background: 'bg-amber-50',
    border: 'border-amber-200',
    label: 'text-amber-700',
    summary: 'text-amber-900',
    action: 'text-amber-800',
  },
  tense: {
    background: 'bg-rose-50',
    border: 'border-rose-200',
    label: 'text-rose-700',
    summary: 'text-rose-900',
    action: 'text-rose-800',
  },
  mixed: {
    background: 'bg-indigo-50',
    border: 'border-indigo-200',
    label: 'text-indigo-700',
    summary: 'text-indigo-900',
    action: 'text-indigo-800',
  },
  watchful: {
    background: 'bg-purple-50',
    border: 'border-purple-200',
    label: 'text-purple-700',
    summary: 'text-purple-900',
    action: 'text-purple-800',
  },
  neutral: {
    background: 'bg-slate-50',
    border: 'border-slate-200',
    label: 'text-slate-700',
    summary: 'text-slate-900',
    action: 'text-slate-800',
  },
};

function toneStyles(tone: HeatmapTone) {
  return TONE_STYLE_MAP[tone] ?? TONE_STYLE_MAP.neutral;
}

interface B2BHeatmapProps {
  cells: HeatmapCell[];
  periods: string[];
  teamFilter?: string;
  reducedMotion?: boolean;
  formatPeriodLabel?: (value: string) => string;
  instrumentOrder?: string[];
}

function uniqueOrdered(values: string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  values.forEach((value) => {
    if (!seen.has(value)) {
      seen.add(value);
      ordered.push(value);
    }
  });
  return ordered;
}

export const B2BHeatmap = React.forwardRef<HTMLDivElement, B2BHeatmapProps>(function B2BHeatmap(
  { cells, periods, teamFilter = 'all', reducedMotion = false, formatPeriodLabel, instrumentOrder },
  ref,
) {
  const sanitizedPeriods = React.useMemo(() => uniqueOrdered(periods), [periods]);
  const columnTemplate = React.useMemo(
    () => ({
      gridTemplateColumns: `minmax(11rem,1fr) repeat(${Math.max(sanitizedPeriods.length, 1)}, minmax(14rem,1fr))`,
    }),
    [sanitizedPeriods.length],
  );

  const normalizedTeamFilter = teamFilter && teamFilter !== 'all' ? teamFilter : null;

  const allTeams = React.useMemo(() => {
    const teams = new Set<string>();
    teams.add(ORG_TEAM_LABEL);
    cells.forEach((cell) => {
      teams.add(normalizeTeam(cell.team));
    });
    if (normalizedTeamFilter && !teams.has(normalizedTeamFilter)) {
      teams.add(normalizedTeamFilter);
    }
    return Array.from(teams).sort((a, b) => {
      if (a === ORG_TEAM_LABEL) return -1;
      if (b === ORG_TEAM_LABEL) return 1;
      return a.localeCompare(b, 'fr');
    });
  }, [cells, normalizedTeamFilter]);

  const visibleTeams = React.useMemo(() => {
    if (normalizedTeamFilter) {
      return allTeams.filter((team) => team === normalizedTeamFilter);
    }
    return allTeams;
  }, [allTeams, normalizedTeamFilter]);

  const matrix = React.useMemo(() => {
    const store: Record<string, Record<string, Record<string, HeatmapCell>>> = {};
    cells.forEach((cell) => {
      const instrument = cell.instrument;
      const team = normalizeTeam(cell.team);
      if (!store[instrument]) {
        store[instrument] = {};
      }
      if (!store[instrument][team]) {
        store[instrument][team] = {};
      }
      store[instrument][team][cell.period] = cell;
    });
    return store;
  }, [cells]);

  const instrumentKeys = React.useMemo(() => {
    if (instrumentOrder && instrumentOrder.length > 0) {
      return instrumentOrder;
    }
    return Object.keys(matrix);
  }, [instrumentOrder, matrix]);

  const formatPeriod = React.useCallback(
    (value: string) => (formatPeriodLabel ? formatPeriodLabel(value) : value),
    [formatPeriodLabel],
  );

  if (instrumentKeys.length === 0 && cells.length === 0) {
    return (
      <div ref={ref} role="region" aria-live="polite" aria-label="Heatmap des ressentis d'équipe">
        <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600" role="status">
          Aucune synthèse disponible pour cette période avec le seuil de confidentialité en vigueur.
        </p>
      </div>
    );
  }

  return (
    <div ref={ref} className="space-y-8" role="region" aria-live="polite" aria-label="Heatmap des ressentis d'équipe">
      {instrumentKeys.map((instrumentKey) => {
        const instrumentLabel = labelInstrument(instrumentKey);
        const teamEntries = matrix[instrumentKey] ?? {};
        return (
          <section key={instrumentKey} aria-label={`Synthèse ${instrumentLabel}`} className="space-y-3">
            <header className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-base font-semibold text-slate-800">{instrumentLabel}</h3>
              <span className="text-xs uppercase tracking-wide text-slate-400">Confidentialité renforcée</span>
            </header>
            <div className="overflow-x-auto">
              <div role="table" className="min-w-full space-y-2">
                <div role="rowgroup" className="space-y-1">
                  <div
                    role="row"
                    className="grid items-center gap-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    style={columnTemplate}
                  >
                    <div role="columnheader" className="pl-1">
                      Équipe
                    </div>
                    {sanitizedPeriods.map((period) => (
                      <div key={period} role="columnheader">
                        {formatPeriod(period)}
                      </div>
                    ))}
                  </div>
                </div>
                <div role="rowgroup" className="space-y-2">
                  {visibleTeams.map((teamName) => (
                    <div
                      key={teamName}
                      role="row"
                      className="grid items-stretch gap-3"
                      style={columnTemplate}
                    >
                      <div
                        role="rowheader"
                        className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700"
                      >
                        {teamName}
                      </div>
                      {sanitizedPeriods.map((period) => {
                        const cell = teamEntries[teamName]?.[period];
                        if (!cell) {
                          return (
                            <div
                              key={`${teamName}-${period}-empty`}
                              role="cell"
                              tabIndex={0}
                              aria-label={`${instrumentLabel} — ${teamName} — ${formatPeriod(period)} · données insuffisantes`}
                              className={clsx(
                                'flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500 shadow-inner',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500',
                              )}
                              title="Échantillon insuffisant"
                            >
                              <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                Insuffisant
                              </span>
                            </div>
                          );
                        }
                        const insight = deriveHeatmapInsight(cell.text, cell.action);
                        const tone = toneStyles(insight.tone);
                        return (
                          <div
                            key={`${teamName}-${period}`}
                            role="cell"
                            tabIndex={0}
                            aria-label={`${instrumentLabel} — ${teamName} — ${formatPeriod(period)} · ${insight.label}`}
                            className={clsx(
                              'flex h-full flex-col justify-between rounded-xl border p-4 text-left shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-500',
                              tone.border,
                              tone.background,
                              !reducedMotion && 'transition-shadow duration-150 ease-out hover:shadow-md',
                              reducedMotion && 'motion-reduce:transition-none motion-reduce:hover:shadow-none',
                            )}
                            title={insight.tooltip}
                          >
                            <div className="space-y-1">
                              <p className={clsx('text-xs font-semibold uppercase tracking-wide', tone.label)}>{insight.label}</p>
                              <p className={clsx('text-sm leading-relaxed', tone.summary)}>{cell.text}</p>
                            </div>
                            <p className={clsx('mt-3 text-sm font-medium', tone.action)}>{insight.action}</p>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
});

B2BHeatmap.displayName = 'B2BHeatmap';
