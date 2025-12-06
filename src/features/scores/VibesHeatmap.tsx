import { forwardRef, useMemo } from 'react';
import type { ForwardedRef } from 'react';
import { format, startOfISOWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

import type { VibePoint } from '@/services/scores/dataApi';
import {
  buildHeatmapIntensity,
  describeVibe,
  describeVibeIntensity,
  getVibeColor,
} from './verbalizers';

const CELL_SIZE = 22;
const CELL_GAP = 6;
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export interface VibesHeatmapProps {
  points: VibePoint[];
  descriptionId: string;
  titleId: string;
}

export const VibesHeatmap = forwardRef<HTMLDivElement, VibesHeatmapProps>(function VibesHeatmap(
  { points, descriptionId, titleId },
  ref: ForwardedRef<HTMLDivElement>,
) {
  const { cells, columnCount } = useMemo(() => buildCells(points), [points]);

  return (
    <figure
      ref={ref}
      data-testid="scores-heatmap-chart"
      role="img"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="space-y-3"
    >
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex gap-4">
          <div aria-hidden="true" className="flex flex-col justify-between py-2 text-xs text-muted-foreground">
            {DAYS.map(day => (
              <span key={day} className="h-[22px] leading-[22px]">
                {day}
              </span>
            ))}
          </div>
          <div
            role="grid"
            aria-label="Vibes quotidiennes"
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${Math.max(columnCount, 1)}, ${CELL_SIZE}px)`,
              gap: `${CELL_GAP}px`,
              gridAutoRows: `${CELL_SIZE}px`,
              gridAutoFlow: 'column',
            }}
          >
            {cells.map(cell => (
              <div
                key={cell.key}
                role="gridcell"
                tabIndex={0}
                className="h-[22px] w-[22px] rounded-md outline-none transition-[box-shadow] focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={{ backgroundColor: cell.fill }}
                aria-label={cell.ariaLabel}
                title={cell.title}
                data-testid={`heatmap-cell-${cell.key}`}
              >
                <span className="sr-only">{cell.title}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-3" role="list" aria-label="Légende des vibes">
          {['calm', 'focus', 'bright', 'reset'].map(vibeKey => {
            const descriptor = describeVibe(vibeKey);
            if (!descriptor) {
              return null;
            }
            return (
              <div key={vibeKey} className="flex items-center gap-2" role="listitem">
                <span
                  className="inline-flex h-3 w-3 rounded-sm"
                  style={{ backgroundColor: descriptor.palette.medium }}
                  aria-hidden="true"
                />
                <span className="text-xs text-muted-foreground">{capitalize(descriptor.label)}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-2" role="listitem">
            <span className="inline-flex h-3 w-3 rounded-sm bg-muted" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">Aucune vibe détectée</span>
          </div>
          <div className="flex items-center gap-2" role="listitem">
            <div className="flex h-3 overflow-hidden rounded-sm border border-border" aria-hidden="true">
              <span className="h-full w-3 bg-slate-200" />
              <span className="h-full w-3 bg-slate-400" />
              <span className="h-full w-3 bg-slate-600" />
            </div>
            <span className="text-xs text-muted-foreground">Intensité de la vibe</span>
          </div>
        </div>
      </div>
    </figure>
  );
});

interface HeatmapCell {
  key: string;
  fill: string;
  title: string;
  ariaLabel: string;
}

function buildCells(points: VibePoint[]): { cells: HeatmapCell[]; columnCount: number } {
  if (!points.length) {
    return { cells: [], columnCount: 0 };
  }

  const weekColumns = new Map<string, number>();
  const cells: HeatmapCell[] = [];

  points.forEach(point => {
    const date = new Date(point.date);
    if (Number.isNaN(date.getTime())) {
      return;
    }
    const weekStart = startOfISOWeek(date).toISOString();
    if (!weekColumns.has(weekStart)) {
      weekColumns.set(weekStart, weekColumns.size);
    }
    const intensity = buildHeatmapIntensity(point);
    const descriptor = point.vibe ? describeVibe(point.vibe) : undefined;
    const fill = point.vibe ? getVibeColor(point.vibe, intensity ?? 'medium') : '#e2e8f0';
    const label = format(date, "EEEE d MMMM", { locale: fr });
    const vibeLabel = descriptor?.label ? capitalize(descriptor.label) : 'Aucune vibe dominante';
    const intensityLabel = point.vibe ? describeVibeIntensity(intensity) : 'nuance neutre';
    const title = point.vibe ? `${capitalize(label)} — ${vibeLabel} (${intensityLabel})` : `${capitalize(label)} — aucune vibe dominante`;
    const ariaLabel = point.vibe
      ? `${capitalize(label)} : vibe ${vibeLabel}, ${intensityLabel}.`
      : `${capitalize(label)} : aucune vibe dominante.`;
    cells.push({
      key: `${point.date}-${weekColumns.get(weekStart) ?? 0}-${((date.getDay() + 6) % 7)}`,
      fill,
      title,
      ariaLabel,
    });
  });

  return { cells, columnCount: weekColumns.size };
}

function capitalize(value: string) {
  if (!value) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default VibesHeatmap;
