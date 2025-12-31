/**
 * NyveeSessionHistory - Historique des sessions Nyvee
 */

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  History, 
  ChevronDown, 
  ChevronUp, 
  Heart, 
  Zap, 
  Sparkles,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNyveeSessions, type NyveeSessionRecord } from '@/modules/nyvee/hooks/useNyveeSessions';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SessionItemProps {
  session: NyveeSessionRecord;
  isExpanded: boolean;
  onToggle: () => void;
}

const getBadgeIcon = (badge: string) => {
  switch (badge) {
    case 'calm': return <Heart className="h-4 w-4 text-emerald-500" />;
    case 'partial': return <Sparkles className="h-4 w-4 text-purple-500" />;
    case 'tense': return <Zap className="h-4 w-4 text-orange-500" />;
    default: return <Sparkles className="h-4 w-4 text-primary" />;
  }
};

const getMoodTrend = (delta: number | null) => {
  if (delta === null) return <Minus className="h-4 w-4 text-muted-foreground" />;
  if (delta > 5) return <TrendingUp className="h-4 w-4 text-emerald-500" />;
  if (delta < -5) return <TrendingDown className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const SessionItem = memo(({ session, isExpanded, onToggle }: SessionItemProps) => {
  const formattedDate = format(new Date(session.created_at), 'dd MMM yyyy', { locale: fr });
  const relativeTime = formatDistanceToNow(new Date(session.created_at), { addSuffix: true, locale: fr });
  const durationMinutes = Math.floor(session.session_duration / 60);
  const durationSeconds = session.session_duration % 60;

  return (
    <motion.div
      layout
      className={cn(
        'border border-border/30 rounded-lg overflow-hidden transition-colors',
        isExpanded ? 'bg-muted/20' : 'bg-card/40 hover:bg-muted/10'
      )}
    >
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          {getBadgeIcon(session.badge_earned)}
          <div>
            <p className="text-sm font-medium text-foreground">
              Session {session.intensity === 'calm' ? 'calme' : session.intensity === 'moderate' ? 'modérée' : 'intense'}
            </p>
            <p className="text-xs text-muted-foreground">{relativeTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {getMoodTrend(session.mood_delta)}
          <span className="text-sm text-muted-foreground">
            {session.cycles_completed}/{session.target_cycles} cycles
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1 border-t border-border/20">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Date:</span>
                  <span className="ml-2 text-foreground">{formattedDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Durée:</span>
                  <span className="ml-2 text-foreground">
                    {durationMinutes > 0 ? `${durationMinutes}m ` : ''}{durationSeconds}s
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Humeur avant:</span>
                  <span className="ml-2 text-foreground">
                    {session.mood_before ?? '—'}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Humeur après:</span>
                  <span className="ml-2 text-foreground">
                    {session.mood_after ?? '—'}
                  </span>
                </div>
                {session.mood_delta !== null && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Évolution:</span>
                    <span className={cn(
                      'ml-2 font-medium',
                      session.mood_delta > 0 ? 'text-emerald-500' : session.mood_delta < 0 ? 'text-red-500' : 'text-muted-foreground'
                    )}>
                      {session.mood_delta > 0 ? '+' : ''}{session.mood_delta} points
                    </span>
                  </div>
                )}
                {session.cocoon_unlocked && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Cocon débloqué:</span>
                    <span className="ml-2 text-amber-500 font-medium">
                      ✨ {session.cocoon_unlocked}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

SessionItem.displayName = 'SessionItem';

interface NyveeSessionHistoryProps {
  className?: string;
  limit?: number;
}

export const NyveeSessionHistory = memo(({ className, limit = 10 }: NyveeSessionHistoryProps) => {
  const { sessions, isLoading } = useNyveeSessions();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedSessions = showAll ? sessions : sessions.slice(0, limit);

  const handleExport = () => {
    const csvContent = [
      ['Date', 'Intensité', 'Cycles', 'Durée (s)', 'Humeur avant', 'Humeur après', 'Delta', 'Badge'].join(','),
      ...sessions.map(s => [
        format(new Date(s.created_at), 'yyyy-MM-dd HH:mm'),
        s.intensity,
        s.cycles_completed,
        s.session_duration,
        s.mood_before ?? '',
        s.mood_after ?? '',
        s.mood_delta ?? '',
        s.badge_earned,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nyvee-sessions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className={cn('border-border/50 bg-card/60 backdrop-blur-sm', className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-pulse text-muted-foreground">Chargement...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-border/50 bg-card/60 backdrop-blur-sm', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-foreground">
            <History className="h-5 w-5 text-primary" />
            Historique des sessions
          </CardTitle>
          {sessions.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              className="text-muted-foreground hover:text-foreground"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            Aucune session pour le moment. Commence ta première respiration !
          </p>
        ) : (
          <div className="space-y-2">
            {displayedSessions.map(session => (
              <SessionItem
                key={session.id}
                session={session}
                isExpanded={expandedId === session.id}
                onToggle={() => setExpandedId(expandedId === session.id ? null : session.id)}
              />
            ))}

            {sessions.length > limit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                {showAll ? 'Voir moins' : `Voir ${sessions.length - limit} sessions de plus`}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

NyveeSessionHistory.displayName = 'NyveeSessionHistory';

export default NyveeSessionHistory;
