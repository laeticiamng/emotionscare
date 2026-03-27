// @ts-nocheck
import React, { useRef, useEffect, useState } from 'react';
import { OrgWeekly, TeamRow, VibeBucket } from '@/hooks/useOrgWeekly';
import { useOrgStore } from '@/store/org.store';
import { AnonymityGuard } from './AnonymityGuard';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface VibesHeatmapProps {
  data: OrgWeekly;
  renderMode?: 'svg' | 'canvas';
}

const bucketToColor = (bucket: VibeBucket): string => {
  switch (bucket) {
    case 'low': return 'hsl(var(--vibe-low))';
    case 'medium': return 'hsl(var(--vibe-medium))';
    case 'high': return 'hsl(var(--vibe-high))';
  }
};

const bucketToLabel = (bucket: VibeBucket): string => {
  switch (bucket) {
    case 'low': return 'Bas';
    case 'medium': return 'Stable'; 
    case 'high': return 'Haut';
  }
};

export const VibesHeatmap: React.FC<VibesHeatmapProps> = ({ 
  data, 
  renderMode = 'svg' 
}) => {
  const { t } = useTranslation();
  const { selectedCell, setSelectedCell } = useOrgStore();
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  
  const eligibleTeams = data.teams.filter(team => team.eligible);
  const dates = eligibleTeams[0]?.days?.map(day => day.date) || [];

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    let newRow = row;
    let newCol = col;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        newRow = Math.max(0, row - 1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newRow = Math.min(eligibleTeams.length - 1, row + 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newCol = Math.max(0, col - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newCol = Math.min(dates.length - 1, col + 1);
        break;
      case 'Home':
        e.preventDefault();
        newCol = 0;
        break;
      case 'End':
        e.preventDefault();
        newCol = dates.length - 1;
        break;
      default:
        return;
    }

    setFocusedCell({ row: newRow, col: newCol });
    
    // Update selection
    const team = eligibleTeams[newRow];
    const date = dates[newCol];
    if (team && date) {
      setSelectedCell({ teamId: team.team_id, date });
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
  };

  if (eligibleTeams.length === 0) {
    return <AnonymityGuard minN={data.min_n} />;
  }

  return (
    <div 
      className="space-y-4"
      role="table"
      aria-rowcount={eligibleTeams.length + 1}
      aria-colcount={dates.length + 1}
      aria-label="Heatmap des vibes d'équipe"
    >
      {/* Legend */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium">Légende :</span>
        <div className="flex items-center gap-4">
          {(['low', 'medium', 'high'] as VibeBucket[]).map((bucket) => (
            <div key={bucket} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: bucketToColor(bucket) }}
                aria-hidden="true"
              />
              <span className="text-sm">{bucketToLabel(bucket)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* Header with dates */}
          <div className="grid grid-cols-[200px_repeat(7,80px)] gap-1 mb-2">
            <div></div>
            {dates.map((date) => (
              <div key={date} className="text-xs text-center font-medium p-2">
                {formatDate(date)}
              </div>
            ))}
          </div>

          {/* Team rows */}
          {eligibleTeams.map((team, rowIndex) => (
            <div key={team.team_id} className="grid grid-cols-[200px_repeat(7,80px)] gap-1 mb-1">
              {/* Team name */}
              <div className="flex items-center p-3 bg-muted rounded text-sm font-medium truncate">
                {team.team_name}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({team.size_window})
                </span>
              </div>

              {/* Day cells */}
              {dates.map((date, colIndex) => {
                const dayData = team.days?.find(d => d.date === date);
                const bucket = dayData?.bucket || 'low';
                const isSelected = selectedCell?.teamId === team.team_id && selectedCell?.date === date;
                const isFocused = focusedCell?.row === rowIndex && focusedCell?.col === colIndex;

                return (
                  <button
                    key={date}
                    role="cell"
                    tabIndex={isFocused ? 0 : -1}
                    className={cn(
                      "h-12 rounded border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary",
                      isSelected && "ring-2 ring-primary",
                      "hover:brightness-110"
                    )}
                    style={{ 
                      backgroundColor: bucketToColor(bucket),
                      borderColor: isSelected ? 'hsl(var(--primary))' : 'transparent'
                    }}
                    aria-label={`${team.team_name}, ${formatDate(date)} : ${bucketToLabel(bucket)}`}
                    onClick={() => setSelectedCell({ teamId: team.team_id, date })}
                    onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                    onFocus={() => setFocusedCell({ row: rowIndex, col: colIndex })}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};