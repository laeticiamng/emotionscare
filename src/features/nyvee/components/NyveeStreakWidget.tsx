/**
 * NyveeStreakWidget - Widget de série pour le module Nyvee
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNyveeSessions } from '@/modules/nyvee/hooks/useNyveeSessions';
import { Progress } from '@/components/ui/progress';

interface NyveeStreakWidgetProps {
  className?: string;
  weeklyGoal?: number;
}

export const NyveeStreakWidget = memo(({ className, weeklyGoal = 5 }: NyveeStreakWidgetProps) => {
  const { stats, sessions, isLoadingStats } = useNyveeSessions();

  // Calculer les sessions de cette semaine
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const weeklyProgress = sessions.filter(s => 
    s.completed && new Date(s.created_at) >= startOfWeek
  ).length;

  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  if (isLoadingStats) {
    return (
      <Card className={cn('border-border/50 bg-card/60 backdrop-blur-sm', className)}>
        <CardContent className="p-4">
          <div className="animate-pulse h-16 bg-muted/30 rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Streak actuel */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className={cn(
              'p-2 rounded-full',
              stats?.currentStreak && stats.currentStreak > 0 
                ? 'bg-orange-500/20' 
                : 'bg-muted/30'
            )}>
              <Flame className={cn(
                'h-6 w-6',
                stats?.currentStreak && stats.currentStreak > 0 
                  ? 'text-orange-500' 
                  : 'text-muted-foreground'
              )} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats?.currentStreak || 0}
              </p>
              <p className="text-xs text-muted-foreground">jours de suite</p>
            </div>
          </motion.div>

          {/* Record */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="p-2 rounded-full bg-amber-500/20">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {stats?.longestStreak || 0}
              </p>
              <p className="text-xs text-muted-foreground">record</p>
            </div>
          </motion.div>

          {/* Objectif hebdo */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 max-w-[140px]"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Semaine</span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {weeklyProgress}/{weeklyGoal}
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2"
            />
          </motion.div>
        </div>

        {/* Message motivant */}
        {stats?.currentStreak !== undefined && stats.currentStreak > 0 && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-center text-primary/80 mt-3 pt-3 border-t border-border/30"
          >
            {stats.currentStreak >= 7 
              ? '🔥 Une semaine de suite ! Continue ainsi !'
              : stats.currentStreak >= 3 
                ? '✨ Belle série ! Tu es sur la bonne voie.'
                : '💪 Bonne continuation !'}
          </motion.p>
        )}
      </CardContent>
    </Card>
  );
});

NyveeStreakWidget.displayName = 'NyveeStreakWidget';

export default NyveeStreakWidget;
