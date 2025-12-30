/**
 * Calendrier des sessions de groupe
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { fr } from 'date-fns/locale';
import type { GroupSession } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GroupSessionCalendarProps {
  sessions: GroupSession[];
  onSelectSession: (session: GroupSession) => void;
  onSelectDate?: (date: Date) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  wellbeing: 'bg-pink-500',
  meditation: 'bg-purple-500',
  breathing: 'bg-cyan-500',
  discussion: 'bg-blue-500',
  creative: 'bg-amber-500',
  movement: 'bg-green-500',
  support: 'bg-indigo-500',
  workshop: 'bg-red-500'
};

export const GroupSessionCalendar: React.FC<GroupSessionCalendarProps> = ({
  sessions,
  onSelectSession,
  onSelectDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, GroupSession[]>();
    sessions.forEach(session => {
      const dateKey = format(new Date(session.scheduled_at), 'yyyy-MM-dd');
      const existing = map.get(dateKey) || [];
      map.set(dateKey, [...existing, session]);
    });
    return map;
  }, [sessions]);

  const selectedDateSessions = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, 'yyyy-MM-dd');
    return sessionsByDate.get(dateKey) || [];
  }, [selectedDate, sessionsByDate]);

  const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    onSelectDate?.(day);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const daySessions = sessionsByDate.get(dateKey) || [];
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <button
                  key={i}
                  onClick={() => handleDayClick(day)}
                  className={cn(
                    "relative aspect-square p-1 rounded-lg transition-all",
                    "hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50",
                    !isCurrentMonth && "text-muted-foreground/50",
                    isToday(day) && "ring-1 ring-primary",
                    isSelected && "bg-primary/10"
                  )}
                >
                  <span className={cn(
                    "text-sm font-medium",
                    isToday(day) && "text-primary font-bold"
                  )}>
                    {format(day, 'd')}
                  </span>

                  {/* Session indicators */}
                  {daySessions.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {daySessions.slice(0, 3).map((session, j) => (
                        <span
                          key={j}
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            CATEGORY_COLORS[session.category] || 'bg-primary'
                          )}
                        />
                      ))}
                      {daySessions.length > 3 && (
                        <span className="text-[8px] text-muted-foreground">
                          +{daySessions.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Sessions */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            {selectedDate 
              ? format(selectedDate, 'EEEE d MMMM', { locale: fr })
              : 'Sélectionnez une date'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            {selectedDateSessions.length > 0 ? (
              <motion.div
                key="sessions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {selectedDateSessions.map(session => (
                  <motion.button
                    key={session.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full p-3 rounded-lg border hover:bg-muted/50 text-left transition-colors"
                    onClick={() => onSelectSession(session)}
                  >
                    <div className="flex items-start gap-2">
                      <span className={cn(
                        "h-2 w-2 rounded-full mt-1.5 shrink-0",
                        CATEGORY_COLORS[session.category] || 'bg-primary'
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{session.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(session.scheduled_at), 'HH:mm', { locale: fr })} · {session.duration_minutes} min
                        </p>
                      </div>
                      {session.status === 'live' && (
                        <Badge className="bg-green-500 text-xs">Live</Badge>
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-muted-foreground"
              >
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {selectedDate 
                    ? 'Aucune session prévue' 
                    : 'Sélectionnez une date pour voir les sessions'
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupSessionCalendar;
