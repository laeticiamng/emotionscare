// @ts-nocheck
/**
 * TeamMoodWidget - Widget de distribution d'humeur équipe
 * Utilise des données réelles depuis Supabase
 */
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, TrendingUp, TrendingDown, Minus, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useB2BTeamStats } from '@/hooks/useB2BTeamStats';
import { cn } from '@/lib/utils';

export const TeamMoodWidget: React.FC = () => {
  const { stats, loading } = useB2BTeamStats();

  const teamMoodData = [
    { name: 'Positif', value: stats.teamMoodDistribution.positive, color: 'hsl(var(--success))' },
    { name: 'Neutre', value: stats.teamMoodDistribution.neutral, color: 'hsl(var(--warning))' },
    { name: 'À surveiller', value: stats.teamMoodDistribution.negative, color: 'hsl(var(--destructive))' },
  ];

  const getTrendIcon = () => {
    if (stats.weeklyTrend === 'up') return <TrendingUp className="h-4 w-4 text-success" aria-hidden="true" />;
    if (stats.weeklyTrend === 'down') return <TrendingDown className="h-4 w-4 text-destructive" aria-hidden="true" />;
    return <Minus className="h-4 w-4 text-muted-foreground" aria-hidden="true" />;
  };

  const getTrendLabel = () => {
    if (stats.weeklyTrend === 'up') return `Amélioration de ${Math.abs(stats.weeklyChange)}%`;
    if (stats.weeklyTrend === 'down') return `Baisse de ${Math.abs(stats.weeklyChange)}%`;
    return 'Stable cette semaine';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" aria-hidden="true" />
          Ambiance Équipe
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-32" role="img" aria-label="Graphique de distribution d'humeur de l'équipe">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={teamMoodData}
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={50}
                      dataKey="value"
                    >
                      {teamMoodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-2" role="list" aria-label="Distribution détaillée">
                {teamMoodData.map((item, index) => (
                  <div key={index} className="flex items-center gap-2" role="listitem">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                      aria-hidden="true"
                    />
                    <span className="text-sm">{item.name}</span>
                    <Badge variant="secondary" className="text-xs ml-auto">
                      {item.value}%
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                {getTrendIcon()}
                <span>{getTrendLabel()}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <Shield className="h-3 w-3" aria-hidden="true" />
                <span>Données anonymisées — Conforme RGPD</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TeamMoodWidget;
