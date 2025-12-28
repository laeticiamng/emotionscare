import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Square, Zap, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EmotionSnapshot {
  emotion: string;
  valence: number;
  arousal: number;
  timestamp: Date;
  source: string;
}

const EMOTION_EMOJI: Record<string, string> = {
  happy: '😊',
  joy: '😄',
  calm: '😌',
  serene: '🧘',
  focused: '🎯',
  excited: '🤩',
  neutral: '😐',
  sad: '😢',
  anxious: '😰',
  stressed: '😤',
  angry: '😠',
  fear: '😨',
  surprise: '😲',
  disgust: '🤢',
};

const RealTimeEmotionStream: React.FC = () => {
  const { user } = useAuth();
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionSnapshot | null>(null);
  const [emotionHistory, setEmotionHistory] = useState<EmotionSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger l'historique récent au démarrage
  useEffect(() => {
    if (user) {
      loadRecentHistory();
    }
  }, [user]);

  const loadRecentHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error: fetchError } = await supabase
        .from('clinical_signals')
        .select('valence, arousal, created_at, source_instrument, metadata')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (fetchError) throw fetchError;

      if (data && data.length > 0) {
        const history = data.map(signal => ({
          emotion: (signal.metadata as any)?.summary || getEmotionFromValenceArousal(signal.valence, signal.arousal),
          valence: signal.valence,
          arousal: signal.arousal,
          timestamp: new Date(signal.created_at),
          source: signal.source_instrument || 'unknown'
        }));
        
        setEmotionHistory(history);
        setCurrentEmotion(history[0] || null);
      }
    } catch (err) {
      console.error('Failed to load emotion history:', err);
    }
  };

  // Déterminer l'émotion à partir de valence/arousal
  const getEmotionFromValenceArousal = (valence: number, arousal: number): string => {
    if (valence >= 60 && arousal >= 60) return 'excited';
    if (valence >= 60 && arousal < 40) return 'calm';
    if (valence >= 60) return 'happy';
    if (valence < 40 && arousal >= 60) return 'anxious';
    if (valence < 40 && arousal < 40) return 'sad';
    if (valence < 40) return 'stressed';
    return 'neutral';
  };

  // Écouter les nouveaux signaux en temps réel
  useEffect(() => {
    if (!isStreaming || !user) return;

    const channel = supabase
      .channel('emotion-stream')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'clinical_signals',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newSignal = payload.new as any;
          const snapshot: EmotionSnapshot = {
            emotion: newSignal.metadata?.summary || getEmotionFromValenceArousal(newSignal.valence, newSignal.arousal),
            valence: newSignal.valence,
            arousal: newSignal.arousal,
            timestamp: new Date(newSignal.created_at),
            source: newSignal.source_instrument || 'realtime'
          };
          
          setCurrentEmotion(snapshot);
          setEmotionHistory(prev => [snapshot, ...prev.slice(0, 19)]);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setError(null);
        } else if (status === 'CHANNEL_ERROR') {
          setError('Erreur de connexion au stream');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isStreaming, user]);

  const toggleStream = useCallback(() => {
    if (!user) {
      setError('Veuillez vous connecter pour utiliser le stream');
      return;
    }
    setIsStreaming(prev => !prev);
    setError(null);
  }, [user]);

  const getEmoji = (emotion: string): string => {
    return EMOTION_EMOJI[emotion.toLowerCase()] || '😐';
  };

  const getTimeDiff = (timestamp: Date): string => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h`;
  };

  const getSourceBadge = (source: string) => {
    const sources: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
      scan_camera: { label: 'Caméra', variant: 'default' },
      scan_sliders: { label: 'Curseurs', variant: 'secondary' },
      scan_voice: { label: 'Voix', variant: 'outline' },
      scan_text: { label: 'Texte', variant: 'outline' },
    };
    return sources[source] || { label: source, variant: 'outline' as const };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Stream Temps Réel
            {isStreaming && (
              <Badge variant="default" className="ml-2 animate-pulse">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-ping" />
                Live
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
            
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mx-auto flex items-center justify-center text-5xl border-4 border-primary/30 transition-all duration-300">
              {isLoading ? (
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              ) : (
                getEmoji(currentEmotion?.emotion || 'neutral')
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-bold capitalize">
                {currentEmotion?.emotion || 'En attente...'}
              </h3>
              {currentEmotion && (
                <div className="flex items-center justify-center gap-2 mt-2">
                  <Badge variant="outline">
                    Valence: {Math.round(currentEmotion.valence)}%
                  </Badge>
                  <Badge variant="outline">
                    Arousal: {Math.round(currentEmotion.arousal)}%
                  </Badge>
                </div>
              )}
            </div>
            
            <Button 
              onClick={toggleStream}
              className="w-full"
              variant={isStreaming ? "destructive" : "default"}
              disabled={isLoading}
            >
              {isStreaming ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  Arrêter le Stream
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Démarrer le Stream
                </>
              )}
            </Button>
            
            <p className="text-xs text-muted-foreground">
              {isStreaming 
                ? "Écoute des nouveaux scans en temps réel..."
                : "Appuyez pour écouter vos scans en temps réel"
              }
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Historique du Stream
            <Badge variant="secondary" className="ml-auto">
              {emotionHistory.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {emotionHistory.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Zap className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucun scan récent</p>
              <p className="text-sm">Effectuez un scan pour voir l'historique</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {emotionHistory.map((snapshot, index) => {
                const sourceBadge = getSourceBadge(snapshot.source);
                return (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getEmoji(snapshot.emotion)}</span>
                      <div>
                        <span className="capitalize font-medium text-sm">{snapshot.emotion}</span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Badge variant={sourceBadge.variant} className="text-xs h-5">
                            {sourceBadge.label}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-muted-foreground">
                        -{getTimeDiff(snapshot.timestamp)}
                      </span>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        V:{Math.round(snapshot.valence)} A:{Math.round(snapshot.arousal)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeEmotionStream;
