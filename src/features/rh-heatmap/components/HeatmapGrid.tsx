/**
 * HeatmapGrid - Visualisation grille du bien-être organisationnel
 * Affiche les données agrégées par équipe/département
 */

import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import type { HeatmapCell, HeatmapRow } from '../rhHeatmapService';

interface HeatmapGridProps {
  data: HeatmapRow[];
  columns: string[];
  onCellClick?: (row: string, column: string, value: number) => void;
  showLabels?: boolean;
  colorScale?: 'wellness' | 'stress' | 'engagement';
}

const getColorForValue = (value: number, scale: string): string => {
  // Valeurs de 0 à 100
  const normalized = Math.min(100, Math.max(0, value));
  
  if (scale === 'stress') {
    // Inversé: haut = rouge, bas = vert
    if (normalized >= 70) return 'bg-destructive';
    if (normalized >= 50) return 'bg-orange-400';
    if (normalized >= 30) return 'bg-yellow-400';
    return 'bg-green-500';
  }
  
  // Par défaut (wellness, engagement): haut = vert, bas = rouge
  if (normalized >= 80) return 'bg-emerald-500';
  if (normalized >= 60) return 'bg-green-400';
  if (normalized >= 40) return 'bg-yellow-400';
  if (normalized >= 20) return 'bg-orange-400';
  return 'bg-destructive';
};

const getTextColorForValue = (value: number): string => {
  return value >= 50 ? 'text-white' : 'text-foreground';
};

export const HeatmapGrid = memo<HeatmapGridProps>(({
  data,
  columns,
  onCellClick,
  showLabels = true,
  colorScale = 'wellness'
}) => {
  const maxValue = useMemo(() => {
    return Math.max(...data.flatMap(row => row.cells.map(cell => cell.score)));
  }, [data]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          Heatmap Bien-être Organisationnel
          <Badge variant="outline" className="text-xs">
            {data.length} équipes
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left text-sm font-medium text-muted-foreground min-w-[120px]">
                    Équipe
                  </th>
                  {columns.map((col) => (
                    <th 
                      key={col}
                      className="p-2 text-center text-sm font-medium text-muted-foreground min-w-[80px]"
                    >
                      {col}
                    </th>
                  ))}
                  <th className="p-2 text-center text-sm font-medium text-muted-foreground min-w-[60px]">
                    Moy.
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => {
                  const rowAverage = row.avgScore;
                  
                  return (
                    <tr key={row.teamId} className="border-t border-border/50">
                      <td className="p-2 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <span>{row.teamName}</span>
                        </div>
                      </td>
                      {row.cells.map((cell, cellIndex) => (
                        <td key={cellIndex} className="p-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => onCellClick?.(row.teamId, columns[cellIndex], cell.score)}
                                className={`
                                  w-full h-10 rounded-md transition-all hover:scale-105 hover:shadow-md
                                  ${getColorForValue(cell.score, colorScale)}
                                  ${getTextColorForValue(cell.score)}
                                  flex items-center justify-center font-medium text-sm
                                  focus:outline-none focus:ring-2 focus:ring-primary
                                `}
                                aria-label={`${row.teamName} - ${columns[cellIndex]}: ${cell.score}%`}
                              >
                                {showLabels && `${Math.round(cell.score)}%`}
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="text-sm">
                                <p className="font-medium">{row.teamName}</p>
                                <p className="text-muted-foreground">{columns[cellIndex]}</p>
                                <p className="text-lg font-bold">{cell.score}%</p>
                                <p className="text-xs text-muted-foreground">
                                  {cell.memberCount} participants
                                </p>
                                <p className="text-xs">
                                  Tendance: {cell.trend === 'up' ? '↑' : cell.trend === 'down' ? '↓' : '→'}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </td>
                      ))}
                      <td className="p-1">
                        <div className={`
                          w-full h-10 rounded-md flex items-center justify-center
                          bg-muted font-medium text-sm
                        `}>
                          {Math.round(rowAverage)}%
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TooltipProvider>
        
        {/* Légende */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-destructive" />
            <span>Critique (&lt;20%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-orange-400" />
            <span>Attention (20-40%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-yellow-400" />
            <span>Moyen (40-60%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-green-400" />
            <span>Bon (60-80%)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-emerald-500" />
            <span>Excellent (80%+)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

HeatmapGrid.displayName = 'HeatmapGrid';

export default HeatmapGrid;
