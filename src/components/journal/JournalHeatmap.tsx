import { memo, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity } from 'lucide-react';
import type { SanitizedNote } from '@/modules/journal/types';
import { parseISO, startOfYear, endOfYear, eachDayOfInterval, isSameDay, format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface JournalHeatmapProps {
  notes: SanitizedNote[];
  year?: number;
  className?: string;
}

interface DayData {
  date: Date;
  count: number;
  notes: SanitizedNote[];
}

/**
 * Composant de heatmap pour visualiser l'activité d'écriture
 * Style GitHub contributions
 */
export const JournalHeatmap = memo<JournalHeatmapProps>(({
  notes,
  year = new Date().getFullYear(),
  className = '',
}) => {
  const heatmapData = useMemo<DayData[]>(() => {
    const yearStart = startOfYear(new Date(year, 0, 1));
    const yearEnd = endOfYear(new Date(year, 11, 31));
    const days = eachDayOfInterval({ start: yearStart, end: yearEnd });

    return days.map(date => {
      const dayNotes = notes.filter(note =>
        isSameDay(parseISO(note.created_at), date)
      );

      return {
        date,
        count: dayNotes.length,
        notes: dayNotes,
      };
    });
  }, [notes, year]);

  const stats = useMemo(() => {
    const total = heatmapData.reduce((sum, day) => sum + day.count, 0);
    const daysWithActivity = heatmapData.filter(day => day.count > 0).length;
    const maxCount = Math.max(...heatmapData.map(day => day.count), 0);
    const avgCount = daysWithActivity > 0 ? total / daysWithActivity : 0;

    return { total, daysWithActivity, maxCount, avgCount };
  }, [heatmapData]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-muted';
    if (count === 1) return 'bg-primary/20';
    if (count === 2) return 'bg-primary/40';
    if (count <= 3) return 'bg-primary/60';
    return 'bg-primary/80';
  };

  const getIntensityLabel = (count: number) => {
    if (count === 0) return 'Aucune note';
    if (count === 1) return '1 note';
    return `${count} notes`;
  };

  // Organiser les jours par semaine
  const weeks = useMemo(() => {
    const result: DayData[][] = [];
    let currentWeek: DayData[] = [];

    heatmapData.forEach((day, index) => {
      const dayOfWeek = day.date.getDay();

      // Commencer une nouvelle semaine le lundi (jour 1)
      if (index === 0) {
        // Ajouter des cases vides au début si nécessaire
        for (let i = 0; i < dayOfWeek; i++) {
          currentWeek.push({ date: new Date(0), count: -1, notes: [] });
        }
      }

      currentWeek.push(day);

      // Fin de semaine (dimanche = 0)
      if (dayOfWeek === 0 || index === heatmapData.length - 1) {
        // Ajouter des cases vides à la fin si nécessaire
        while (currentWeek.length < 7) {
          currentWeek.push({ date: new Date(0), count: -1, notes: [] });
        }
        result.push(currentWeek);
        currentWeek = [];
      }
    });

    return result;
  }, [heatmapData]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" aria-hidden="true" />
              Activité {year}
            </CardTitle>
            <CardDescription>
              Visualisez votre constance d'écriture
            </CardDescription>
          </div>
          <Badge variant="secondary">
            {stats.daysWithActivity} jours actifs
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">Notes totales</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.maxCount}</div>
            <div className="text-xs text-muted-foreground">Record journalier</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.avgCount.toFixed(1)}</div>
            <div className="text-xs text-muted-foreground">Moyenne/jour actif</div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            {/* Labels des jours */}
            <div className="flex gap-1 mb-1">
              <div className="w-8" />
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
                <div
                  key={index}
                  className="text-xs text-muted-foreground w-3 text-center"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Grille */}
            <div className="flex flex-col gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex gap-1">
                  {/* Numéro de semaine */}
                  <div className="w-8 text-xs text-muted-foreground flex items-center">
                    {weekIndex % 4 === 0 && `S${weekIndex + 1}`}
                  </div>

                  {/* Jours */}
                  {week.map((day, dayIndex) => {
                    if (day.count === -1) {
                      return <div key={dayIndex} className="w-3 h-3" />;
                    }

                    return (
                      <div
                        key={dayIndex}
                        className={`w-3 h-3 rounded-sm ${getIntensityClass(day.count)} hover:ring-2 hover:ring-ring transition-all cursor-pointer`}
                        title={`${format(day.date, 'dd MMMM yyyy', { locale: fr })} - ${getIntensityLabel(day.count)}`}
                        role="button"
                        tabIndex={0}
                        aria-label={`${format(day.date, 'dd MMMM yyyy', { locale: fr })}, ${getIntensityLabel(day.count)}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Légende */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">Moins</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getIntensityClass(level)}`}
                aria-hidden="true"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Plus</span>
        </div>
      </CardContent>
    </Card>
  );
});

JournalHeatmap.displayName = 'JournalHeatmap';
