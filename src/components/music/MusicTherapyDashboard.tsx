import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Music, Play, Pause, Clock, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface MusicTrack {
  id: string;
  title: string;
  frequency: string;
  duration: number;
  description: string;
}

interface MusicInsights {
  totalSessions: number;
  totalDuration: number;
  averageDuration: number;
  favoriteEmotion: string;
  weeklyUsage: number;
}

export const MusicTherapyDashboard: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string>('neutral');
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [insights, setInsights] = useState<MusicInsights | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const { toast } = useToast();

  const emotions = [
    { value: 'stress', label: 'Stress', color: 'bg-destructive/20' },
    { value: 'anxiété', label: 'Anxiété', color: 'bg-warning/20' },
    { value: 'tristesse', label: 'Tristesse', color: 'bg-muted' },
    { value: 'colère', label: 'Colère', color: 'bg-destructive/30' },
    { value: 'neutral', label: 'Neutre', color: 'bg-primary/20' },
  ];

  useEffect(() => {
    loadTracks();
    loadInsights();
  }, [selectedEmotion]);

  const loadTracks = async () => {
    try {
      // Utilise adaptive-music au lieu de music-therapy inexistant
      const { data, error } = await supabase.functions.invoke('adaptive-music', {
        body: { action: 'create-playlist', emotions: [selectedEmotion], duration: 30 },
      });

      if (error) throw error;
      
      // Transformer les données au format attendu
      const formattedTracks = (data.tracks || []).map((track: any) => ({
        id: track.id,
        title: track.title,
        frequency: `${track.bpm || 60} BPM`,
        duration: track.duration,
        description: track.emotion_tags?.join(', ') || 'Musique thérapeutique'
      }));
      setTracks(formattedTracks);
    } catch (error) {
      logger.error('Erreur chargement musiques', error as Error, 'UI');
    }
  };

  const loadInsights = async () => {
    try {
      // Utilise adaptive-music stats
      const { data, error } = await supabase.functions.invoke('adaptive-music', {
        body: { action: 'generate-report', sessionId: 'current' },
      });

      if (error) throw error;
      
      setInsights({
        totalSessions: data.report?.tracksPlayed || 0,
        totalDuration: data.report?.duration || 0,
        averageDuration: data.report?.duration || 0,
        favoriteEmotion: selectedEmotion,
        weeklyUsage: data.report?.tracksPlayed || 0
      });
    } catch (error) {
      logger.error('Erreur chargement insights', error as Error, 'UI');
    }
  };

  const handlePlay = (trackId: string) => {
    if (playingTrack === trackId) {
      if (sessionStartTime) {
        logSession(trackId, Date.now() - sessionStartTime);
      }
      setPlayingTrack(null);
      setSessionStartTime(null);
    } else {
      setPlayingTrack(trackId);
      setSessionStartTime(Date.now());
      toast({
        title: '🎵 Lecture en cours',
        description: 'Profitez de votre session de musique thérapeutique',
      });
    }
  };

  const logSession = async (trackId: string, duration: number) => {
    try {
      // Log session dans Supabase directement
      await supabase.from('music_listening_sessions').insert({
        track_id: trackId,
        duration_seconds: Math.round(duration / 1000),
        emotion_before: selectedEmotion
      });
      loadInsights();
    } catch (error) {
      logger.error('Erreur log session', error as Error, 'UI');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Music className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Musique Thérapeutique</h1>
          <p className="text-muted-foreground">Sons binauraux et musique adaptée à vos émotions</p>
        </div>
      </div>

      {/* Insights */}
      {insights && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.totalSessions}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Durée Totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.totalDuration} min</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Cette Semaine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{insights.weeklyUsage}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Émotion Principale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{insights.favoriteEmotion || '-'}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sélection d'émotion */}
      <Card>
        <CardHeader>
          <CardTitle>Comment vous sentez-vous ?</CardTitle>
          <CardDescription>Sélectionnez votre état émotionnel actuel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {emotions.map((emotion) => (
              <Button
                key={emotion.value}
                variant={selectedEmotion === emotion.value ? 'default' : 'outline'}
                onClick={() => setSelectedEmotion(emotion.value)}
                className="capitalize"
              >
                {emotion.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Liste des pistes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tracks.map((track) => (
          <Card key={track.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{track.title}</CardTitle>
                  <CardDescription>{track.description}</CardDescription>
                </div>
                <Badge variant="secondary">{track.frequency}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(track.duration)}</span>
              </div>

              {playingTrack === track.id && (
                <div className="space-y-2">
                  <Progress value={33} className="h-2" />
                  <p className="text-xs text-muted-foreground">En cours de lecture...</p>
                </div>
              )}

              <Button
                onClick={() => handlePlay(track.id)}
                className="w-full"
                variant={playingTrack === track.id ? 'secondary' : 'default'}
              >
                {playingTrack === track.id ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Écouter
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info thérapeutique */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            Bienfaits de la musique thérapeutique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Réduction du stress et de l'anxiété grâce aux fréquences binaurales</li>
            <li>• Amélioration de la qualité du sommeil</li>
            <li>• Régulation émotionnelle et relaxation profonde</li>
            <li>• Augmentation de la concentration et de la clarté mentale</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTherapyDashboard;
