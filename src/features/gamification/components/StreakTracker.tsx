/**
 * StreakTracker - Composant de suivi des séries
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Snowflake, Calendar, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { StreakData, StreakReward } from '../types';
import { cn } from '@/lib/utils';

interface StreakTrackerProps {
  streak: StreakData;
  rewards?: StreakReward[];
  onFreezeUse?: () => Promise<void>;
  className?: string;
}

const DEFAULT_REWARDS: StreakReward[] = [
  { day: 3, xp_bonus: 50 },
  { day: 7, xp_bonus: 100, badge_id: 'streak_week' },
  { day: 14, xp_bonus: 200 },
  { day: 30, xp_bonus: 500, badge_id: 'streak_month', special_reward: 'Titre: Régulier' },
  { day: 60, xp_bonus: 1000 },
  { day: 100, xp_bonus: 2000, badge_id: 'streak_legend', special_reward: 'Titre: Légende' },
];

export const StreakTracker = memo(function StreakTracker({
  streak,
  rewards = DEFAULT_REWARDS,
  onFreezeUse,
  className = '',
}: StreakTrackerProps) {
  const nextReward = rewards.find(r => r.day > streak.current_streak);
  const daysToNextReward = nextReward ? nextReward.day - streak.current_streak : 0;
  const progressToNext = nextReward 
    ? ((streak.current_streak % (nextReward.day - (rewards.find(r => r.day < nextReward.day)?.day || 0))) / 
       (nextReward.day - (rewards.find(r => r.day < nextReward.day)?.day || 0))) * 100
    : 100;

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Flame className="text-orange-500" />
          Série en cours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Streak Count */}
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <motion.div
              className="relative"
              animate={{ 
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{streak.current_streak}</span>
              </div>
              {streak.current_streak >= 7 && (
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Flame className="text-orange-500 fill-orange-400" size={20} />
                </motion.div>
              )}
            </motion.div>
            <div>
              <p className="text-sm text-muted-foreground">Jours consécutifs</p>
              <p className="text-xs text-muted-foreground">
                Record: {streak.longest_streak} jours
                {streak.current_streak === streak.longest_streak && (
                  <Trophy className="inline ml-1 text-primary" size={12} />
                )}
              </p>
            </div>
          </motion.div>

          {/* Freeze Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  disabled={streak.freeze_available === 0 || streak.freeze_used_today}
                  onClick={onFreezeUse}
                >
                  <Snowflake size={14} />
                  <span>{streak.freeze_available}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Gel de série disponible: {streak.freeze_available}</p>
                <p className="text-xs text-muted-foreground">
                  Protégez votre série si vous manquez un jour
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Progress to next reward */}
        {nextReward && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Prochaine récompense</span>
              <span className="font-medium">
                Jour {nextReward.day} (+{nextReward.xp_bonus} XP)
              </span>
            </div>
            <Progress value={progressToNext} className="h-2" />
            <p className="text-xs text-muted-foreground text-center">
              {daysToNextReward} jour{daysToNextReward > 1 ? 's' : ''} restant{daysToNextReward > 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Weekly calendar preview */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Calendar size={14} className="text-muted-foreground" />
          <div className="flex gap-1">
            {Array.from({ length: 7 }, (_, i) => {
              const isToday = i === new Date().getDay();
              const isPast = i < new Date().getDay();
              const isCompleted = isPast && i < streak.current_streak % 7;
              
              return (
                <div
                  key={i}
                  className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                    isToday && 'ring-2 ring-primary',
                    isCompleted && 'bg-primary text-primary-foreground',
                    !isCompleted && !isToday && 'bg-muted text-muted-foreground'
                  )}
                >
                  {['D', 'L', 'M', 'M', 'J', 'V', 'S'][i]}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default StreakTracker;
