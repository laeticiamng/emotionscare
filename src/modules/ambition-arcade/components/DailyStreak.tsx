/**
 * Affichage du streak quotidien Ambition Arcade avec données réelles
 */
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { startOfWeek, eachDayOfInterval, isSameDay, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DailyStreakProps {
  compact?: boolean;
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];
const DAYS_OF_WEEK = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

export const DailyStreak: React.FC<DailyStreakProps> = ({ compact = false }) => {
  const { user } = useAuth();

  // Fetch real activity data for current week
  const { data: weekActivity } = useQuery({
    queryKey: ['ambition-week-activity', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get runs for current user
      const { data: runs } = await supabase
        .from('ambition_runs')
        .select('id')
        .eq('user_id', user.id);

      const runIds = runs?.map(r => r.id) || [];
      if (runIds.length === 0) return [];

      // Get start of week (Monday)
      const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
      
      // Get completed quests from this week
      const { data: quests } = await supabase
        .from('ambition_quests')
        .select('completed_at')
        .in('run_id', runIds)
        .eq('status', 'completed')
        .gte('completed_at', weekStart.toISOString());

      return quests?.map(q => new Date(q.completed_at!)) || [];
    },
    enabled: !!user?.id,
  });

  // Calculate stats
  const { currentStreak, longestStreak, activeDays } = useMemo(() => {
    if (!weekActivity || weekActivity.length === 0) {
      return { currentStreak: 0, longestStreak: 0, activeDays: new Set<number>() };
    }

    // Get unique days with activity this week
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: new Date()
    });

    const activeDaysSet = new Set<number>();
    weekDays.forEach((day, index) => {
      if (weekActivity.some(actDate => isSameDay(actDate, day))) {
        activeDaysSet.add(index);
      }
    });

    // Calculate streak from today backwards
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasActivity = weekActivity.some(actDate => isSameDay(actDate, checkDate));
      
      if (hasActivity) {
        streak++;
      } else if (i === 0) {
        // Today has no activity, but yesterday might
        continue;
      } else {
        break;
      }
    }

    return {
      currentStreak: streak,
      longestStreak: Math.max(streak, activeDaysSet.size),
      activeDays: activeDaysSet
    };
  }, [weekActivity]);

  const nextMilestone = STREAK_MILESTONES.find(m => m > currentStreak) || 100;
  const progressToMilestone = (currentStreak / nextMilestone) * 100;

  const getStreakMessage = () => {
    if (currentStreak === 0) return 'Commencez votre streak !';
    if (currentStreak === 1) return 'Premier jour !';
    if (currentStreak < 7) return `${7 - currentStreak} jours avant une semaine !`;
    if (currentStreak < 30) return `${30 - currentStreak} jours avant un mois !`;
    return 'Incroyable régularité !';
  };

  const getFlameColor = () => {
    if (currentStreak >= 30) return 'text-orange-500';
    if (currentStreak >= 7) return 'text-amber-500';
    if (currentStreak >= 3) return 'text-yellow-500';
    return 'text-muted-foreground';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          animate={currentStreak > 0 ? {
            scale: [1, 1.1, 1],
          } : {}}
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
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
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
              <Flame className={`w-6 h-6 ${
                currentStreak >= 7 ? 'text-white' : getFlameColor()
              }`} />
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
            <span>Prochain objectif: {nextMilestone} jours</span>
            <span>{Math.round(progressToMilestone)}%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressToMilestone}%` }}
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full"
            />
          </div>
        </div>

        {/* Week visualization with real data */}
        <div className="flex justify-between mt-4 gap-1">
          {DAYS_OF_WEEK.map((day, index) => {
            const isActive = activeDays.has(index);
            const isToday = index === (new Date().getDay() + 6) % 7; // Adjust for Monday start
            
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
      </CardContent>
    </Card>
  );
};

export default DailyStreak;
