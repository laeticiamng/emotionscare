/**
 * OrgHeatmap - Heatmap organisationnelle pour B2B
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertTriangle, Shield, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

interface HeatmapDataPoint {
  weekStart: string;
  department: string;
  intensity: number;
  riskZones: number;
}

interface DepartmentStats {
  department: string;
  employeeCount: number;
  avgRecoveryHours: number;
  avgConstraintHours: number;
  riskLevel: 'low' | 'medium' | 'high';
  trend: 'improving' | 'stable' | 'declining';
}

interface OrgHeatmapProps {
  heatmapData: HeatmapDataPoint[];
  departmentStats: DepartmentStats[];
  hasEnoughData: boolean;
  minimumCohortSize: number;
  isLoading?: boolean;
}

const riskLevelConfig = {
  low: { color: 'bg-green-500/20 border-green-500/40', textColor: 'text-green-600', label: 'Faible' },
  medium: { color: 'bg-orange-500/20 border-orange-500/40', textColor: 'text-orange-600', label: 'Modéré' },
  high: { color: 'bg-red-500/20 border-red-500/40', textColor: 'text-red-600', label: 'Élevé' },
};

const trendConfig = {
  improving: { color: 'text-green-600', label: '↑ Amélioration' },
  stable: { color: 'text-muted-foreground', label: '→ Stable' },
  declining: { color: 'text-red-600', label: '↓ Dégradation' },
};

export const OrgHeatmap = memo(function OrgHeatmap({
  heatmapData,
  departmentStats,
  hasEnoughData,
  minimumCohortSize,
  isLoading = false,
}: OrgHeatmapProps) {
  if (!hasEnoughData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Heatmap temporelle
          </CardTitle>
          <CardDescription>
            Visualisation des zones de charge par équipe et période
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Shield className="h-12 w-12 mx-auto mb-4 text-primary/50" />
            <p className="text-muted-foreground font-medium">
              Données insuffisantes pour l'agrégation
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Minimum {minimumCohortSize} collaborateurs requis par groupe pour garantir l'anonymisation
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group heatmap data by week and department
  const weeks = [...new Set(heatmapData.map(d => d.weekStart))].slice(0, 8);
  const departments = [...new Set(heatmapData.map(d => d.department))];

  return (
    <div className="space-y-6">
      {/* Heatmap Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Heatmap temporelle
          </CardTitle>
          <CardDescription>
            Intensité de la charge par semaine et département
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header */}
              <div className="grid gap-2 mb-2" style={{ gridTemplateColumns: `120px repeat(${weeks.length}, 1fr)` }}>
                <div className="text-xs text-muted-foreground">Département</div>
                {weeks.map(week => (
                  <div key={week} className="text-xs text-muted-foreground text-center">
                    {format(parseISO(week), 'dd MMM', { locale: fr })}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {departments.map((dept, deptIndex) => (
                <motion.div
                  key={dept}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: deptIndex * 0.05 }}
                  className="grid gap-2 mb-2"
                  style={{ gridTemplateColumns: `120px repeat(${weeks.length}, 1fr)` }}
                >
                  <div className="text-sm font-medium truncate flex items-center">
                    {dept === 'global' ? 'Organisation' : dept}
                  </div>
                  {weeks.map(week => {
                    const dataPoint = heatmapData.find(d => d.weekStart === week && d.department === dept);
                    const intensity = dataPoint?.intensity ?? 0;
                    
                    return (
                      <div
                        key={`${dept}-${week}`}
                        className={cn(
                          'aspect-[2/1] rounded-md flex items-center justify-center text-xs font-medium transition-colors',
                          intensity > 0.7 && 'bg-red-500/30 text-red-700',
                          intensity > 0.4 && intensity <= 0.7 && 'bg-orange-500/30 text-orange-700',
                          intensity <= 0.4 && 'bg-green-500/30 text-green-700'
                        )}
                      >
                        {Math.round(intensity * 100)}%
                      </div>
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500/30" />
              <span className="text-xs text-muted-foreground">Faible charge</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-500/30" />
              <span className="text-xs text-muted-foreground">Charge modérée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500/30" />
              <span className="text-xs text-muted-foreground">Charge élevée</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Vue par département
          </CardTitle>
          <CardDescription>
            Indicateurs agrégés par équipe
          </CardDescription>
        </CardHeader>
        <CardContent>
          {departmentStats.length === 0 ? (
            <p className="text-center py-6 text-muted-foreground">
              Aucune donnée départementale disponible
            </p>
          ) : (
            <div className="space-y-3">
              {departmentStats.map((stat, index) => {
                const riskConfig = riskLevelConfig[stat.riskLevel];
                const trend = trendConfig[stat.trend];
                
                return (
                  <motion.div
                    key={stat.department}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className={cn('border-2', riskConfig.color)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{stat.department}</span>
                              <Badge variant="outline" className="text-xs">
                                {stat.employeeCount} pers.
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span>Récup: {stat.avgRecoveryHours}h</span>
                              <span>Contrainte: {stat.avgConstraintHours}h</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={cn('mb-1', riskConfig.color, riskConfig.textColor)}>
                              {stat.riskLevel === 'high' && <AlertTriangle className="h-3 w-3 mr-1" />}
                              Risque {riskConfig.label}
                            </Badge>
                            <div className={cn('text-xs', trend.color)}>
                              {trend.label}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

export default OrgHeatmap;
