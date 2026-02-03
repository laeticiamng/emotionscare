/**
 * Heatmap émotionnelle B2B
 * Visualisation des patterns émotionnels par équipe/période
 */

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Grid, Calendar, Filter, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES
// ============================================================================

export interface HeatmapDataPoint {
  teamId: string;
  teamName: string;
  dayOfWeek: number; // 0-6 (Lun-Dim)
  hour: number; // 0-23
  avgValence: number; // -1 to 1
  avgArousal: number; // 0 to 1
  sampleCount: number;
}

export interface HeatmapConfig {
  showValence: boolean;
  showArousal: boolean;
  groupBy: 'team' | 'time' | 'combined';
}

// ============================================================================
// MOCK DATA
// ============================================================================

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const TEAMS = ['Développement', 'Marketing', 'Support', 'RH', 'Finance'];

function generateMockData(): HeatmapDataPoint[] {
  const data: HeatmapDataPoint[] = [];
  
  TEAMS.forEach((teamName, teamIdx) => {
    for (let day = 0; day < 5; day++) { // Lun-Ven seulement
      for (let hour = 8; hour <= 18; hour++) { // Heures de travail
        // Simulate realistic patterns
        const morningBoost = hour >= 9 && hour <= 11 ? 0.2 : 0;
        const afternoonDip = hour >= 14 && hour <= 15 ? -0.15 : 0;
        const fridayEffect = day === 4 ? 0.1 : 0;
        const mondayBlues = day === 0 ? -0.1 : 0;
        
        const baseValence = 0.3 + (Math.random() * 0.4) + morningBoost + afternoonDip + fridayEffect + mondayBlues;
        const baseArousal = 0.4 + (Math.random() * 0.3);
        
        data.push({
          teamId: `team-${teamIdx}`,
          teamName,
          dayOfWeek: day,
          hour,
          avgValence: Math.max(-1, Math.min(1, baseValence)),
          avgArousal: Math.max(0, Math.min(1, baseArousal)),
          sampleCount: Math.floor(Math.random() * 20) + 5,
        });
      }
    }
  });
  
  return data;
}

// ============================================================================
// UTILS
// ============================================================================

function getValenceColor(valence: number): string {
  // -1 (négatif) = rouge, 0 = jaune, +1 (positif) = vert
  if (valence >= 0.5) return 'bg-green-500';
  if (valence >= 0.2) return 'bg-green-400';
  if (valence >= 0) return 'bg-yellow-400';
  if (valence >= -0.3) return 'bg-orange-400';
  return 'bg-red-500';
}

function getArousalOpacity(arousal: number): number {
  // Plus d'arousal = plus d'opacité
  return 0.3 + (arousal * 0.7);
}

// ============================================================================
// COMPONENT
// ============================================================================

export function EmotionalHeatmap() {
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [selectedMetric, setSelectedMetric] = useState<'valence' | 'arousal'>('valence');
  
  const data = useMemo(() => generateMockData(), []);
  
  const filteredData = useMemo(() => {
    if (selectedTeam === 'all') return data;
    return data.filter(d => d.teamId === selectedTeam);
  }, [data, selectedTeam]);
  
  // Aggregate by day/hour for heatmap
  const heatmapGrid = useMemo(() => {
    const grid: Record<string, HeatmapDataPoint[]> = {};
    
    filteredData.forEach(point => {
      const key = `${point.dayOfWeek}-${point.hour}`;
      if (!grid[key]) grid[key] = [];
      grid[key].push(point);
    });
    
    return Object.entries(grid).map(([key, points]) => {
      const [day, hour] = key.split('-').map(Number);
      const avgValence = points.reduce((acc, p) => acc + p.avgValence, 0) / points.length;
      const avgArousal = points.reduce((acc, p) => acc + p.avgArousal, 0) / points.length;
      const totalSamples = points.reduce((acc, p) => acc + p.sampleCount, 0);
      
      return { day, hour, avgValence, avgArousal, totalSamples };
    });
  }, [filteredData]);

  const workingHours = HOURS.filter(h => h >= 8 && h <= 18);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Grid className="h-5 w-5 text-primary" />
            Heatmap Émotionnelle
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Équipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les équipes</SelectItem>
                {TEAMS.map((team, idx) => (
                  <SelectItem key={idx} value={`team-${idx}`}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedMetric} onValueChange={(v: 'valence' | 'arousal') => setSelectedMetric(v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="valence">Valence</SelectItem>
                <SelectItem value="arousal">Énergie</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Legend */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Légende:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-red-500" />
              <span>Négatif</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-yellow-400" />
              <span>Neutre</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span>Positif</span>
            </div>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  La heatmap montre les tendances émotionnelles moyennes par jour et heure.
                  Survolez une cellule pour plus de détails.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Hour headers */}
            <div className="flex mb-2">
              <div className="w-12" /> {/* Spacer for day labels */}
              {workingHours.map(hour => (
                <div
                  key={hour}
                  className="flex-1 text-center text-xs text-muted-foreground"
                >
                  {hour}h
                </div>
              ))}
            </div>

            {/* Grid rows */}
            {DAYS.slice(0, 5).map((day, dayIdx) => (
              <div key={dayIdx} className="flex items-center mb-1">
                <div className="w-12 text-sm text-muted-foreground">{day}</div>
                {workingHours.map(hour => {
                  const cell = heatmapGrid.find(c => c.day === dayIdx && c.hour === hour);
                  const value = selectedMetric === 'valence' 
                    ? (cell?.avgValence ?? 0)
                    : (cell?.avgArousal ?? 0);
                  
                  return (
                    <TooltipProvider key={hour}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div
                            className={cn(
                              'flex-1 h-8 rounded-sm mx-0.5 cursor-pointer transition-transform hover:scale-110',
                              selectedMetric === 'valence'
                                ? getValenceColor(value)
                                : 'bg-primary'
                            )}
                            style={{
                              opacity: cell ? getArousalOpacity(cell.avgArousal) : 0.1
                            }}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: cell ? getArousalOpacity(cell.avgArousal) : 0.1 }}
                            transition={{ delay: (dayIdx * 11 + hour) * 0.01 }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <p className="font-medium">{day} {hour}h00</p>
                            {cell ? (
                              <>
                                <p>Valence: {(cell.avgValence * 100).toFixed(0)}%</p>
                                <p>Énergie: {(cell.avgArousal * 100).toFixed(0)}%</p>
                                <p className="text-muted-foreground">{cell.totalSamples} mesures</p>
                              </>
                            ) : (
                              <p className="text-muted-foreground">Pas de données</p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
          <h4 className="font-medium text-foreground mb-2">💡 Insights</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Meilleur moment: <span className="text-foreground">Mardi-Mercredi 10h-11h</span></li>
            <li>• Période à risque: <span className="text-foreground">Lundi matin, Vendredi 15h</span></li>
            <li>• Tendance: <span className="text-green-500">↑ Amélioration de 5% cette semaine</span></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default EmotionalHeatmap;
