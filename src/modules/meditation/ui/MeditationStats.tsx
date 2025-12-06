/**
 * MeditationStats - Dashboard statistiques et progression
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Clock, Target, TrendingUp, Heart } from 'lucide-react';
import type { MeditationStats } from '../types';
import { techniqueLables } from '../types';

interface MeditationStatsProps {
  stats: MeditationStats;
  isLoading?: boolean;
}

export function MeditationStats({ stats, isLoading }: MeditationStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 w-24 bg-muted rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statsCards = [
    {
      title: 'Sessions totales',
      value: stats.totalSessions,
      icon: Target,
      color: 'text-primary',
    },
    {
      title: 'Temps total',
      value: `${Math.floor(stats.totalDuration / 60)}min`,
      icon: Clock,
      color: 'text-blue-500',
    },
    {
      title: 'Série actuelle',
      value: `${stats.currentStreak} jours`,
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      title: 'Amélioration humeur',
      value: stats.avgMoodDelta ? `+${stats.avgMoodDelta.toFixed(0)}` : 'N/A',
      icon: Heart,
      color: 'text-pink-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Favorite technique & achievements */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Technique favorite
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.favoriteTechnique ? (
              <div>
                <p className="text-2xl font-bold mb-1">
                  {techniqueLables[stats.favoriteTechnique]}
                </p>
                <p className="text-sm text-muted-foreground">
                  Votre technique la plus pratiquée
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                Complétez des sessions pour découvrir votre favorite
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">
                {stats.completionRate.toFixed(0)}%
              </span>
              <Badge variant={stats.completionRate >= 80 ? 'default' : 'secondary'}>
                {stats.completionRate >= 80 ? 'Excellent' : 'Continuez'}
              </Badge>
            </div>
            <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${stats.completionRate}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {stats.longestStreak >= 7 && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold">Série record !</p>
                <p className="text-sm text-muted-foreground">
                  {stats.longestStreak} jours consécutifs de pratique
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
