/**
 * Affichage du streak quotidien Ambition Arcade avec données réelles
 * Inclut badges de milestone et récompenses visuelles
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy, Star, Zap, Target, Crown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { startOfWeek, eachDayOfInterval, isSameDay, subDays } from 'date-fns';

interface DailyStreakProps {
  compact?: boolean;
}

const STREAK_MILESTONES = [
  { days: 3, name: 'Débutant', icon: '🌱', reward: 50 },
  { days: 7, name: 'Régulier', icon: '🔥', reward: 100 },
  { days: 14, name: 'Constant', icon: '⚡', reward: 200 },
  { days: 30, name: 'Dévoué', icon: '🌟', reward: 500 },
  { days: 60, name: 'Champion', icon: '💎', reward: 1000 },
  { days: 100, name: 'Légende', icon: '👑', reward: 2500 },
];

const DAYS_OF_WEEK = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export const DailyStreak: React.FC<DailyStreakProps> = ({ compact = false }) => {
  const { user } = useAuth();

  // Fetch real activity data for streak calculation
  const { data: activityData, isLoading } = useQuery({
    queryKey: ['ambition-streak-activity', user?.id],
    queryFn: async () => {
      if (!user?.id) return { weekDates: [], allDates: [] };

      // Get runs for current user
      const { data: runs } = await supabase
        .from('ambition_runs')
        .select('id')
        .eq('user_id', user.id);

      const runIds = runs?.map(r => r.id) || [];
      if (runIds.length === 0) return { weekDates: [], allDates: [] };

      // Get start of week (Monday)
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      const threeMonthsAgo = subDays(new Date(), 90);
      
      // Get completed quests for streak calculation
      const { data: quests } = await supabase
        .from('ambition_quests')
        .select('completed_at')
        .in('run_id', runIds)
        .eq('status', 'completed')
        .gte('completed_at', threeMonthsAgo.toISOString())
        .order('completed_at', { ascending: false });

      const allDates = quests?.filter(q => q.completed_at).map(q => new Date(q.completed_at!)) || [];
      const weekDates = allDates.filter(d => d >= weekStart);

      return { weekDates, allDates };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 2, // 2 min cache
  });

  // Calculate stats
  const { currentStreak, longestStreak, activeDays, unlockedMilestones } = useMemo(() => {
    if (!activityData || activityData.allDates.length === 0) {
      return { currentStreak: 0, longestStreak: 0, activeDays: new Set<number>(), unlockedMilestones: [] };
    }

    // Get unique activity dates
    const uniqueDates = Array.from(new Set(
      activityData.allDates.map(d => d.toDateString())
    )).map(str => new Date(str)).sort((a, b) => b.getTime() - a.getTime());

    // Calculate current streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i <= 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);
      
      const hasActivity = uniqueDates.some(d => {
        const actDate = new Date(d);
        actDate.setHours(0, 0, 0, 0);
        return actDate.getTime() === checkDate.getTime();
      });
      
      if (hasActivity) {
        streak++;
      } else if (i === 0) {
        // Today has no activity yet, check yesterday
        continue;
      } else {
        break;
      }
    }

    // Calculate longest streak
    let maxStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    uniqueDates.sort((a, b) => a.getTime() - b.getTime()).forEach(date => {
      if (lastDate) {
        const diffDays = Math.round((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          maxStreak = Math.max(maxStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      lastDate = date;
    });
    maxStreak = Math.max(maxStreak, tempStreak);

    // Week visualization
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: new Date() });
    const activeDaysSet = new Set<number>();
    
    weekDays.forEach((day, index) => {
      if (activityData.weekDates.some(actDate => isSameDay(actDate, day))) {
        activeDaysSet.add(index);
      }
    });

    // Unlocked milestones
    const unlocked = STREAK_MILESTONES.filter(m => maxStreak >= m.days);

    return {
      currentStreak: streak,
      longestStreak: maxStreak,
      activeDays: activeDaysSet,
      unlockedMilestones: unlocked
    };
  }, [activityData]);

  const nextMilestone = STREAK_MILESTONES.find(m => m.days > currentStreak) || STREAK_MILESTONES[STREAK_MILESTONES.length - 1];
  const progressToMilestone = Math.min((currentStreak / nextMilestone.days) * 100, 100);

  const getStreakMessage = () => {
    if (currentStreak === 0) return 'Commencez votre streak !';
    if (currentStreak === 1) return 'Premier jour !';
    const daysToNext = nextMilestone.days - currentStreak;
    if (daysToNext <= 0) return 'Incroyable régularité !';
    return `${daysToNext} jour${daysToNext > 1 ? 's' : ''} avant "${nextMilestone.name}"`;
  };

  const getFlameColor = () => {
    if (currentStreak >= 30) return 'text-orange-500';
    if (currentStreak >= 7) return 'text-amber-500';
    if (currentStreak >= 3) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4 h-32" />
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
        ? 'border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-orange-500/10' 
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
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600' 
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
              <p className="text-xs text-muted-foreground">{getStreakMessage()}</p>
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
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
            />
          </div>
        </div>

        {/* Week visualization */}
        <div className="flex justify-between gap-1">
          {DAYS_OF_WEEK.map((day, index) => {
            const isActive = activeDays.has(index);
            const isToday = index === (new Date().getDay() + 6) % 7;
            
            return (
              <motion.div
                key={`${day}-${index}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className={`flex-1 h-8 rounded flex items-center justify-center text-xs font-medium relative ${
                  isActive 
                    ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-white' 
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

export default DailyStreak;
