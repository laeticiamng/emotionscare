/**
 * Widget streak de méditation
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Zap } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { meditationService } from '../meditationService';
import { startOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

interface StreakWidgetProps {
  compact?: boolean;
}

const STREAK_MILESTONES = [
  { days: 3, name: 'Débutant', icon: '🌱', reward: 25 },
  { days: 7, name: 'Régulier', icon: '🔥', reward: 50 },
  { days: 14, name: 'Pratiquant', icon: '⚡', reward: 100 },
  { days: 30, name: 'Méditant', icon: '🌟', reward: 250 },
  { days: 60, name: 'Maître', icon: '💎', reward: 500 },
  { days: 100, name: 'Sage', icon: '👑', reward: 1000 },
];

const DAYS_OF_WEEK = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export const StreakWidget: React.FC<StreakWidgetProps> = ({ compact = false }) => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['meditation-stats'],
    queryFn: () => meditationService.getStats(),
  });

  const { data: recentSessions } = useQuery({
    queryKey: ['meditation-recent-sessions'],
    queryFn: () => meditationService.getRecentSessions(30),
  });

  // Calculate week activity
  const weekActivity = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: new Date() });
    
    return weekDays.map((day, index) => {
      const hasSession = recentSessions?.some(s => 
        s.completed && s.completedAt && isSameDay(new Date(s.completedAt), day)
      );
      return {
        dayIndex: index,
        date: day,
        isActive: hasSession || false,
        isToday: isSameDay(day, new Date()),
      };
    });
  }, [recentSessions]);

  const currentStreak = stats?.currentStreak || 0;
  const longestStreak = stats?.longestStreak || 0;

  const nextMilestone = STREAK_MILESTONES.find(m => m.days > currentStreak) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const progressToMilestone = Math.min((currentStreak / nextMilestone.days) * 100, 100);

  const unlockedMilestones = STREAK_MILESTONES.filter(m => longestStreak >= m.days);

  const getFlameColor = () => {
    if (currentStreak >= 30) return 'text-orange-500';
    if (currentStreak >= 7) return 'text-amber-500';
    if (currentStreak >= 3) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4 h-24" />
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          animate={currentStreak > 0 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <Flame className={`w-5 h-5 ${getFlameColor()}`} />
        </motion.div>
        <span className="font-bold">{currentStreak}</span>
        <span className="text-xs text-muted-foreground">jours</span>
      </div>
    );
  }

  return (
    <Card className={`overflow-hidden ${
      currentStreak >= 7 
        ? 'border-primary/50 bg-gradient-to-br from-primary/10 to-purple-500/10' 
        : ''
    }`}>
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={currentStreak > 0 ? {
                scale: [1, 1.15, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`p-3 rounded-full ${
                currentStreak >= 7 
                  ? 'bg-gradient-to-br from-primary to-purple-600' 
                  : 'bg-muted'
              }`}
            >
              <Flame className={`w-6 h-6 ${currentStreak >= 7 ? 'text-white' : getFlameColor()}`} />
            </motion.div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">{currentStreak}</span>
                <span className="text-muted-foreground">jours</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {currentStreak === 0 && 'Commencez votre streak !'}
                {currentStreak === 1 && 'Premier jour !'}
                {currentStreak > 1 && nextMilestone.days - currentStreak > 0 && 
                  `${nextMilestone.days - currentStreak} jours avant "${nextMilestone.name}"`}
                {progressToMilestone >= 100 && 'Incroyable régularité !'}
              </p>
            </div>
          </div>

          {longestStreak > 0 && (
            <Badge variant="outline" className="gap-1">
              <Trophy className="w-3 h-3" />
              Record: {longestStreak}
            </Badge>
          )}
        </div>

        {/* Progress to next milestone */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span>{nextMilestone.icon}</span>
              {nextMilestone.name}: {nextMilestone.days} jours
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-warning" />
              +{nextMilestone.reward} XP
            </span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToMilestone}%` }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-purple-600 rounded-full"
            />
          </div>
        </div>

        {/* Week visualization */}
        <div className="flex justify-between gap-1">
          {DAYS_OF_WEEK.map((day, index) => {
            const activity = weekActivity.find(a => a.dayIndex === index);
            const isActive = activity?.isActive || false;
            const isToday = activity?.isToday || false;
            
            return (
              <motion.div
                key={`${day}-${index}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium relative ${
                  isActive 
                    ? 'bg-gradient-to-br from-primary to-purple-600 text-white' 
                    : 'bg-muted text-muted-foreground'
                } ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}`}
              >
                {day}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Unlocked Milestones */}
        {unlockedMilestones.length > 0 && (
          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground mb-2">Badges débloqués</p>
            <div className="flex flex-wrap gap-2">
              {unlockedMilestones.map((milestone, idx) => (
                <motion.div
                  key={milestone.days}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Badge variant="secondary" className="gap-1">
                    <span>{milestone.icon}</span>
                    {milestone.name}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StreakWidget;
