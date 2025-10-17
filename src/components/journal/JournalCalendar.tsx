import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { SanitizedNote } from '@/modules/journal/types';

interface JournalCalendarProps {
  notes: SanitizedNote[];
  onDateSelect?: (date: Date, notes: SanitizedNote[]) => void;
}

/**
 * Calendrier de visualisation des entrées de journal
 * Affiche un aperçu mensuel avec indicateurs d'activité
 */
export function JournalCalendar({ notes, onDateSelect }: JournalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calculer les jours du mois avec les notes
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Grouper les notes par jour
    const notesByDate = new Map<string, SanitizedNote[]>();
    notes.forEach(note => {
      const noteDate = new Date(note.created_at);
      if (noteDate.getFullYear() === year && noteDate.getMonth() === month) {
        const key = noteDate.getDate().toString();
        if (!notesByDate.has(key)) {
          notesByDate.set(key, []);
        }
        notesByDate.get(key)!.push(note);
      }
    });

    return { daysInMonth, startDayOfWeek, notesByDate };
  }, [currentDate, notes]);

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    const dayNotes = calendarData.notesByDate.get(day.toString()) || [];
    onDateSelect?.(date, dayNotes);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const getNoteCount = (day: number) => {
    return calendarData.notesByDate.get(day.toString())?.length || 0;
  };

  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const weekDays = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // Statistiques du mois
  const monthStats = useMemo(() => {
    const totalNotes = Array.from(calendarData.notesByDate.values()).reduce(
      (sum, notes) => sum + notes.length,
      0
    );
    const daysWithNotes = calendarData.notesByDate.size;
    return { totalNotes, daysWithNotes };
  }, [calendarData]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Calendrier de journaling
            </CardTitle>
            <CardDescription>
              {monthStats.totalNotes} notes sur {monthStats.daysWithNotes} jours ce mois
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={goToToday}>
            Aujourd'hui
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth} aria-label="Mois précédent">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
          <Button variant="ghost" size="icon" onClick={goToNextMonth} aria-label="Mois suivant">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-2">
          {/* Jours vides avant le début du mois */}
          {Array.from({ length: calendarData.startDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Jours du mois */}
          {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
            const day = i + 1;
            const noteCount = getNoteCount(day);
            const hasNotes = noteCount > 0;

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={cn(
                  'aspect-square rounded-lg border-2 transition-all',
                  'flex flex-col items-center justify-center',
                  'hover:border-primary hover:bg-primary/5',
                  isToday(day) && 'border-primary bg-primary/10 font-semibold',
                  isSelected(day) && 'bg-primary text-primary-foreground border-primary',
                  !hasNotes && !isToday(day) && !isSelected(day) && 'border-transparent',
                  hasNotes && 'border-muted-foreground/20'
                )}
                aria-label={`${day} ${monthName}, ${noteCount} note(s)`}
              >
                <span className="text-sm">{day}</span>
                {hasNotes && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      'h-5 min-w-5 px-1 text-xs mt-1',
                      isSelected(day) && 'bg-primary-foreground/20 text-primary-foreground'
                    )}
                  >
                    {noteCount}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Légende */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-primary bg-primary/10" />
            Aujourd'hui
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded border-2 border-muted-foreground/20" />
            Avec notes
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary" />
            Sélectionné
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
