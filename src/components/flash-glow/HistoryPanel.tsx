/**
 * HistoryPanel - Historique des sessions Flash Glow
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, History, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { FlashGlowSession } from './types';

interface HistoryPanelProps {
  sessions: FlashGlowSession[];
  maxItems?: number;
}

const getLabelConfig = (label: string) => {
  switch (label) {
    case 'gain':
      return { color: 'bg-green-500/20 text-green-700 dark:text-green-400', emoji: '✨', text: 'Gain' };
    case 'léger':
      return { color: 'bg-blue-500/20 text-blue-700 dark:text-blue-400', emoji: '🌟', text: 'Léger' };
    default:
      return { color: 'bg-gray-500/20 text-gray-700 dark:text-gray-400', emoji: '🤔', text: 'Incertain' };
  }
};

const getMoodDeltaIcon = (delta: number | null | undefined) => {
  if (delta === null || delta === undefined) return null;
  if (delta > 0) return <TrendingUp className="h-3 w-3 text-green-500" />;
  if (delta < 0) return <TrendingDown className="h-3 w-3 text-orange-500" />;
  return <Minus className="h-3 w-3 text-muted-foreground" />;
};

const HistoryPanel: React.FC<HistoryPanelProps> = ({ sessions, maxItems = 10 }) => {
  const displayedSessions = sessions.slice(0, maxItems);

  if (displayedSessions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <div className="text-4xl mb-2">✨</div>
            <p className="text-sm">Aucune session pour le moment</p>
            <p className="text-xs mt-1">Lancez votre première session Flash Glow !</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <History className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          Historique récent
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px]">
          <div className="divide-y">
            {displayedSessions.map((session, index) => {
              const labelConfig = getLabelConfig(session.label);
              const timeAgo = formatDistanceToNow(new Date(session.date), { 
                addSuffix: true, 
                locale: fr 
              });

              return (
                <div
                  key={session.id || index}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{labelConfig.emoji}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={labelConfig.color}>
                          {labelConfig.text}
                        </Badge>
                        {session.mood_delta !== undefined && session.mood_delta !== null && (
                          <span className="flex items-center gap-1 text-xs">
                            {getMoodDeltaIcon(session.mood_delta)}
                            <span className={session.mood_delta > 0 ? 'text-green-500' : session.mood_delta < 0 ? 'text-orange-500' : 'text-muted-foreground'}>
                              {session.mood_delta > 0 ? '+' : ''}{session.mood_delta}
                            </span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        <span>{session.duration_s}s</span>
                        <span>•</span>
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-lg">{session.score}</div>
                    <div className="text-xs text-muted-foreground">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default HistoryPanel;
