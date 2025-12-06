import React, { useState, useEffect } from 'react';
import { LazyMotionWrapper, m, AnimatePresence } from '@/utils/lazy-motion';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, Heart, Download, Sparkles, TrendingUp } from '@/components/music/icons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Line } from 'react-chartjs-2';
import { logger } from '@/lib/logger';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Track {
  id: string;
  title: string;
  emotion: string;
  mood: string;
  duration: number;
  audio_url: string;
  waveform_data: number[];
  therapeutic_properties: {
    relaxation_score: number;
    energy_level: number;
    emotional_alignment: number;
    therapeutic_index: number;
  };
  is_favorite?: boolean;
}

export default function TherapeuticMusicEnhanced() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([70]);
  const [progress, setProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedEmotion, setSelectedEmotion] = useState('calm');
  const [selectedMood, setSelectedMood] = useState('relaxed');
  const [intensity, setIntensity] = useState([50]);
  const [stats, setStats] = useState({
    totalListeningTime: 0,
    favoriteCount: 0,
    mostUsedEmotion: 'calm',
    therapeuticScore: 85,
  });
  const { toast } = useToast();

  const emotions = [
    { value: 'calm', label: 'Calme', color: 'bg-blue-500' },
    { value: 'happy', label: 'Joyeux', color: 'bg-yellow-500' },
    { value: 'energetic', label: 'Énergique', color: 'bg-orange-500' },
    { value: 'sad', label: 'Triste', color: 'bg-purple-500' },
    { value: 'anxious', label: 'Anxieux', color: 'bg-red-500' },
  ];

  const moods = ['relaxed', 'focused', 'uplifting', 'meditative', 'restorative'];

  useEffect(() => {
    loadTracks();
    loadStats();
  }, []);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / currentTrack.duration);
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, currentTrack]);

  const loadTracks = async () => {
    const { data, error } = await supabase
      .from('therapeutic_music_tracks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      logger.error('Error loading tracks', error, 'UI');
      return;
    }

    setTracks(data || []);
  };

  const loadStats = async () => {
    // Simuler le chargement des statistiques
    setStats({
      totalListeningTime: 245, // minutes
      favoriteCount: 12,
      mostUsedEmotion: 'calm',
      therapeuticScore: 87,
    });
  };

  const generateMusic = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('therapeutic-music', {
        body: {
          emotion: selectedEmotion,
          mood: selectedMood,
          duration: 180,
          intensity: intensity[0] / 100,
        },
      });

      if (error) throw error;

      toast({
        title: '🎵 Musique générée',
        description: 'Votre composition thérapeutique est prête',
      });

      await loadTracks();
      if (data.track) {
        setCurrentTrack(data.track);
      }
    } catch (error: any) {
      toast({
        title: 'Erreur',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!currentTrack) {
      toast({
        title: 'Aucune piste sélectionnée',
        description: 'Générez ou sélectionnez une piste pour commencer',
      });
      return;
    }
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = async (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const { error } = await supabase
      .from('therapeutic_music_tracks')
      .update({ is_favorite: !track.is_favorite })
      .eq('id', trackId);

    if (!error) {
      setTracks(tracks.map(t => t.id === trackId ? { ...t, is_favorite: !t.is_favorite } : t));
    }
  };

  const waveformChartData = currentTrack ? {
    labels: currentTrack.waveform_data.map((_, i) => i.toString()),
    datasets: [
      {
        label: 'Forme d\'onde',
        data: currentTrack.waveform_data,
        borderColor: 'hsl(var(--primary))',
        backgroundColor: 'hsl(var(--primary) / 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  } : null;

  return (
    <LazyMotionWrapper>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <m.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
          <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
            <Music className="h-10 w-10 text-primary" />
            Musique Thérapeutique
          </h1>
          <p className="text-muted-foreground">
            Compositions personnalisées pour votre bien-être émotionnel
          </p>
        </m.div>

        {/* Stats Overview */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Temps d'écoute</p>
                  <p className="text-2xl font-bold">{stats.totalListeningTime}m</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Favoris</p>
                  <p className="text-2xl font-bold">{stats.favoriteCount}</p>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pistes créées</p>
                  <p className="text-2xl font-bold">{tracks.length}</p>
                </div>
                <Music className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Score thérapeutique</p>
                  <p className="text-2xl font-bold">{stats.therapeuticScore}%</p>
                </div>
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </m.div>

        <Tabs defaultValue="player" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="player">Lecteur</TabsTrigger>
            <TabsTrigger value="generate">Générer</TabsTrigger>
            <TabsTrigger value="library">Bibliothèque</TabsTrigger>
          </TabsList>

          {/* Music Player */}
          <TabsContent value="player" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lecteur musical</CardTitle>
                <CardDescription>
                  {currentTrack ? currentTrack.title : 'Aucune piste sélectionnée'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Waveform Visualization */}
                {currentTrack && waveformChartData && (
                  <div className="h-48">
                    <Line
                      data={waveformChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { display: false },
                          tooltip: { enabled: false },
                        },
                        scales: {
                          x: { display: false },
                          y: { display: false },
                        },
                      }}
                    />
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{Math.floor((progress / 100) * (currentTrack?.duration || 0))}s</span>
                    <span>{currentTrack?.duration || 0}s</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button variant="outline" size="icon" aria-label="Piste précédente">
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button size="lg" onClick={togglePlay} className="h-16 w-16 rounded-full" aria-label={isPlaying ? "Pause" : "Lecture"}>
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Piste suivante">
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>

                {/* Volume */}
                <div className="flex items-center gap-4">
                  <Volume2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                    aria-label={`Volume: ${volume[0]}%`}
                  />
                  <span className="text-sm text-muted-foreground w-12" aria-hidden="true">{volume[0]}%</span>
                </div>

                {/* Therapeutic Properties */}
                {currentTrack && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">Score de relaxation</p>
                      <Progress value={currentTrack.therapeutic_properties.relaxation_score * 100} className="mt-2" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Alignement émotionnel</p>
                      <Progress value={currentTrack.therapeutic_properties.emotional_alignment * 100} className="mt-2" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Niveau d'énergie</p>
                      <Progress value={currentTrack.therapeutic_properties.energy_level * 100} className="mt-2" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Index thérapeutique</p>
                      <Progress value={currentTrack.therapeutic_properties.therapeutic_index * 100} className="mt-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Music */}
          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Générer une nouvelle composition</CardTitle>
                <CardDescription>Personnalisez votre musique thérapeutique</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Emotion Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Émotion cible</label>
                  <div className="flex flex-wrap gap-2">
                    {emotions.map((emotion) => (
                      <Button
                        key={emotion.value}
                        variant={selectedEmotion === emotion.value ? 'default' : 'outline'}
                        onClick={() => setSelectedEmotion(emotion.value)}
                        className="gap-2"
                      >
                        <div className={`h-3 w-3 rounded-full ${emotion.color}`} />
                        {emotion.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Mood Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Ambiance</label>
                  <div className="flex flex-wrap gap-2">
                    {moods.map((mood) => (
                      <Badge
                        key={mood}
                        variant={selectedMood === mood ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => setSelectedMood(mood)}
                      >
                        {mood}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Intensity Slider */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Intensité: {intensity[0]}%</label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={100}
                    step={1}
                  />
                </div>

                <Button
                  onClick={generateMusic}
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Music className="mr-2 h-5 w-5" />
                      Générer la musique
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Library */}
          <TabsContent value="library" className="space-y-6">
            <div className="grid gap-4">
              {tracks.map((track) => (
                <m.div
                  key={track.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4 flex-1">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            setCurrentTrack(track);
                            setIsPlaying(true);
                          }}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                          <p className="font-medium">{track.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{track.emotion}</Badge>
                            <Badge variant="outline">{track.mood}</Badge>
                            <span className="text-sm text-muted-foreground">{track.duration}s</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => toggleFavorite(track.id)}
                        >
                          <Heart className={`h-5 w-5 ${track.is_favorite ? 'fill-current text-red-500' : ''}`} />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Download className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </m.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </LazyMotionWrapper>
  );
}
