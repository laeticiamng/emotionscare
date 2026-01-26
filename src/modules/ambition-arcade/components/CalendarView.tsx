/**
 * Vue calendrier des quêtes Ambition Arcade
 */
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, ChevronLeft, ChevronRight, CheckCircle, Zap, Target 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, addMonths, subMonths, isToday,
  startOfWeek, endOfWeek
} from 'date-fns';
import { fr } from 'date-fns/locale';

interface QuestActivity {
  date: Date;
  count: number;
  xp: number;
  quests: Array<{
    id: string;
    title: string;
    xp: number;
    completedAt: Date;
  }>;
}

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const CalendarView: React.FC = () => {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: activityData, isLoading } = useQuery({
    queryKey: ['ambition-calendar', user?.id, format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get runs for user
      const { data: runs } = await supabase
        .from('ambition_runs')
        .select('id')
        .eq('user_id', user.id);

      const runIds = runs?.map(r => r.id) || [];
      if (runIds.length === 0) return [];

      // Get completed quests for the month
      const monthStart = startOfMonth(currentMonth).toISOString();
      const monthEnd = endOfMonth(currentMonth).toISOString();

      const { data: quests, error } = await supabase
        .from('ambition_quests')
        .select('id, title, xp_reward, completed_at')
        .in('run_id', runIds)
        .eq('status', 'completed')
        .gte('completed_at', monthStart)
        .lte('completed_at', monthEnd)
        .order('completed_at', { ascending: true });

      if (error) throw error;

      return quests || [];
    },
    enabled: !!user?.id,
  });

  // Process data into calendar format
  const activityMap = useMemo(() => {
    const map = new Map<string, QuestActivity>();
    
    activityData?.forEach(quest => {
      if (!quest.completed_at) return;
      const date = new Date(quest.completed_at);
      const key = format(date, 'yyyy-MM-dd');
      
      const existing = map.get(key) || {
        date,
        count: 0,
        xp: 0,
        quests: []
      };
      
      existing.count++;
      existing.xp += quest.xp_reward || 0;
      existing.quests.push({
        id: quest.id,
        title: quest.title,
        xp: quest.xp_reward || 0,
        completedAt: date
      });
      
      map.set(key, existing);
    });
    
    return map;
  }, [activityData]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const selectedActivity = selectedDate 
    ? activityMap.get(format(selectedDate, 'yyyy-MM-dd'))
    : null;

  // Monthly stats
  const monthStats = useMemo(() => {
    let totalQuests = 0;
    let totalXP = 0;
    let activeDays = 0;
    
    activityMap.forEach(activity => {
      if (isSameMonth(activity.date, currentMonth)) {
        totalQuests += activity.count;
        totalXP += activity.xp;
        activeDays++;
      }
    });
    
    return { totalQuests, totalXP, activeDays };
  }, [activityMap, currentMonth]);

  const getActivityLevel = (count: number): string => {
    if (count === 0) return 'bg-muted/50';
    if (count === 1) return 'bg-primary/30';
    if (count <= 3) return 'bg-primary/50';
    if (count <= 5) return 'bg-primary/70';
    return 'bg-primary';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Calendrier d'activité
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>

        {/* Monthly stats */}
        <div className="flex gap-4 pt-2 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>{monthStats.totalQuests} quêtes</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-warning" />
            <span>{monthStats.totalXP} XP</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-primary" />
            <span>{monthStats.activeDays} jours actifs</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Weekday headers */}
          {WEEKDAYS.map(day => (
            <div 
              key={day} 
              className="text-center text-xs text-muted-foreground font-medium py-2"
            >
              {day}
            </div>
          ))}

          {/* Days */}
          {calendarDays.map((day, _index) => {
            const key = format(day, 'yyyy-MM-dd');
            const activity = activityMap.get(key);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isTodayDate = isToday(day);

            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(isSelected ? null : day)}
                className={`
                  aspect-square rounded-md flex flex-col items-center justify-center
                  text-sm transition-all relative
                  ${isCurrentMonth ? '' : 'opacity-30'}
                  ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                  ${isTodayDate ? 'font-bold' : ''}
                  ${activity ? getActivityLevel(activity.count) : 'bg-muted/30 hover:bg-muted/50'}
                `}
                aria-label={`${format(day, 'd MMMM', { locale: fr })}, ${activity?.count || 0} quêtes`}
              >
                <span className={activity && activity.count > 0 ? 'text-primary-foreground' : ''}>
                  {format(day, 'd')}
                </span>
                {activity && activity.count > 0 && (
                  <span className="text-[10px] text-primary-foreground/80">
                    {activity.count}
                  </span>
                )}
                {isTodayDate && (
                  <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-primary" />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span>Moins</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted/50" />
            <div className="w-3 h-3 rounded-sm bg-primary/30" />
            <div className="w-3 h-3 rounded-sm bg-primary/50" />
            <div className="w-3 h-3 rounded-sm bg-primary/70" />
            <div className="w-3 h-3 rounded-sm bg-primary" />
          </div>
          <span>Plus</span>
        </div>

        {/* Selected date details */}
        {selectedActivity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t pt-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {format(selectedDate!, 'd MMMM yyyy', { locale: fr })}
              </h4>
              <div className="flex gap-2">
                <Badge variant="secondary" className="gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {selectedActivity.count}
                </Badge>
                <Badge variant="outline" className="gap-1">
                  <Zap className="w-3 h-3 text-warning" />
                  {selectedActivity.xp} XP
                </Badge>
              </div>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedActivity.quests.map(quest => (
                <div 
                  key={quest.id}
                  className="flex items-center justify-between text-sm p-2 rounded bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span className="truncate">{quest.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    +{quest.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarView;
