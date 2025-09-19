import React from 'react';
import clsx from 'clsx';
import { ActionSuggestion } from './ActionSuggestion';
import { groupCellsByInstrument, labelInstrument, type HeatmapCell } from './utils';

interface B2BHeatmapProps {
  cells: HeatmapCell[];
  reducedMotion?: boolean;
}

export const B2BHeatmap = React.forwardRef<HTMLDivElement, B2BHeatmapProps>(
  ({ cells, reducedMotion = false }, ref) => {
    const grouped = React.useMemo(() => groupCellsByInstrument(cells), [cells]);
    const instruments = React.useMemo(() => Object.keys(grouped), [grouped]);

    if (cells.length === 0) {
      return (
        <p className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600" role="status">
          Aucune synthèse disponible pour cette période avec le seuil de confidentialité en vigueur.
        </p>
      );
    }

    return (
      <div ref={ref} className="space-y-8" role="region" aria-live="polite" aria-label="Heatmap des ressentis d'équipe">
        {instruments.map((instrumentKey) => {
          const instrumentCells = grouped[instrumentKey] ?? [];
          const label = labelInstrument(instrumentKey);
          return (
            <section key={instrumentKey} aria-label={`Synthèse ${label}`} className="space-y-3">
              <header className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-800">{label}</h3>
                <span className="text-xs uppercase tracking-wide text-slate-400">Confidentiel · Texte uniquement</span>
              </header>
              <div
                role="grid"
                aria-readonly
                className={clsx(
                  'grid gap-3',
                  reducedMotion ? 'motion-reduce:transition-none motion-reduce:hover:shadow-none' : '',
                  instrumentCells.some((cell) => cell.team) ? 'md:grid-cols-3' : 'md:grid-cols-2',
                )}
                data-testid={`heatmap-${instrumentKey.toLowerCase()}`}
              >
                {instrumentCells.map((cell, index) => {
                  const audience = cell.team ?? 'Organisation';
                  return (
                    <article
                      key={`${instrumentKey}-${audience}-${index}`}
                      role="gridcell"
                      tabIndex={0}
                      aria-label={`${label} — ${audience}`}
                      className={clsx(
                        'flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-500',
                        'transition-shadow duration-150 ease-out hover:shadow-md',
                        reducedMotion && 'transition-none hover:shadow-none',
                      )}
                    >
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{audience}</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-800 line-clamp-3" data-testid="heatmap-text">
                          {cell.text}
                        </p>
                      </div>
                      <ActionSuggestion summary={cell.text} backendSuggestion={cell.action} />
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    );
  },
);

B2BHeatmap.displayName = 'B2BHeatmap';
