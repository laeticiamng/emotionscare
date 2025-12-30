import React from 'react';
import { motion } from 'framer-motion';
import { History, Clock, Star, TrendingUp, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface GalaxySessionHistory {
  id: string;
  date: string;
  durationMinutes: number;
  galaxyTheme: string;
  constellationsUnlocked: number;
  coherenceScore: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
}

interface GalaxySessionHistoryPanelProps {
  sessions: GalaxySessionHistory[];
  onSessionSelect?: (session: GalaxySessionHistory) => void;
  className?: string;
}

const QUALITY_STYLES = {
  excellent: 'bg-green-500/10 text-green-600 border-green-500/30',
  good: 'bg-blue-500/10 text-blue-600 border-blue-500/30',
  fair: 'bg-amber-500/10 text-amber-600 border-amber-500/30',
  poor: 'bg-red-500/10 text-red-600 border-red-500/30',
};

const QUALITY_LABELS = {
  excellent: 'Excellent',
  good: 'Bon',
  fair: 'Correct',
  poor: 'À améliorer',
};

export const GalaxySessionHistoryPanel: React.FC<GalaxySessionHistoryPanelProps> = ({
  sessions,
  onSessionSelect,
  className
}) => {
  // Grouper les sessions par date
  const groupedSessions = React.useMemo(() => {
    const groups: Record<string, GalaxySessionHistory[]> = {};
    
    sessions.forEach((session) => {
      const dateKey = format(new Date(session.date), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(session);
    });

    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [sessions]);

  return (
    <Card className={cn('bg-card/80 backdrop-blur-sm border-border/50', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Historique des sessions
          </CardTitle>
          <Badge variant="secondary">{sessions.length} sessions</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {groupedSessions.length > 0 ? (
            <div className="space-y-6">
              {groupedSessions.map(([dateKey, daySessions]) => (
                <div key={dateKey} className="space-y-2">
                  {/* Header de date */}
                  <div className="sticky top-0 bg-card/95 backdrop-blur-sm py-1 z-10">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {format(new Date(dateKey), 'EEEE d MMMM', { locale: fr })}
                    </span>
                  </div>

                  {/* Sessions du jour */}
                  <div className="space-y-2">
                    {daySessions.map((session, index) => (
                      <motion.button
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSessionSelect?.(session)}
                        className={cn(
                          'w-full text-left p-3 rounded-lg border transition-all',
                          'hover:bg-muted/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                          'bg-muted/30 border-border/50'
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0 space-y-1">
                            {/* Heure et thème */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {format(new Date(session.date), 'HH:mm')}
                              </span>
                              <span className="text-xs text-muted-foreground">•</span>
                              <span className="text-xs text-muted-foreground capitalize">
                                {session.galaxyTheme}
                              </span>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {session.durationMinutes} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {session.constellationsUnlocked} const.
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {session.coherenceScore}%
                              </span>
                            </div>

                            {/* Notes */}
                            {session.notes && (
                              <p className="text-xs text-muted-foreground/70 line-clamp-1 italic">
                                "{session.notes}"
                              </p>
                            )}
                          </div>

                          {/* Badge qualité */}
                          <Badge
                            variant="outline"
                            className={cn('text-[10px] shrink-0', QUALITY_STYLES[session.quality])}
                          >
                            {QUALITY_LABELS[session.quality]}
                          </Badge>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <History className="h-10 w-10 mb-3 opacity-50" />
              <p className="text-sm font-medium">Aucune session enregistrée</p>
              <p className="text-xs">Lancez votre première exploration !</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
