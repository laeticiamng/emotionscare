// @ts-nocheck
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import type { MoodHistoryEntry, MoodTrend } from '../hooks/useMoodHistory';

interface MoodTimelineProps {
  history: MoodHistoryEntry[];
  trends: MoodTrend[];
  limit?: number;
}

const DIMENSION_LABELS: Record<string, string> = {
  energy: 'Énergie',
  calm: 'Calme',
  joy: 'Joie',
  focus: 'Focus',
  comfort: 'Réconfort',
  serenity: 'Sérénité',
};

const DIMENSION_COLORS: Record<string, string> = {
  energy: 'bg-orange-500',
  calm: 'bg-blue-500',
  joy: 'bg-yellow-500',
  focus: 'bg-purple-500',
  comfort: 'bg-pink-500',
  serenity: 'bg-green-500',
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (hours < 1) return 'Il y a moins d\'une heure';
  if (hours < 24) return `Il y a ${hours}h`;
  if (days === 1) return 'Hier';
  if (days < 7) return `Il y a ${days} jours`;
  
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

export const MoodTimeline: React.FC<MoodTimelineProps> = ({ history, trends, limit = 10 }) => {
  const displayedHistory = useMemo(() => history.slice(0, limit), [history, limit]);

  const getTrendIcon = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 5) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (diff < -5) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  if (displayedHistory.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-10 text-center">
          <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Pas encore d'historique</p>
          <p className="text-sm text-muted-foreground mt-1">
            Commencez une session pour voir votre évolution
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Timeline des sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

          <div className="space-y-4">
            {displayedHistory.map((entry, index) => {
              const prevEntry = displayedHistory[index + 1];
              
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative pl-10"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-primary border-2 border-background" />

                  <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-sm">
                          {entry.presetUsed || 'Mix personnalisé'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(entry.createdAt)} · {formatDuration(entry.duration)}
                        </p>
                      </div>
                      {entry.satisfaction && (
                        <Badge variant={entry.satisfaction >= 4 ? 'default' : entry.satisfaction >= 3 ? 'secondary' : 'outline'}>
                          {entry.satisfaction}/5
                        </Badge>
                      )}
                    </div>

                    {/* Mood dimensions */}
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(entry.moodSnapshot).slice(0, 6).map(([key, value]) => {
                        const prevValue = prevEntry?.moodSnapshot?.[key as keyof typeof prevEntry.moodSnapshot] || value;
                        
                        return (
                          <div key={key} className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${DIMENSION_COLORS[key] || 'bg-gray-500'}`} />
                            <span className="text-xs text-muted-foreground truncate">
                              {DIMENSION_LABELS[key] || key}
                            </span>
                            <span className="text-xs font-medium">{value}%</span>
                            {getTrendIcon(value as number, prevValue as number)}
                          </div>
                        );
                      })}
                    </div>

                    {entry.notes && (
                      <p className="text-xs text-muted-foreground italic border-l-2 border-primary/30 pl-2">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {history.length > limit && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            +{history.length - limit} autres sessions
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MoodTimeline;
