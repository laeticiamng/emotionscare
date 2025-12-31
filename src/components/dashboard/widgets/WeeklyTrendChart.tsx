/**
 * Graphique de tendance hebdomadaire - Mini sparkline des 7 derniers jours
 */
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface DayData {
  date: string;
  dayLabel: string;
  score: number;
  hasActivity: boolean;
}

async function fetchWeeklyTrend(userId: string): Promise<DayData[]> {
  const days: DayData[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    days.push({
      date: dateStr,
      dayLabel: new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(date),
      score: 0,
      hasActivity: false
    });
  }

  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Récupérer en parallèle les différentes sources de données
  const [sessionsResult, clinicalResult] = await Promise.all([
    supabase
      .from('activity_sessions')
      .select('started_at, mood_after')
      .eq('user_id', userId)
      .gte('started_at', sevenDaysAgo.toISOString()),
    
    
    supabase
      .from('clinical_signals')
      .select('created_at, metadata, source_instrument')
      .eq('user_id', userId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: true })
  ]);

  // Traiter les sessions d'activités
  if (sessionsResult.data && sessionsResult.data.length > 0) {
    sessionsResult.data.forEach(session => {
      const sessionDate = session.started_at.split('T')[0];
      const dayIndex = days.findIndex(d => d.date === sessionDate);
      if (dayIndex !== -1) {
        days[dayIndex].hasActivity = true;
        if (session.mood_after && days[dayIndex].score === 0) {
          days[dayIndex].score = session.mood_after * 10;
        }
      }
    });
  }

  // Traiter les signaux cliniques (WHO5, SAM, etc.)
  if (clinicalResult.data && clinicalResult.data.length > 0) {
    clinicalResult.data.forEach(signal => {
      const signalDate = signal.created_at.split('T')[0];
      const dayIndex = days.findIndex(d => d.date === signalDate);
      if (dayIndex !== -1) {
        days[dayIndex].hasActivity = true;
        // Extraire le score du metadata si disponible
        const metadata = signal.metadata as Record<string, unknown> | null;
        if (metadata) {
          const rawScore = metadata.score ?? metadata.valence ?? metadata.level;
          if (typeof rawScore === 'number' && days[dayIndex].score === 0) {
            // Normaliser le score sur 100
            days[dayIndex].score = Math.min(100, Math.max(0, rawScore * 20));
          }
        }
      }
    });
  }

  return days;
}

export default function WeeklyTrendChart() {
  const { user } = useAuth();

  const { data: weekData, isLoading } = useQuery({
    queryKey: ['weekly-trend', user?.id],
    queryFn: () => fetchWeeklyTrend(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const trend = useMemo(() => {
    if (!weekData || weekData.length < 2) return 'stable';
    
    const activeDays = weekData.filter(d => d.hasActivity);
    if (activeDays.length < 2) return 'stable';
    
    const firstHalf = activeDays.slice(0, Math.ceil(activeDays.length / 2));
    const secondHalf = activeDays.slice(Math.ceil(activeDays.length / 2));
    
    const avgFirst = firstHalf.reduce((sum, d) => sum + d.score, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((sum, d) => sum + d.score, 0) / secondHalf.length;
    
    if (avgSecond > avgFirst + 5) return 'up';
    if (avgSecond < avgFirst - 5) return 'down';
    return 'stable';
  }, [weekData]);

  const maxScore = useMemo(() => {
    if (!weekData) return 100;
    return Math.max(...weekData.map(d => d.score), 100);
  }, [weekData]);

  const activeDaysCount = weekData?.filter(d => d.hasActivity).length ?? 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              Tendance de la semaine
            </CardTitle>
            <CardDescription>Votre activité des 7 derniers jours</CardDescription>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              'flex items-center gap-1',
              trend === 'up' && 'border-success/50 text-success',
              trend === 'down' && 'border-destructive/50 text-destructive',
              trend === 'stable' && 'border-muted-foreground/50'
            )}
          >
            {trend === 'up' && <TrendingUp className="h-3 w-3" aria-hidden="true" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3" aria-hidden="true" />}
            {trend === 'stable' && <Minus className="h-3 w-3" aria-hidden="true" />}
            {trend === 'up' ? 'En hausse' : trend === 'down' ? 'En baisse' : 'Stable'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <div className="flex justify-between">
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <Skeleton key={i} className="h-3 w-8" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Mini graphique en barres */}
            <div 
              className="flex items-end justify-between gap-1 h-16 mb-2" 
              role="img" 
              aria-label={`Tendance hebdomadaire: ${activeDaysCount} jours actifs sur 7`}
            >
              {weekData?.map((day, index) => (
                <div 
                  key={day.date} 
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div 
                    className={cn(
                      'w-full rounded-t transition-all duration-300',
                      day.hasActivity 
                        ? 'bg-primary' 
                        : 'bg-muted'
                    )}
                    style={{ 
                      height: day.hasActivity 
                        ? `${Math.max(20, (day.score / maxScore) * 100)}%` 
                        : '20%' 
                    }}
                    title={day.hasActivity ? `${day.dayLabel}: ${Math.round(day.score)}/100` : `${day.dayLabel}: Pas d'activité`}
                  />
                </div>
              ))}
            </div>
            
            {/* Labels des jours */}
            <div className="flex justify-between text-xs text-muted-foreground">
              {weekData?.map(day => (
                <span 
                  key={day.date} 
                  className={cn(
                    'capitalize',
                    day.hasActivity && 'text-foreground font-medium'
                  )}
                >
                  {day.dayLabel}
                </span>
              ))}
            </div>

            {/* Résumé */}
            <p className="text-xs text-muted-foreground mt-3 text-center">
              {activeDaysCount === 0 
                ? 'Commencez une activité pour voir votre progression'
                : `${activeDaysCount} jour${activeDaysCount > 1 ? 's' : ''} actif${activeDaysCount > 1 ? 's' : ''} cette semaine`
              }
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
