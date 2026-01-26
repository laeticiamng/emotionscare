import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { Music, Play, Pause, Heart, TrendingUp, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/lib/logger';

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  emotion_tags: string[];
  bpm: number;
  energy_level: number;
  url: string;
}

interface MusicStats {
  totalSessions: number;
  totalMinutes: number;
  topEmotions: { emotion: string; count: number }[];
  averageImprovement: number;
}

const EMOTIONS = [
  { value: 'calme', label: 'Calme', color: 'bg-blue-500' },
  { value: 'joie', label: 'Joie', color: 'bg-yellow-500' },
  { value: 'tristesse', label: 'Tristesse', color: 'bg-gray-500' },
  { value: 'stress', label: 'Stress', color: 'bg-red-500' },
  { value: 'colère', label: 'Colère', color: 'bg-orange-500' },
  { value: 'focus', label: 'Focus', color: 'bg-purple-500' },
];

export const AdaptiveMusicDashboard: React.FC = () => {
  const { toast } = useToast();
  const [selectedEmotion, setSelectedEmotion] = useState('calme');
  const [intensity, setIntensity] = useState([5]);
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stats, setStats] = useState<MusicStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  useEffect(() => {
    loadRecommendations();
    loadStats();
  }, [selectedEmotion, intensity]);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast({
          title: 'Non connecté',
          description: 'Veuillez vous connecter pour accéder à la musique thérapeutique',
          variant: 'destructive',
        });
        return;
      }

      const response = await supabase.functions.invoke('adaptive-music/recommendations', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emotion: selectedEmotion,
          intensity: intensity[0],
        }),
      });

      if (response.error) throw response.error;

      setRecommendations(response.data.recommendations || []);
    } catch (error: any) {
      logger.error('Erreur lors du chargement des recommandations', error as Error, 'UI');
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les recommandations musicales',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await supabase.functions.invoke('adaptive-music/stats', {
        method: 'GET',
      });

      if (response.error) throw response.error;

      setStats(response.data);
    } catch (error) {
      logger.error('Erreur lors du chargement des statistiques', error as Error, 'UI');
    }
  };

  const playTrack = async (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setSessionStartTime(new Date());
    
    toast({
      title: '🎵 Lecture en cours',
      description: `${track.title} - ${track.artist}`,
    });
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const stopAndSaveSession = async () => {
    if (!currentTrack || !sessionStartTime) return;

    const durationSeconds = Math.round((new Date().getTime() - sessionStartTime.getTime()) / 1000);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.functions.invoke('adaptive-music/listening-session', {
        method: 'POST',
        body: JSON.stringify({
          track_id: currentTrack.id,
          duration_seconds: durationSeconds,
          emotion_before: selectedEmotion,
          emotion_after: 'calme', // Simplification pour démo
        }),
      });

      toast({
        title: '✓ Session enregistrée',
        description: `${Math.round(durationSeconds / 60)} minutes d'écoute`,
      });

      loadStats();
    } catch (error) {
      logger.error('Erreur lors de l\'enregistrement de la session', error as Error, 'UI');
    }

    setIsPlaying(false);
    setCurrentTrack(null);
    setSessionStartTime(null);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Musique Thérapeutique Adaptative</h1>
        <Music className="h-8 w-8 text-primary" />
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                  <p className="text-2xl font-bold">{stats.totalSessions}</p>
                </div>
                <Music className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Minutes d'écoute</p>
                  <p className="text-2xl font-bold">{stats.totalMinutes}</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Amélioration</p>
                  <p className="text-2xl font-bold">+{stats.averageImprovement}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Top émotions</p>
                {stats.topEmotions.slice(0, 3).map((e, i) => (
                  <div key={i} className="text-xs">
                    {e.emotion} ({e.count})
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sélection de l'émotion */}
      <Card>
        <CardHeader>
          <CardTitle>Comment vous sentez-vous ?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {EMOTIONS.map((emotion) => (
              <Button
                key={emotion.value}
                variant={selectedEmotion === emotion.value ? 'default' : 'outline'}
                onClick={() => setSelectedEmotion(emotion.value)}
                className="w-full"
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${emotion.color}`} />
                {emotion.label}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Intensité : {intensity[0]}/10</label>
            <Slider
              value={intensity}
              onValueChange={setIntensity}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lecteur actuel */}
      {currentTrack && (
        <Card className="bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-lg font-semibold">{currentTrack.title}</p>
                <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                <div className="flex gap-2 mt-2">
                  {currentTrack.emotion_tags.map((tag, i) => (
                    <span key={i} className="text-xs bg-primary/10 px-2 py-1 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                {isPlaying ? (
                  <Button onClick={pauseTrack} size="lg" variant="default">
                    <Pause className="h-6 w-6" />
                  </Button>
                ) : (
                  <Button onClick={() => playTrack(currentTrack)} size="lg" variant="default">
                    <Play className="h-6 w-6" />
                  </Button>
                )}
                <Button onClick={stopAndSaveSession} size="lg" variant="outline">
                  Terminer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommandations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommandations pour {selectedEmotion}</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Chargement des recommandations...</p>
          ) : recommendations.length === 0 ? (
            <p className="text-muted-foreground">Aucune recommandation disponible</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((track) => (
                <Card key={track.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold">{track.title}</p>
                        <p className="text-sm text-muted-foreground">{track.artist}</p>
                      </div>
                      <Heart className="h-5 w-5 text-muted-foreground hover:text-red-500 cursor-pointer" />
                    </div>
                    
                    <div className="flex gap-2 mb-3 flex-wrap">
                      {track.emotion_tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-primary/10 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span>{Math.round(track.duration / 60)} min</span>
                      <span>{track.bpm} BPM</span>
                      <span>Énergie {track.energy_level}/10</span>
                    </div>

                    <Button
                      onClick={() => playTrack(track)}
                      className="w-full"
                      variant={currentTrack?.id === track.id ? 'default' : 'outline'}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Écouter
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdaptiveMusicDashboard;
