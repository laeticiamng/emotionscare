/**
 * NyveeStatsWidget - Widget de statistiques pour le module Nyvee
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame, Target, TrendingUp, Award, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNyveeSessions } from '@/modules/nyvee/hooks/useNyveeSessions';

interface StatItemProps {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: string | number;
  subValue?: string;
  colorClass?: string;
}

const StatItem = memo(({ icon: Icon, label, value, subValue, colorClass = 'text-primary' }: StatItemProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/30"
  >
    <Icon className={cn('h-5 w-5', colorClass)} />
    <span className="text-2xl font-bold text-foreground">{value}</span>
    <span className="text-xs text-muted-foreground text-center">{label}</span>
    {subValue && (
      <span className="text-xs text-primary/80">{subValue}</span>
    )}
  </motion.div>
));

StatItem.displayName = 'StatItem';

interface NyveeStatsWidgetProps {
  className?: string;
  compact?: boolean;
}

export const NyveeStatsWidget = memo(({ className, compact = false }: NyveeStatsWidgetProps) => {
  const { stats, isLoadingStats } = useNyveeSessions();

  if (isLoadingStats) {
    return (
      <Card className={cn('border-border/50 bg-card/60 backdrop-blur-sm', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Chargement...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className={cn('border-border/50 bg-card/60 backdrop-blur-sm', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            Statistiques Nyvee
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Commence une session pour voir tes statistiques !
          </p>
        </CardContent>
      </Card>
    );
  }

  const moodDeltaDisplay = stats.avgMoodDelta !== null
    ? `${stats.avgMoodDelta > 0 ? '+' : ''}${stats.avgMoodDelta.toFixed(1)}%`
    : '—';

  if (compact) {
    return (
      <Card className={cn('border-border/50 bg-card/60 backdrop-blur-sm', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium text-foreground">{stats.currentStreak} jours</span>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">{stats.totalSessions} sessions</span>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              <span className="font-medium text-foreground">{moodDeltaDisplay}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-border/50 bg-card/60 backdrop-blur-sm', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <Sparkles className="h-5 w-5 text-primary" />
          Statistiques Nyvee
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatItem
            icon={Flame}
            label="Série actuelle"
            value={stats.currentStreak}
            subValue={`Record: ${stats.longestStreak}`}
            colorClass="text-orange-500"
          />
          <StatItem
            icon={Target}
            label="Sessions"
            value={stats.totalSessions}
            subValue={`${stats.completedSessions} terminées`}
            colorClass="text-primary"
          />
          <StatItem
            icon={TrendingUp}
            label="Δ Humeur moyen"
            value={moodDeltaDisplay}
            colorClass="text-emerald-500"
          />
          <StatItem
            icon={Clock}
            label="Cycles totaux"
            value={stats.totalCycles}
            subValue={`~${stats.averageCyclesPerSession.toFixed(1)}/session`}
            colorClass="text-cyan-500"
          />
          <StatItem
            icon={Award}
            label="Badge favori"
            value={stats.badgesEarned.calm > 0 ? '🌿' : stats.badgesEarned.partial > 0 ? '✨' : '💫'}
            subValue={`${stats.badgesEarned.calm} calme`}
            colorClass="text-amber-500"
          />
          <StatItem
            icon={Sparkles}
            label="Taux réussite"
            value={`${stats.completionRate.toFixed(0)}%`}
            colorClass="text-purple-500"
          />
        </div>
      </CardContent>
    </Card>
  );
});

NyveeStatsWidget.displayName = 'NyveeStatsWidget';

export default NyveeStatsWidget;
