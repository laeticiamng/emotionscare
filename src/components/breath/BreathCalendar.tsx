import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Wind, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBreathSessions, type BreathSession } from '@/hooks/useBreathSessions';

interface BreathCalendarProps {
  className?: string;
}

interface DayData {
  date: Date;
  sessions: BreathSession[];
  totalMinutes: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const MONTHS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];

export const BreathCalendar: React.FC<BreathCalendarProps> = ({ className }) => {
  const { sessions } = useBreathSessions();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = (firstDay.getDay() + 6) % 7;

    const days: DayData[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous month days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({
        date,
        sessions: [],
        totalMinutes: 0,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);

      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.created_at);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === date.getTime();
      });

      const totalMinutes = Math.round(
        daySessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60
      );

      days.push({
        date,
        sessions: daySessions,
        totalMinutes,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
      });
    }

    // Next month days to complete the grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        sessions: [],
        totalMinutes: 0,
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return days;
  }, [currentDate, sessions]);

  const monthStats = useMemo(() => {
    const monthSessions = calendarData
      .filter(d => d.isCurrentMonth)
      .flatMap(d => d.sessions);
    
    const totalMinutes = Math.round(
      monthSessions.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60
    );
    const activeDays = calendarData.filter(d => d.isCurrentMonth && d.sessions.length > 0).length;
    const avgPerSession = monthSessions.length > 0
      ? Math.round(totalMinutes / monthSessions.length)
      : 0;

    return { totalSessions: monthSessions.length, totalMinutes, activeDays, avgPerSession };
  }, [calendarData]);

  const goToPreviousMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDay(null);
  };

  const getIntensityColor = (minutes: number) => {
    if (minutes === 0) return 'bg-muted/30';
    if (minutes < 5) return 'bg-primary/20';
    if (minutes < 15) return 'bg-primary/40';
    if (minutes < 30) return 'bg-primary/60';
    return 'bg-primary/80';
  };

  return (
    <Card className={cn('border-border/50 bg-card/40', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Calendrier</CardTitle>
          <Button variant="ghost" size="sm" onClick={goToToday}>
            Aujourd'hui
          </Button>
        </div>

        {/* Month navigation */}
        <div className="flex items-center justify-between mt-2">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-foreground">
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Month stats */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-bold text-primary">{monthStats.totalSessions}</div>
            <div className="text-xs text-muted-foreground">Séances</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-bold text-primary">{monthStats.totalMinutes}</div>
            <div className="text-xs text-muted-foreground">Minutes</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-bold text-primary">{monthStats.activeDays}</div>
            <div className="text-xs text-muted-foreground">Jours actifs</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-muted/30">
            <div className="text-lg font-bold text-primary">{monthStats.avgPerSession}</div>
            <div className="text-xs text-muted-foreground">Min/séance</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS.map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarData.map((day, idx) => (
            <button
              key={idx}
              onClick={() => day.sessions.length > 0 && setSelectedDay(day)}
              className={cn(
                'aspect-square rounded-lg flex flex-col items-center justify-center p-1 transition-all relative',
                getIntensityColor(day.totalMinutes),
                !day.isCurrentMonth && 'opacity-30',
                day.isToday && 'ring-2 ring-primary',
                day.sessions.length > 0 && 'cursor-pointer hover:ring-2 hover:ring-primary/50',
              )}
            >
              <span className={cn(
                'text-sm',
                day.isToday ? 'font-bold text-primary' : 'text-foreground'
              )}>
                {day.date.getDate()}
              </span>
              {day.sessions.length > 0 && (
                <div className="flex items-center gap-0.5 mt-0.5">
                  <Wind className="h-2.5 w-2.5 text-primary" />
                  <span className="text-[10px] text-muted-foreground">{day.sessions.length}</span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Moins</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded bg-muted/30" />
            <div className="w-3 h-3 rounded bg-primary/20" />
            <div className="w-3 h-3 rounded bg-primary/40" />
            <div className="w-3 h-3 rounded bg-primary/60" />
            <div className="w-3 h-3 rounded bg-primary/80" />
          </div>
          <span>Plus</span>
        </div>

        {/* Selected day details */}
        {selectedDay && (
          <div className="mt-4 p-3 rounded-lg bg-muted/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">
                {selectedDay.date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)}>
                ✕
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Wind className="h-4 w-4" />
                {selectedDay.sessions.length} séance{selectedDay.sessions.length > 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {selectedDay.totalMinutes} min
              </span>
            </div>
            <div className="space-y-1">
              {selectedDay.sessions.map((session, idx) => (
                <div key={session.id || idx} className="flex items-center justify-between text-sm p-2 rounded bg-background/50">
                  <span className="text-foreground">{session.pattern || 'Session'}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {Math.round((session.duration_seconds || 0) / 60)} min
                    </Badge>
                    {session.mood_before != null && session.mood_after != null && (
                      <Badge 
                        variant={session.mood_after > session.mood_before ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {session.mood_after - session.mood_before > 0 ? '+' : ''}
                        {session.mood_after - session.mood_before}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BreathCalendar;
