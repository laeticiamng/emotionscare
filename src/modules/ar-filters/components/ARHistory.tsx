/**
 * Historique des sessions AR
 */

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Clock, Camera, Image, ThumbsUp, ThumbsDown, Minus, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { ARFilterSession } from '../types';

interface ARHistoryProps {
  sessions: ARFilterSession[];
}

const FILTER_NAMES: Record<string, string> = {
  joy: 'Joie',
  calm: 'Calme',
  energy: 'Énergie',
  serenity: 'Sérénité',
  creativity: 'Créativité',
  confidence: 'Confiance',
  playful: 'Ludique',
  focused: 'Focus',
};

const FILTER_EMOJIS: Record<string, string> = {
  joy: '😊',
  calm: '😌',
  energy: '⚡',
  serenity: '🧘',
  creativity: '🎨',
  confidence: '💪',
  playful: '🎉',
  focused: '🎯',
};

const formatDuration = (seconds: number): string => {
  if (!seconds) return '—';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};

const getMoodIcon = (mood?: string) => {
  switch (mood) {
    case 'positive':
      return <ThumbsUp className="w-4 h-4 text-green-500" />;
    case 'negative':
      return <ThumbsDown className="w-4 h-4 text-red-500" />;
    case 'neutral':
      return <Minus className="w-4 h-4 text-gray-500" />;
    default:
      return null;
  }
};

export const ARHistory = memo<ARHistoryProps>(({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucune session enregistrée</p>
            <p className="text-sm mt-1">Vos sessions AR apparaîtront ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <History className="w-5 h-5" />
          Historique des sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {sessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 bg-muted/50 rounded-lg border border-border/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">
                      {FILTER_EMOJIS[session.filter_type] || '🎭'}
                    </span>
                    <div>
                      <p className="font-medium">
                        {FILTER_NAMES[session.filter_type] || session.filter_type}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(session.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </p>
                    </div>
                  </div>
                  {getMoodIcon(session.mood_impact)}
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(session.duration_seconds)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Image className="w-4 h-4" />
                    <span>{session.photos_taken} photos</span>
                  </div>
                  {session.completed_at && (
                    <Badge variant="outline" className="text-xs">
                      Terminée
                    </Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
});

ARHistory.displayName = 'ARHistory';

export default ARHistory;