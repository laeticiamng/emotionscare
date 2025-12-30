/**
 * Calendrier SEUIL - Visualisation mensuelle des événements
 */
import React, { memo, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  getDay,
  isToday
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { useSeuilEvents } from '../hooks';
import type { SeuilZone } from '../types';

const ZONE_COLORS: Record<SeuilZone, string> = {
  low: 'bg-emerald-500',
  intermediate: 'bg-amber-500',
  critical: 'bg-rose-500',
  closure: 'bg-indigo-500',
};

const ZONE_LABELS: Record<SeuilZone, string> = {
  low: 'Basse',
  intermediate: 'Intermédiaire',
  critical: 'Critique',
  closure: 'Clôture',
};

interface SeuilCalendarProps {
  onSelectDate?: (date: Date) => void;
}

export const SeuilCalendar: React.FC<SeuilCalendarProps> = memo(({ onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { data: events } = useSeuilEvents();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Padding pour aligner avec les jours de la semaine (Lundi = 0)
  const startDayOfWeek = (getDay(monthStart) + 6) % 7;
  const paddingDays = Array(startDayOfWeek).fill(null);

  // Grouper les événements par jour
  const eventsByDay = useMemo(() => {
    if (!events) return {};
    
    const grouped: Record<string, { count: number; avgLevel: number; zones: SeuilZone[] }> = {};
    
    events.forEach(event => {
      const dateKey = format(new Date(event.createdAt), 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = { count: 0, avgLevel: 0, zones: [] };
      }
      grouped[dateKey].count++;
      grouped[dateKey].avgLevel = 
        (grouped[dateKey].avgLevel * (grouped[dateKey].count - 1) + event.thresholdLevel) / grouped[dateKey].count;
      if (!grouped[dateKey].zones.includes(event.zone)) {
        grouped[dateKey].zones.push(event.zone);
      }
    });
    
    return grouped;
  }, [events]);

  const selectedDayEvents = useMemo(() => {
    if (!selectedDate || !events) return [];
    return events.filter(e => 
      isSameDay(new Date(e.createdAt), selectedDate)
    );
  }, [selectedDate, events]);

  const handlePrevMonth = () => setCurrentMonth(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentMonth(prev => addMonths(prev, 1));

  const handleSelectDay = (day: Date) => {
    setSelectedDate(day);
    onSelectDate?.(day);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Calendrier
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-medium min-w-[120px] text-center capitalize">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="text-center text-xs text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding */}
          {paddingDays.map((_, idx) => (
            <div key={`pad-${idx}`} className="aspect-square" />
          ))}

          {/* Jours du mois */}
          {daysInMonth.map(day => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayData = eventsByDay[dateKey];
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const hasEvents = dayData && dayData.count > 0;

            return (
              <motion.button
                key={dateKey}
                onClick={() => handleSelectDay(day)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5
                  text-sm transition-colors relative
                  ${isToday(day) ? 'ring-2 ring-primary' : ''}
                  ${isSelected ? 'bg-primary text-primary-foreground' : 
                    hasEvents ? 'bg-muted/50 hover:bg-muted' : 'hover:bg-muted/30'}
                `}
              >
                <span className={isSelected ? 'font-semibold' : ''}>
                  {format(day, 'd')}
                </span>
                
                {/* Indicateurs de zones */}
                {hasEvents && (
                  <div className="flex gap-0.5">
                    {dayData.zones.slice(0, 3).map((zone, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${ZONE_COLORS[zone]}`}
                      />
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Détail du jour sélectionné */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t"
          >
            <h4 className="text-sm font-medium mb-2 capitalize">
              {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
            </h4>
            
            {selectedDayEvents.length > 0 ? (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {selectedDayEvents.map(event => (
                  <div 
                    key={event.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${ZONE_COLORS[event.zone]}`} />
                      <Badge variant="secondary" className="text-xs">
                        {ZONE_LABELS[event.zone]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {event.thresholdLevel}%
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(event.createdAt), 'HH:mm')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-2">
                Aucun signal ce jour
              </p>
            )}
          </motion.div>
        )}

        {/* Légende */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t justify-center">
          {(Object.entries(ZONE_COLORS) as [SeuilZone, string][]).map(([zone, color]) => (
            <div key={zone} className="flex items-center gap-1 text-xs">
              <div className={`w-2 h-2 rounded-full ${color}`} />
              <span className="text-muted-foreground">{ZONE_LABELS[zone]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

SeuilCalendar.displayName = 'SeuilCalendar';

export default SeuilCalendar;
