// @ts-nocheck
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Music, Heart, Brain, Zap } from 'lucide-react';
import { useWebAudio } from '@/hooks/useWebAudio';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

interface MoodTrack {
  id: string;
  name: string;
  mood: string;
  url: string;
  duration: number;
  bpm: number;
  instruments: string[];
  status: 'ready' | 'generating' | 'error';
}

interface MoodSettings {
  energy: number; // 0-100
  valence: number; // 0-100 (negative to positive)
  focus: number; // 0-100
  tempo: 'slow' | 'medium' | 'fast';
}

export default function MoodMixer() {
  const { playAudio, stopAll, crossfade } = useWebAudio();
  
  const [settings, setSettings] = useState<MoodSettings>({
    energy: 50,
    valence: 60,
    focus: 50,
    tempo: 'medium'
  });
  
  const [currentTrack, setCurrentTrack] = useState<MoodTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [volume, setVolume] = useState([70]);
  
  // Pistes de fallback
  const [fallbackTracks] = useState<MoodTrack[]>([
    {
      id: 'calm-1',
      name: 'Sérénité Océanique',
      mood: 'Calme',
      url: '/audio/calm-ocean.mp3',
      duration: 180,
      bpm: 60,
      instruments: ['piano', 'strings', 'nature'],
      status: 'ready'
    },
    {
      id: 'energy-1',
      name: 'Élan Dynamique',
      mood: 'Énergique',
      url: '/audio/upbeat-energy.mp3',
      duration: 200,
      bpm: 120,
      instruments: ['synth', 'drums', 'bass'],
      status: 'ready'
    },
    {
      id: 'focus-1',
      name: 'Concentration Zen',
      mood: 'Focus',
      url: '/audio/focus-ambient.mp3',
      duration: 240,
      bpm: 80,
      instruments: ['ambient', 'binaural', 'minimal'],
      status: 'ready'
    }
  ]);

  const generateTrack = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Déterminer le prompt basé sur les paramètres
      const moodPrompt = generateMoodPrompt(settings);
      
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'start',
          prompt: moodPrompt,
          mood: getMoodLabel(settings),
          sessionId: crypto.randomUUID()
        }
      });
      
      if (error) throw error;
      
      if (data.success) {
        // Track généré avec succès
        const newTrack: MoodTrack = {
          id: data.data.id,
          name: `Mood Mix - ${getMoodLabel(settings)}`,
          mood: getMoodLabel(settings),
          url: data.data.audio_url,
          duration: 120,
          bpm: getTargetBPM(settings),
          instruments: ['AI generated'],
          status: 'ready'
        };
        
        setCurrentTrack(newTrack);
        
        // Sauvegarder la session
        await supabase.functions.invoke('metrics/music_sessions', {
          body: {
            session_id: crypto.randomUUID(),
            payload: {
              track_ids: [newTrack.id],
              mood_settings: settings,
              source: 'suno'
            }
          }
        });
      } else if (data.fallback) {
        // Utiliser une piste de fallback
        const fallbackTrack = selectFallbackTrack(settings);
        setCurrentTrack(fallbackTrack);
      }
    } catch (error) {
      logger.error('Erreur génération', error as Error, 'UI');
      // Utiliser une piste de fallback
      const fallbackTrack = selectFallbackTrack(settings);
      setCurrentTrack(fallbackTrack);
    } finally {
      setIsGenerating(false);
    }
  }, [settings]);

  const generateMoodPrompt = (settings: MoodSettings): string => {
    const energyDesc = settings.energy > 70 ? 'high energy' : 
                      settings.energy > 30 ? 'moderate energy' : 'low energy, calm';
    const valenceDesc = settings.valence > 70 ? 'uplifting, positive' :
                       settings.valence > 30 ? 'neutral, balanced' : 'melancholic, introspective';
    const focusDesc = settings.focus > 70 ? 'focused, concentration' :
                     settings.focus > 30 ? 'ambient' : 'relaxing, meditative';
    
    return `therapeutic music, ${energyDesc}, ${valenceDesc}, ${focusDesc}, instrumental, ${settings.tempo} tempo`;
  };

  const getMoodLabel = (settings: MoodSettings): string => {
    if (settings.energy > 70) return 'Énergique';
    if (settings.valence < 30) return 'Contemplatif';
    if (settings.focus > 70) return 'Focus';
    return 'Équilibré';
  };

  const getTargetBPM = (settings: MoodSettings): number => {
    const baseBPM = settings.tempo === 'slow' ? 60 : 
                   settings.tempo === 'fast' ? 120 : 90;
    return baseBPM + Math.round((settings.energy - 50) * 0.6);
  };

  const selectFallbackTrack = (settings: MoodSettings): MoodTrack => {
    if (settings.energy > 70) return fallbackTracks[1]; // Énergique
    if (settings.focus > 70) return fallbackTracks[2]; // Focus
    return fallbackTracks[0]; // Calme par défaut
  };

  const playTrack = async () => {
    if (!currentTrack) return;
    
    try {
      await playAudio(currentTrack.url, volume[0] / 100);
      setIsPlaying(true);
    } catch (error) {
      logger.error('Erreur lecture', error as Error, 'UI');
    }
  };

  const pauseTrack = () => {
    stopAll();
    setIsPlaying(false);
  };

  const stopTrack = () => {
    stopAll();
    setIsPlaying(false);
    setCurrentTrack(null);
  };

  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'énergique': return <Zap className="h-4 w-4" />;
      case 'focus': return <Brain className="h-4 w-4" />;
      case 'calme': return <Heart className="h-4 w-4" />;
      default: return <Music className="h-4 w-4" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'énergique': return 'bg-orange-500/10 text-orange-700';
      case 'focus': return 'bg-purple-500/10 text-purple-700';
      case 'calme': return 'bg-blue-500/10 text-blue-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Music className="h-6 w-6" />
              Mood Mixer
            </CardTitle>
            <p className="text-muted-foreground">
              Génération de musique thérapeutique personnalisée
            </p>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Paramètres d'humeur */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Énergie</label>
                <Slider
                  value={[settings.energy]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, energy: value[0] }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {settings.energy < 33 ? 'Calme' : 
                   settings.energy < 67 ? 'Modéré' : 'Dynamique'}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Positivité</label>
                <Slider
                  value={[settings.valence]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, valence: value[0] }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {settings.valence < 33 ? 'Mélancolique' : 
                   settings.valence < 67 ? 'Neutre' : 'Joyeux'}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium">Concentration</label>
                <Slider
                  value={[settings.focus]}
                  onValueChange={(value) => setSettings(prev => ({ ...prev, focus: value[0] }))}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground text-center">
                  {settings.focus < 33 ? 'Relax' : 
                   settings.focus < 67 ? 'Ambiant' : 'Focus'}
                </div>
              </div>
            </div>

            {/* Tempo */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Tempo</label>
              <div className="flex gap-2">
                {(['slow', 'medium', 'fast'] as const).map((tempo) => (
                  <Button
                    key={tempo}
                    variant={settings.tempo === tempo ? 'default' : 'outline'}
                    onClick={() => setSettings(prev => ({ ...prev, tempo }))}
                    className="flex-1"
                  >
                    {tempo === 'slow' ? 'Lent' : 
                     tempo === 'medium' ? 'Modéré' : 'Rapide'}
                  </Button>
                ))}
              </div>
            </div>

            {/* Aperçu de l'humeur */}
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                {getMoodIcon(getMoodLabel(settings))}
                <span className="font-medium">{getMoodLabel(settings)}</span>
              </div>
              <Badge className={getMoodColor(getMoodLabel(settings))} variant="outline">
                {getTargetBPM(settings)} BPM
              </Badge>
            </div>

            {/* Génération */}
            <div className="text-center">
              <Button
                onClick={generateTrack}
                disabled={isGenerating}
                size="lg"
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Music className="h-5 w-5" />
                    Générer la Musique
                  </>
                )}
              </Button>
            </div>

            {/* Lecteur */}
            {currentTrack && (
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{currentTrack.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge className={getMoodColor(currentTrack.mood)} variant="outline">
                          {currentTrack.mood}
                        </Badge>
                        <span>{currentTrack.bpm} BPM</span>
                        <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Contrôles du lecteur */}
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Button
                      onClick={isPlaying ? pauseTrack : playTrack}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      {isPlaying ? 'Pause' : 'Play'}
                    </Button>
                    
                    <Button
                      onClick={stopTrack}
                      variant="outline"
                      size="lg"
                      className="flex items-center gap-2"
                    >
                      <Square className="h-5 w-5" />
                      Stop
                    </Button>
                  </div>

                  {/* Volume */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Volume</span>
                      <span>{volume[0]}%</span>
                    </div>
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pistes de fallback disponibles */}
            <div>
              <h3 className="font-medium mb-4">Pistes pré-générées</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fallbackTracks.map((track) => (
                  <Card 
                    key={track.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setCurrentTrack(track)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        {getMoodIcon(track.mood)}
                        <Badge className={getMoodColor(track.mood)} variant="outline">
                          {track.mood}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm">{track.name}</h4>
                      <div className="text-xs text-muted-foreground mt-1">
                        {track.bpm} BPM • {Math.floor(track.duration / 60)}min
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}