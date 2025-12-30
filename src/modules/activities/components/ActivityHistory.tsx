/**
 * Historique des sessions d'activités avec calendrier
 */

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  Clock, 
  Star, 
  Heart,
  Zap,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { ActivitySessionService, ActivitySession } from '../services/activitySessionService';
import { useAuth } from '@/contexts/AuthContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';

export function ActivityHistory() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (!user) return;

    const loadSessions = async () => {
      try {
        const data = await ActivitySessionService.getSessions(user.id, 100);
        setSessions(data);
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSessions();
  }, [user]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getSessionsForDay = (day: Date) => {
    return sessions.filter(s => isSameDay(new Date(s.started_at), day));
  };

  const getDayIntensity = (day: Date): string => {
    const count = getSessionsForDay(day).length;
    if (count === 0) return 'bg-muted/30';
    if (count === 1) return 'bg-green-500/30';
    if (count === 2) return 'bg-green-500/50';
    return 'bg-green-500/80';
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '-';
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const categoryLabels: Record<string, string> = {
    relaxation: 'Relaxation',
    physical: 'Physique',
    creative: 'Créative',
    social: 'Sociale',
    mindfulness: 'Pleine conscience',
    nature: 'Nature'
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentSessions = sessions.slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Calendar View */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Calendrier d'activités
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
              <div key={i} className="text-center text-xs text-muted-foreground font-medium py-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month start */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {days.map(day => {
              const daySessions = getSessionsForDay(day);
              const isToday = isSameDay(day, new Date());
              
              return (
                <div
                  key={day.toISOString()}
                  className={`aspect-square rounded-md flex items-center justify-center text-xs relative ${getDayIntensity(day)} ${
                    isToday ? 'ring-2 ring-primary' : ''
                  }`}
                  title={daySessions.length > 0 ? `${daySessions.length} activité(s)` : undefined}
                >
                  <span className={daySessions.length > 0 ? 'font-semibold' : 'text-muted-foreground'}>
                    {format(day, 'd')}
                  </span>
                  {daySessions.length > 0 && (
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {daySessions.slice(0, 3).map((_, i) => (
                        <div key={i} className="w-1 h-1 rounded-full bg-green-600" />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-muted/30" />
              <span>0</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500/30" />
              <span>1</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500/50" />
              <span>2</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500/80" />
              <span>3+</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Sessions récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentSessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune session enregistrée
            </div>
          ) : (
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-3">
                {recentSessions.map(session => {
                  const activity = session.activities;
                  const moodChange = session.mood_after && session.mood_before 
                    ? session.mood_after - session.mood_before 
                    : null;

                  return (
                    <div
                      key={session.id}
                      className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">
                            {activity?.title || 'Activité'}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(session.started_at), 'EEEE d MMMM à HH:mm', { locale: fr })}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {session.rating && (
                            <div className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-xs">{session.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-xs">
                        {activity?.category && (
                          <Badge variant="outline" className="text-[10px]">
                            {categoryLabels[activity.category]}
                          </Badge>
                        )}
                        
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDuration(session.duration_seconds)}
                        </span>

                        {moodChange !== null && (
                          <span className={`flex items-center gap-1 ${
                            moodChange > 0 ? 'text-green-600' : moodChange < 0 ? 'text-red-500' : 'text-muted-foreground'
                          }`}>
                            <Heart className="h-3 w-3" />
                            {moodChange > 0 ? '+' : ''}{moodChange}
                          </span>
                        )}

                        {session.xp_earned > 0 && (
                          <span className="flex items-center gap-1 text-primary">
                            <Zap className="h-3 w-3" />
                            +{session.xp_earned} XP
                          </span>
                        )}
                      </div>

                      {session.notes && (
                        <p className="mt-2 text-xs text-muted-foreground italic line-clamp-2">
                          "{session.notes}"
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
