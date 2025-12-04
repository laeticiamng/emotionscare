// @ts-nocheck
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEmotionalEnergy } from '@/hooks/useEmotionalEnergy';
import { useWellnessStreak } from '@/hooks/useWellnessStreak';
import { useHarmonyPoints } from '@/hooks/useHarmonyPoints';
import { cn } from '@/lib/utils';

/**
 * Dashboard de stats de gamification (style Duolingo)
 * Affiche Progression, Sessions, Points, Série
 */
export const GamificationStats = () => {
  const { energy } = useEmotionalEnergy();
  const { streak } = useWellnessStreak();
  const { points } = useHarmonyPoints();

  const stats = [
    {
      label: 'Progression',
      sublabel: 'Cette semaine',
      value: energy ? `${Math.round((energy.currentEnergy / energy.maxEnergy) * 100)}%` : '0%',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      showProgress: true,
      progress: energy ? (energy.currentEnergy / energy.maxEnergy) * 100 : 0
    },
    {
      label: 'Sessions',
      sublabel: 'Ce mois-ci',
      value: streak?.totalCheckins || 0,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      label: 'Points',
      sublabel: 'Total',
      value: points?.totalPoints?.toLocaleString() || 0,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Série',
      sublabel: 'Jours consécutifs',
      value: streak?.currentStreak || 0,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={cn('border-none', stat.bgColor)}>
          <CardContent className="pt-6 pb-4">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {stat.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stat.sublabel}
                  </p>
                </div>
                <p className={cn('text-3xl font-bold tabular-nums', stat.color)}>
                  {stat.value}
                </p>
              </div>
              {stat.showProgress && (
                <Progress value={stat.progress} className="h-2" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
