/**
 * Statistiques et insights SEUIL
 */
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Flame, 
  Target, 
  Clock, 
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { useSeuilStats, type SeuilPattern } from '../hooks/useSeuilStats';

export const SeuilStats: React.FC = memo(() => {
  const { data: stats, isLoading } = useSeuilStats();

  if (isLoading || !stats) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-48" />
      </Card>
    );
  }

  if (stats.totalEvents === 0) {
    return null;
  }

  const zoneColors = {
    low: 'bg-emerald-500',
    intermediate: 'bg-amber-500',
    critical: 'bg-rose-500',
    closure: 'bg-indigo-500',
  };

  const zoneLabels = {
    low: 'Basse',
    intermediate: 'Intermédiaire',
    critical: 'Critique',
    closure: 'Clôture',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Quick stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="Sessions"
          value={stats.totalEvents}
          color="text-primary"
        />
        <StatCard
          icon={<CheckCircle className="w-4 h-4" />}
          label="Complétées"
          value={`${Math.round(stats.completionRate)}%`}
          color="text-success"
        />
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          label="Streak actuel"
          value={`${stats.currentStreak}j`}
          color="text-amber-500"
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Moment fréquent"
          value={stats.mostCommonTime.split(' ')[0]}
          color="text-indigo-500"
        />
      </div>

      {/* Main stats card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Évolution
            </span>
            {stats.lastWeekComparison.change !== 0 && (
              <Badge 
                variant="secondary"
                className={
                  stats.lastWeekComparison.change < 0 
                    ? 'bg-emerald-500/20 text-emerald-600' 
                    : 'bg-rose-500/20 text-rose-600'
                }
              >
                {stats.lastWeekComparison.change < 0 ? (
                  <TrendingDown className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingUp className="w-3 h-3 mr-1" />
                )}
                {Math.abs(stats.lastWeekComparison.change).toFixed(0)}%
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Average level */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Niveau moyen</span>
              <span className="font-medium">{Math.round(stats.averageLevel)}%</span>
            </div>
            <Progress 
              value={stats.averageLevel} 
              className="h-2"
            />
          </div>

          {/* Zone distribution */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Distribution des zones</p>
            <div className="flex gap-1 h-4 rounded-full overflow-hidden">
              {(Object.entries(stats.zoneDistribution) as [keyof typeof zoneColors, number][])
                .filter(([_, count]) => count > 0)
                .map(([zone, count]) => (
                  <div
                    key={zone}
                    className={`${zoneColors[zone]} transition-all`}
                    style={{ 
                      width: `${(count / stats.totalEvents) * 100}%`,
                      minWidth: count > 0 ? '8px' : '0'
                    }}
                    title={`${zoneLabels[zone]}: ${count}`}
                  />
                ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(Object.entries(stats.zoneDistribution) as [keyof typeof zoneColors, number][])
                .filter(([_, count]) => count > 0)
                .map(([zone, count]) => (
                  <div key={zone} className="flex items-center gap-1 text-xs">
                    <div className={`w-2 h-2 rounded-full ${zoneColors[zone]}`} />
                    <span className="text-muted-foreground">
                      {zoneLabels[zone]}: {count}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Record streak */}
          {stats.longestStreak > 1 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Record streak</span>
              <span className="font-medium text-amber-500">
                🔥 {stats.longestStreak} jours
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patterns/Insights */}
      {stats.patterns.length > 0 && (
        <Card className="border-dashed">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.patterns.map((pattern, idx) => (
              <PatternItem key={idx} pattern={pattern} />
            ))}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
});

SeuilStats.displayName = 'SeuilStats';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = memo(({ icon, label, value, color }) => (
  <Card className="bg-muted/30">
    <CardContent className="p-3 text-center">
      <div className={`${color} mb-1 flex justify-center`}>{icon}</div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

const PatternItem: React.FC<{ pattern: SeuilPattern }> = memo(({ pattern }) => (
  <div className="flex items-start gap-2 p-2 rounded-lg bg-muted/30">
    <span className="text-sm">
      {pattern.type === 'improvement' ? '🌿' : 
       pattern.type === 'time' ? '⏰' : '📊'}
    </span>
    <p className="text-sm text-muted-foreground">{pattern.description}</p>
  </div>
));

PatternItem.displayName = 'PatternItem';

export default SeuilStats;
