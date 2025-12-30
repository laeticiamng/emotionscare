/**
 * History Panel - Historique des sessions
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { 
  History, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ThumbsUp,
  Meh,
  ThumbsDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { SilkSession } from './types';

interface HistoryPanelProps {
  sessions: SilkSession[];
}

const LABEL_ICONS = {
  gain: { icon: ThumbsUp, color: 'text-emerald-500' },
  léger: { icon: Meh, color: 'text-amber-500' },
  incertain: { icon: ThumbsDown, color: 'text-slate-500' }
};

export const HistoryPanel = memo(function HistoryPanel({ sessions }: HistoryPanelProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  // Trier par date décroissante
  const sortedSessions = [...sessions].reverse();

  if (sessions.length === 0) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucune session enregistrée</p>
            <p className="text-sm mt-1">Commencez votre première pause visuelle !</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Historique ({sessions.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <div className="p-4 space-y-2">
            {sortedSessions.map((session, index) => {
              const labelInfo = session.label ? LABEL_ICONS[session.label] : null;
              const LabelIcon = labelInfo?.icon;
              
              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg',
                    'bg-muted/30 hover:bg-muted/50 transition-colors'
                  )}
                >
                  {/* Status icon */}
                  {session.interrupted ? (
                    <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  )}
                  
                  {/* Pattern icon */}
                  <span className="text-xl">{session.pattern.icon}</span>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {session.pattern.name}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {formatDuration(session.pattern.duration)}
                      <span>•</span>
                      {formatDate(session.startedAt)}
                    </div>
                  </div>
                  
                  {/* Label */}
                  {LabelIcon && (
                    <LabelIcon className={cn('w-4 h-4 flex-shrink-0', labelInfo?.color)} />
                  )}
                  
                  {/* Blink count */}
                  <div className="text-xs text-muted-foreground flex-shrink-0">
                    {session.blinkCount} 👁️
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

export default HistoryPanel;
