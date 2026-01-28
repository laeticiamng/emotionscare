/**
 * EmotionalCalendarHeatmap - Calendrier avec heatmap émotionnelle
 * Visualisation des tendances émotionnelles sur le mois
 */

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DayData {
  date: Date;
  score: number | null; // 0-100
  entries: number;
  dominantEmotion?: string;
}

interface EmotionalCalendarHeatmapProps {
  data: DayData[];
  month?: Date;
  onMonthChange?: (month: Date) => void;
  onDayClick?: (date: Date) => void;
  isLoading?: boolean;
}

const getScoreColor = (score: number | null): string => {
  if (score === null) return 'bg-muted/30';
  if (score >= 80) return 'bg-emerald-500/80 text-white';
  if (score >= 60) return 'bg-emerald-400/60 text-white';
  if (score >= 40) return 'bg-amber-400/60 text-amber-950';
  if (score >= 20) return 'bg-orange-400/60 text-orange-950';
  return 'bg-red-400/60 text-white';
};

const getScoreLabel = (score: number | null): string => {
  if (score === null) return 'Pas de données';
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Bon';
  if (score >= 40) return 'Moyen';
  if (score >= 20) return 'Difficile';
  return 'Critique';
};

const WEEKDAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export const EmotionalCalendarHeatmap: React.FC<EmotionalCalendarHeatmapProps> = ({
  data,
  month = new Date(),
  onMonthChange,
  onDayClick,
  isLoading = false
}) => {
  const [currentMonth, setCurrentMonth] = React.useState(month);

  const calendarDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    // Ajouter les jours de la semaine précédente pour commencer un lundi
    const firstDayOfWeek = start.getDay();
    const daysToAdd = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const paddingDays: Date[] = [];
    for (let i = daysToAdd; i > 0; i--) {
      paddingDays.push(new Date(start.getTime() - i * 24 * 60 * 60 * 1000));
    }

    return [...paddingDays, ...days];
  }, [currentMonth]);

  const dayDataMap = useMemo(() => {
    const map = new Map<string, DayData>();
    data.forEach(d => {
      map.set(format(d.date, 'yyyy-MM-dd'), d);
    });
    return map;
  }, [data]);

  const monthStats = useMemo(() => {
    const monthData = data.filter(d => 
      d.date.getMonth() === currentMonth.getMonth() &&
      d.date.getFullYear() === currentMonth.getFullYear() &&
      d.score !== null
    );
    
    if (monthData.length === 0) {
      return { avg: null, trend: 'stable' as const, entries: 0 };
    }

    const avg = Math.round(
      monthData.reduce((sum, d) => sum + (d.score || 0), 0) / monthData.length
    );
    
    const entries = monthData.reduce((sum, d) => sum + d.entries, 0);
    
    // Calculer la tendance (première moitié vs seconde moitié)
    const mid = Math.floor(monthData.length / 2);
    const firstHalf = monthData.slice(0, mid);
    const secondHalf = monthData.slice(mid);
    
    const avgFirst = firstHalf.length > 0 
      ? firstHalf.reduce((s, d) => s + (d.score || 0), 0) / firstHalf.length 
      : 0;
    const avgSecond = secondHalf.length > 0 
      ? secondHalf.reduce((s, d) => s + (d.score || 0), 0) / secondHalf.length 
      : 0;
    
    const diff = avgSecond - avgFirst;
    const trend = diff > 5 ? 'up' : diff < -5 ? 'down' : 'stable';

    return { avg, trend, entries };
  }, [data, currentMonth]);

  const handlePrevMonth = () => {
    const newMonth = subMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = addMonths(currentMonth, 1);
    setCurrentMonth(newMonth);
    onMonthChange?.(newMonth);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Calendrier Émotionnel
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              aria-label="Mois précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-32 text-center">
              {format(currentMonth, 'MMMM yyyy', { locale: fr })}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              aria-label="Mois suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Stats du mois */}
        <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Score moyen:</span>
            {monthStats.avg !== null ? (
              <Badge className={getScoreColor(monthStats.avg)}>
                {monthStats.avg}%
              </Badge>
            ) : (
              <span className="text-sm text-muted-foreground">-</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Tendance:</span>
            {monthStats.trend === 'up' && (
              <Badge variant="outline" className="text-primary border-primary/50">
                <TrendingUp className="h-3 w-3 mr-1" />
                En hausse
              </Badge>
            )}
            {monthStats.trend === 'down' && (
              <Badge variant="outline" className="text-destructive border-destructive/50">
                <TrendingDown className="h-3 w-3 mr-1" />
                En baisse
              </Badge>
            )}
            {monthStats.trend === 'stable' && (
              <Badge variant="outline" className="text-muted-foreground">
                <Minus className="h-3 w-3 mr-1" />
                Stable
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Entrées:</span>
            <span className="text-sm font-medium">{monthStats.entries}</span>
          </div>
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1">
          {/* Jours de la semaine */}
          {WEEKDAYS.map(day => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}

          {/* Jours du mois */}
          <TooltipProvider>
            {calendarDays.map((day, idx) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayData = dayDataMap.get(dateKey);
              const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
              const isToday = isSameDay(day, new Date());

              return (
                <Tooltip key={idx}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => onDayClick?.(day)}
                      disabled={!isCurrentMonth || isLoading}
                      className={cn(
                        'aspect-square rounded-md flex flex-col items-center justify-center text-sm transition-all',
                        isCurrentMonth ? 'cursor-pointer hover:ring-2 hover:ring-primary/50' : 'opacity-30 cursor-default',
                        isToday && 'ring-2 ring-primary',
                        dayData?.score !== null && isCurrentMonth
                          ? getScoreColor(dayData?.score || null)
                          : 'bg-muted/20',
                        isLoading && 'animate-pulse'
                      )}
                      aria-label={`${format(day, 'd MMMM', { locale: fr })}: ${getScoreLabel(dayData?.score || null)}`}
                    >
                      <span className={cn(
                        'font-medium',
                        !isCurrentMonth && 'text-muted-foreground'
                      )}>
                        {format(day, 'd')}
                      </span>
                      {dayData?.entries && dayData.entries > 0 && (
                        <span className="text-[10px] opacity-80">
                          {dayData.entries}
                        </span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {isCurrentMonth && (
                    <TooltipContent>
                      <div className="text-center">
                        <p className="font-medium">
                          {format(day, 'd MMMM yyyy', { locale: fr })}
                        </p>
                        {dayData ? (
                          <>
                            <p className="text-sm">
                              Score: {dayData.score !== null ? `${dayData.score}%` : 'N/A'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {dayData.entries} entrée(s)
                            </p>
                            {dayData.dominantEmotion && (
                              <p className="text-xs mt-1">
                                Émotion: {dayData.dominantEmotion}
                              </p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Pas de données
                          </p>
                        )}
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        {/* Légende */}
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
          <span className="text-xs text-muted-foreground">Moins bien</span>
          <div className="flex gap-1">
            {[0, 25, 50, 75, 100].map(score => (
              <div
                key={score}
                className={cn(
                  'w-4 h-4 rounded',
                  getScoreColor(score)
                )}
                title={`${score}%`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">Mieux</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionalCalendarHeatmap;
