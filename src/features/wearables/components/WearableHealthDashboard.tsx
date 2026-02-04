/**
 * WearableHealthDashboard - Dashboard des métriques de santé connectées
 */

import React, { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Moon, Footprints, Flame, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { wearablesUtils } from '../index';

interface HealthMetrics {
  heartRate?: { current: number; resting: number; max: number };
  hrv?: { current: number; trend: 'up' | 'down' | 'stable' };
  sleep?: { hours: number; quality: number; deep: number; rem: number };
  steps?: { current: number; goal: number };
  calories?: { burned: number; goal: number };
  activeMinutes?: { current: number; goal: number };
}

interface WearableHealthDashboardProps {
  metrics: HealthMetrics;
  className?: string;
}

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-500" aria-hidden="true" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" aria-hidden="true" />;
  return <span className="w-4 h-4 text-muted-foreground">→</span>;
};

export const WearableHealthDashboard = memo(function WearableHealthDashboard({
  metrics,
  className
}: WearableHealthDashboardProps) {
  const healthScore = useMemo(() => {
    return wearablesUtils.calculateHealthScore({
      restingHeartRate: metrics.heartRate?.resting,
      hrv: metrics.hrv?.current,
      sleepMinutes: metrics.sleep ? metrics.sleep.hours * 60 : undefined,
      steps: metrics.steps?.current
    });
  }, [metrics]);

  const scoreColor = healthScore >= 80 ? 'text-green-500' : 
                     healthScore >= 60 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className={cn('space-y-4', className)}>
      {/* Score global */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Score Santé Global</CardTitle>
            <Badge variant="outline" className={scoreColor}>
              {healthScore >= 80 ? 'Excellent' : healthScore >= 60 ? 'Bon' : 'À améliorer'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={cn('text-5xl font-bold', scoreColor)}>
              {healthScore}
            </div>
            <div className="flex-1">
              <Progress 
                value={healthScore} 
                className="h-3"
                aria-label={`Score santé: ${healthScore} sur 100`}
              />
              <p className="text-xs text-muted-foreground mt-2">
                Basé sur vos données de fréquence cardiaque, sommeil et activité
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métriques détaillées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Fréquence cardiaque */}
        {metrics.heartRate && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" aria-hidden="true" />
                Fréquence Cardiaque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-500">
                {metrics.heartRate.current} <span className="text-sm font-normal">BPM</span>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                <span>Repos: {metrics.heartRate.resting}</span>
                <span>Max: {metrics.heartRate.max}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* HRV */}
        {metrics.hrv && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" aria-hidden="true" />
                Variabilité Cardiaque (HRV)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-purple-500">
                  {metrics.hrv.current} <span className="text-sm font-normal">ms</span>
                </span>
                <TrendIcon trend={metrics.hrv.trend} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {metrics.hrv.current > 50 ? 'Bon niveau de récupération' : 'Repos recommandé'}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sommeil */}
        {metrics.sleep && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" aria-hidden="true" />
                Sommeil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-indigo-500">
                {wearablesUtils.formatDuration(metrics.sleep.hours * 60)}
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Qualité</span>
                  <span>{metrics.sleep.quality}%</span>
                </div>
                <Progress 
                  value={metrics.sleep.quality} 
                  className="h-1.5"
                  aria-label={`Qualité sommeil: ${metrics.sleep.quality}%`}
                />
                <div className="flex gap-2 text-[10px] text-muted-foreground mt-2">
                  <span>Profond: {metrics.sleep.deep}%</span>
                  <span>REM: {metrics.sleep.rem}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pas */}
        {metrics.steps && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Footprints className="w-4 h-4 text-blue-500" aria-hidden="true" />
                Pas Aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-500">
                {metrics.steps.current.toLocaleString()}
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Objectif: {metrics.steps.goal.toLocaleString()}</span>
                  <span>{Math.round((metrics.steps.current / metrics.steps.goal) * 100)}%</span>
                </div>
                <Progress 
                  value={Math.min((metrics.steps.current / metrics.steps.goal) * 100, 100)} 
                  className="h-2"
                  aria-label={`Progression pas: ${metrics.steps.current} sur ${metrics.steps.goal}`}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calories */}
        {metrics.calories && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-500" aria-hidden="true" />
                Calories Brûlées
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-500">
                {metrics.calories.burned.toLocaleString()} <span className="text-sm font-normal">kcal</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Objectif: {metrics.calories.goal}</span>
                  <span>{Math.round((metrics.calories.burned / metrics.calories.goal) * 100)}%</span>
                </div>
                <Progress 
                  value={Math.min((metrics.calories.burned / metrics.calories.goal) * 100, 100)} 
                  className="h-2"
                  aria-label={`Progression calories: ${metrics.calories.burned} sur ${metrics.calories.goal}`}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Minutes actives */}
        {metrics.activeMinutes && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" aria-hidden="true" />
                Minutes Actives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500">
                {metrics.activeMinutes.current} <span className="text-sm font-normal">min</span>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Objectif: {metrics.activeMinutes.goal} min</span>
                  <span>{Math.round((metrics.activeMinutes.current / metrics.activeMinutes.goal) * 100)}%</span>
                </div>
                <Progress 
                  value={Math.min((metrics.activeMinutes.current / metrics.activeMinutes.goal) * 100, 100)} 
                  className="h-2"
                  aria-label={`Progression minutes actives: ${metrics.activeMinutes.current} sur ${metrics.activeMinutes.goal}`}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
});

export default WearableHealthDashboard;
