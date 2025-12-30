/**
 * Vue calendrier des sessions de méditation
 */
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, ChevronLeft, ChevronRight, CheckCircle, 
  Clock, Brain, TrendingUp
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { meditationService } from '../meditationService';
import { techniqueLables } from '../types';
import { 
  format, startOfMonth, endOfMonth, eachDayOfInterval, 
  isSameMonth, isSameDay, addMonths, subMonths, isToday,
  startOfWeek, endOfWeek
} from 'date-fns';
import { fr } from 'date-fns/locale';

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const MeditationCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['meditation-sessions-calendar'],
    queryFn: () => meditationService.getRecentSessions(100),
  });

  // Group sessions by date
  const sessionsByDate = useMemo(() => {
    const map = new Map<string, typeof sessions>();
    
    sessions?.forEach(session => {
      if (!session.completedAt) return;
      const key = format(new Date(session.completedAt), 'yyyy-MM-dd');
      const existing = map.get(key) || [];
      existing.push(session);
      map.set(key, existing);
    });
    
    return map;
  }, [sessions]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const selectedSessions = selectedDate 
    ? sessionsByDate.get(format(selectedDate, 'yyyy-MM-dd'))
    : null;

  // Monthly stats
  const monthStats = useMemo(() => {
    let totalSessions = 0;
    let totalMinutes = 0;
    let activeDays = 0;
    
    sessionsByDate.forEach((daySessions, dateKey) => {
      const date = new Date(dateKey);
      if (isSameMonth(date, currentMonth) && daySessions) {
        totalSessions += daySessions.length;
        totalMinutes += daySessions.reduce((sum, s) => sum + Math.floor((s.completedDuration || 0) / 60), 0);
        activeDays++;
      }
    });
    
    return { totalSessions, totalMinutes, activeDays };
  }, [sessionsByDate, currentMonth]);

  const getActivityLevel = (count: number): string => {
    if (count === 0) return 'bg-muted/50';
    if (count === 1) return 'bg-primary/30';
    if (count === 2) return 'bg-primary/50';
    if (count === 3) return 'bg-primary/70';
    return 'bg-primary';
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardContent className="h-72" />
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Calendrier
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
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
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>

        {/* Monthly stats */}
        <div className="flex gap-4 pt-2 text-sm">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>{monthStats.totalSessions} sessions</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-primary" />
            <span>{monthStats.totalMinutes} min</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-warning" />
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
          {calendarDays.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const daySessions = sessionsByDate.get(key) || [];
            const count = daySessions.length;
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
                  ${count > 0 ? getActivityLevel(count) : 'bg-muted/30 hover:bg-muted/50'}
                `}
              >
                <span className={count > 0 ? 'text-primary-foreground' : ''}>
                  {format(day, 'd')}
                </span>
                {count > 0 && (
                  <span className="text-[10px] text-primary-foreground/80">
                    {count}
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
        {selectedSessions && selectedSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t pt-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">
                {format(selectedDate!, 'd MMMM yyyy', { locale: fr })}
              </h4>
              <Badge variant="secondary">{selectedSessions.length} session{selectedSessions.length > 1 ? 's' : ''}</Badge>
            </div>
            
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {selectedSessions.map(session => (
                <div 
                  key={session.id}
                  className="flex items-center justify-between text-sm p-2 rounded bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <Brain className="w-3 h-3 text-primary" />
                    <span className="truncate">{techniqueLables[session.technique]}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {Math.floor((session.completedDuration || 0) / 60)} min
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

export default MeditationCalendar;
