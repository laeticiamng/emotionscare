import { forwardRef, useMemo } from 'react';
import type { ForwardedRef } from 'react';
import { format, startOfISOWeek } from 'date-fns';
import { fr } from 'date-fns/locale';

import type { VibePoint } from '@/services/scores/dataApi';

const CELL_SIZE = 22;
const CELL_GAP = 6;
const VIBE_COLORS: Record<string, string> = {
  calm: '#34d399',
  focus: '#0ea5e9',
  bright: '#f97316',
  reset: '#a855f7',
};

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
  const width = columnCount * CELL_SIZE + Math.max(0, columnCount - 1) * CELL_GAP;
  const height = DAYS.length * CELL_SIZE + (DAYS.length - 1) * CELL_GAP;

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
          <svg width={width} height={height} role="presentation" aria-hidden="true">
            {cells.map(cell => (
              <rect
                key={cell.key}
                x={cell.x}
                y={cell.y}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={6}
                fill={cell.fill}
              >
                <title>{cell.title}</title>
              </rect>
            ))}
          </svg>
        </div>
        <div className="mt-4 flex flex-wrap gap-3" role="list" aria-label="Légende des vibes">
          {Object.entries(VIBE_COLORS).map(([vibe, color]) => (
            <div key={vibe} className="flex items-center gap-2" role="listitem">
              <span className="inline-flex h-3 w-3 rounded-sm" style={{ backgroundColor: color }} aria-hidden="true" />
              <span className="text-xs text-muted-foreground">
                {labelForVibe(vibe)}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-2" role="listitem">
            <span className="inline-flex h-3 w-3 rounded-sm bg-muted" aria-hidden="true" />
            <span className="text-xs text-muted-foreground">Aucune vibe détectée</span>
          </div>
        </div>
      </div>
    </figure>
  );
});

interface HeatmapCell {
  key: string;
  x: number;
  y: number;
  fill: string;
  title: string;
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
    const column = weekColumns.get(weekStart) ?? 0;
    const dayOfWeek = ((date.getDay() + 6) % 7); // monday = 0
    const x = column * (CELL_SIZE + CELL_GAP);
    const y = dayOfWeek * (CELL_SIZE + CELL_GAP);
    const fill = point.vibe ? VIBE_COLORS[point.vibe] ?? '#94a3b8' : '#d1d5db';
    const label = format(date, "EEEE d MMMM", { locale: fr });
    const title = point.vibe ? `${label} — ${labelForVibe(point.vibe)}` : `${label} — aucune vibe dominante`;
    cells.push({
      key: `${point.date}-${column}`,
      x,
      y,
      fill,
      title,
    });
  });

  return { cells, columnCount: weekColumns.size };
}

function labelForVibe(vibe: string) {
  switch (vibe) {
    case 'calm':
      return 'Calm';
    case 'focus':
      return 'Focus';
    case 'bright':
      return 'Bright';
    case 'reset':
      return 'Reset';
    default:
      return vibe;
  }
}

export default VibesHeatmap;
