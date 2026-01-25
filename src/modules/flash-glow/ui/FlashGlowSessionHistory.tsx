/**
 * FlashGlowSessionHistory - Historique des sessions Flash Glow
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, Clock, TrendingUp, TrendingDown, 
  Minus, ChevronRight, Calendar, Sparkles 
} from 'lucide-react';
import { flashGlowService } from '../flash-glowService';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SessionEntry {
  id?: string;
  date: string;
  duration_s: number;
  label: 'gain' | 'léger' | 'incertain';
  glow_type?: string;
  score?: number;
  mood_delta?: number | null;
}

const labelConfig = {
  'gain': { label: 'Gain ressenti', color: 'bg-green-500/10 text-green-600', icon: TrendingUp },
  'léger': { label: 'Effet léger', color: 'bg-blue-500/10 text-blue-600', icon: Sparkles },
  'incertain': { label: 'Incertain', color: 'bg-gray-500/10 text-gray-600', icon: Minus },
};

const glowTypeEmoji: Record<string, string> = {
  'energy': '⚡',
  'calm': '🌊',
  'creativity': '🎨',
  'confidence': '💪',
  'love': '💖',
};

export const FlashGlowSessionHistory: React.FC = () => {
  const [sessions, setSessions] = useState<SessionEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const stats = await flashGlowService.getStats();
      setSessions(stats.recent_sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs}s`;
    if (secs === 0) return `${mins}min`;
    return `${mins}min ${secs}s`;
  };

  const displayedSessions = showAll ? sessions : sessions.slice(0, 5);
  const groupedByDate = displayedSessions.reduce((acc, session) => {
    const date = format(new Date(session.date), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {} as Record<string, SessionEntry[]>);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-16" />
          </Card>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Aucune session</h3>
          <p className="text-muted-foreground">
            Commencez votre première session Flash Glow pour voir votre historique ici.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Historique des sessions</h2>
        </div>
        <Badge variant="secondary">
          {sessions.length} session{sessions.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <ScrollArea className={showAll ? 'h-[500px]' : 'h-auto'}>
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, daySessions]) => (
            <div key={date}>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {format(new Date(date), 'EEEE d MMMM', { locale: fr })}
                </span>
                <Badge variant="outline" className="text-xs">
                  {daySessions.length} session{daySessions.length > 1 ? 's' : ''}
                </Badge>
              </div>

              <div className="space-y-2">
                {daySessions.map((session, index) => {
                  const config = labelConfig[session.label] || labelConfig['incertain'];
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={session.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="hover:bg-muted/50 transition-colors">
                        <CardContent className="flex items-center gap-4 py-3">
                          {/* Glow type indicator */}
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-lg">
                            {glowTypeEmoji[session.glow_type || 'energy'] || '✨'}
                          </div>

                          {/* Session info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {formatDuration(session.duration_s)}
                              </span>
                              <Badge className={config.color} variant="secondary">
                                <Icon className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(session.date), 'HH:mm', { locale: fr })}
                              {' • '}
                              {formatDistanceToNow(new Date(session.date), { 
                                addSuffix: true, 
                                locale: fr 
                              })}
                            </p>
                          </div>

                          {/* Score & mood delta */}
                          <div className="text-right">
                            {session.score && (
                              <div className="font-bold text-primary">
                                +{session.score} pts
                              </div>
                            )}
                            {typeof session.mood_delta === 'number' && (
                              <div className={`text-xs flex items-center gap-1 justify-end ${
                                session.mood_delta > 0 ? 'text-green-600' : 
                                session.mood_delta < 0 ? 'text-orange-600' : 'text-muted-foreground'
                              }`}>
                                {session.mood_delta > 0 ? <TrendingUp className="h-3 w-3" /> : 
                                 session.mood_delta < 0 ? <TrendingDown className="h-3 w-3" /> : 
                                 <Minus className="h-3 w-3" />}
                                {session.mood_delta > 0 ? '+' : ''}{session.mood_delta}
                              </div>
                            )}
                          </div>

                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {sessions.length > 5 && (
        <Button 
          variant="outline" 
          className="w-full"
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Voir moins' : `Voir tout (${sessions.length} sessions)`}
        </Button>
      )}
    </motion.div>
  );
};

export default FlashGlowSessionHistory;
