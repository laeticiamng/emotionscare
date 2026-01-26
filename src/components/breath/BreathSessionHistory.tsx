import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, Wind, TrendingUp, TrendingDown, Minus, 
  ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBreathSessions, type BreathSession } from '@/hooks/useBreathSessions';
import { motion, AnimatePresence } from 'framer-motion';

interface BreathSessionHistoryProps {
  limit?: number;
  className?: string;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return mins > 0 ? `${mins}min ${secs}s` : `${secs}s`;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) return `Il y a ${diffDays} jours`;

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
};

const getMoodIcon = (before: number | undefined, after: number | undefined) => {
  if (before == null || after == null) return null;
  const delta = after - before;
  if (delta > 0) return <TrendingUp className="h-3 w-3 text-success" />;
  if (delta < 0) return <TrendingDown className="h-3 w-3 text-destructive" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const SessionItem: React.FC<{ session: BreathSession; isFirst: boolean }> = ({ session, isFirst }) => {
  const [expanded, setExpanded] = useState(false);
  const moodDelta = session.mood_before != null && session.mood_after != null 
    ? session.mood_after - session.mood_before 
    : null;

  return (
    <motion.div
      initial={isFirst ? { opacity: 0, y: -10 } : false}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-border/30 last:border-0"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
            <Wind className="h-5 w-5 text-primary" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground text-sm">
                {session.pattern || 'Session'}
              </span>
              {session.vr_mode && (
                <Badge variant="outline" className="text-xs py-0">VR</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(session.created_at)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {formatDuration(session.duration_seconds || 0)}
              </span>
            </div>
            {moodDelta !== null && (
              <div className="flex items-center gap-1 justify-end mt-0.5">
                {getMoodIcon(session.mood_before, session.mood_after)}
                <span className={cn(
                  'text-xs',
                  moodDelta > 0 ? 'text-success' : moodDelta < 0 ? 'text-destructive' : 'text-muted-foreground'
                )}>
                  {moodDelta > 0 ? '+' : ''}{moodDelta}
                </span>
              </div>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {session.cycles_completed != null && (
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground text-xs">Cycles</span>
                    <div className="font-medium text-foreground">{session.cycles_completed}</div>
                  </div>
                )}
                {session.average_pace != null && (
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground text-xs">Cadence moy.</span>
                    <div className="font-medium text-foreground">{session.average_pace.toFixed(1)}</div>
                  </div>
                )}
                {session.mood_before != null && (
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground text-xs">Humeur avant</span>
                    <div className="font-medium text-foreground">{session.mood_before}/10</div>
                  </div>
                )}
                {session.mood_after != null && (
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground text-xs">Humeur après</span>
                    <div className="font-medium text-foreground">{session.mood_after}/10</div>
                  </div>
                )}
              </div>
              {session.notes && (
                <div className="p-2 rounded bg-muted/30 text-sm">
                  <span className="text-muted-foreground text-xs block mb-1">Notes</span>
                  <p className="text-foreground">{session.notes}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const BreathSessionHistory: React.FC<BreathSessionHistoryProps> = ({ 
  limit = 10,
  className 
}) => {
  const { sessions, loading } = useBreathSessions();
  const [showAll, setShowAll] = useState(false);

  const displayedSessions = showAll ? sessions : sessions.slice(0, limit);
  const hasMore = sessions.length > limit;

  if (loading) {
    return (
      <Card className={cn('border-border/50 bg-card/40', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Historique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className={cn('border-border/50 bg-card/40', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Historique</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Wind className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Aucune session pour le moment</p>
            <p className="text-sm">Tes sessions apparaîtront ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-border/50 bg-card/40', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Historique</CardTitle>
          <Badge variant="outline" className="text-xs">
            {sessions.length} session{sessions.length > 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[400px]">
          {displayedSessions.map((session, idx) => (
            <SessionItem key={session.id} session={session} isFirst={idx === 0} />
          ))}
        </ScrollArea>

        {hasMore && (
          <div className="p-3 border-t border-border/30">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? 'Voir moins' : `Voir ${sessions.length - limit} sessions de plus`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BreathSessionHistory;
