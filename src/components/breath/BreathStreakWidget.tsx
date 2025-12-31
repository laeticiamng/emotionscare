import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Trophy, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BreathStreakWidgetProps {
  currentStreak: number;
  longestStreak?: number;
  weeklyGoal?: number;
  weeklyProgress?: number;
  className?: string;
}

export const BreathStreakWidget: React.FC<BreathStreakWidgetProps> = ({
  currentStreak,
  longestStreak = 0,
  weeklyGoal = 60,
  weeklyProgress = 0,
  className,
}) => {
  const isOnFire = currentStreak >= 3;
  const isNewRecord = currentStreak > 0 && currentStreak >= longestStreak;
  const goalProgress = Math.min(100, (weeklyProgress / weeklyGoal) * 100);

  const streakMessage = useMemo(() => {
    if (currentStreak === 0) return 'Commence ta série !';
    if (currentStreak === 1) return 'Bien joué, continue !';
    if (currentStreak < 7) return `${currentStreak} jours consécutifs`;
    if (currentStreak < 30) return 'Belle régularité !';
    return 'Maître du souffle !';
  }, [currentStreak]);

  return (
    <Card className={cn('border-border/50 bg-card/60 overflow-hidden', className)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Streak display */}
          <div className="flex items-center gap-3">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: isOnFire ? [1, 1.1, 1] : 1,
              }}
              transition={{ 
                duration: 0.5,
                repeat: isOnFire ? Infinity : 0,
                repeatDelay: 2
              }}
              className={cn(
                'relative flex items-center justify-center h-14 w-14 rounded-full',
                isOnFire 
                  ? 'bg-gradient-to-br from-warning/30 to-destructive/30' 
                  : 'bg-muted/50'
              )}
            >
              <Flame 
                className={cn(
                  'h-7 w-7 transition-colors',
                  isOnFire ? 'text-warning' : 'text-muted-foreground'
                )} 
              />
              {isNewRecord && currentStreak > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1"
                >
                  <Trophy className="h-5 w-5 text-warning" />
                </motion.div>
              )}
            </motion.div>
            
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-foreground">
                  {currentStreak}
                </span>
                <span className="text-sm text-muted-foreground">jour{currentStreak !== 1 ? 's' : ''}</span>
              </div>
              <p className="text-xs text-muted-foreground">{streakMessage}</p>
            </div>
          </div>

          {/* Weekly progress */}
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Target className="h-3 w-3" />
              <span>{weeklyProgress}/{weeklyGoal} min</span>
            </div>
            <div className="w-20 h-2 bg-muted/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className={cn(
                  'h-full rounded-full',
                  goalProgress >= 100 ? 'bg-success' : 'bg-primary'
                )}
              />
            </div>
            {goalProgress >= 100 && (
              <span className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                Objectif atteint !
              </span>
            )}
          </div>
        </div>

        {/* Longest streak info */}
        {longestStreak > currentStreak && (
          <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground flex items-center justify-between">
            <span>Record personnel : {longestStreak} jours</span>
            <span>{longestStreak - currentStreak} jours pour le battre</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BreathStreakWidget;
