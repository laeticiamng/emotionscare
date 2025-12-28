/**
 * Suno Music Generator Component
 * Complete music generation interface with mood selection and customization
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Music,
  Wand2,
  Loader2,
  Heart,
  Download,
  Play,
  Pause,
  AlertTriangle,
  Info,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

interface GeneratedTrack {
  id: string;
  title: string;
  audioUrl: string;
  imageUrl?: string;
  duration?: number;
  status: 'generating' | 'completed' | 'failed';
  prompt: string;
  mood: string;
}

const MOOD_OPTIONS = [
  { id: 'calm', label: 'Calme', icon: '🌊', description: 'Musique apaisante et relaxante' },
  { id: 'energizing', label: 'Énergisant', icon: '⚡', description: 'Boost d\'énergie positive' },
  { id: 'focused', label: 'Concentration', icon: '🎯', description: 'Améliore la productivité' },
  { id: 'happy', label: 'Joyeux', icon: '😊', description: 'Ambiance positive et joyeuse' },
  { id: 'meditative', label: 'Méditatif', icon: '🧘‍♀️', description: 'Profonde relaxation' },
  { id: 'uplifting', label: 'Motivant', icon: '☀️', description: 'Inspire et motive' },
];

const GENRE_OPTIONS = [
  { value: 'ambient', label: 'Ambient' },
  { value: 'lo-fi', label: 'Lo-Fi' },
  { value: 'classical', label: 'Classique' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'electronic', label: 'Électronique' },
  { value: 'acoustic', label: 'Acoustique' },
  { value: 'cinematic', label: 'Cinématique' },
  { value: 'world', label: 'World Music' },
];

const TEMPO_OPTIONS = [
  { value: 'slow', label: 'Lent (60-80 BPM)', bpm: 70 },
  { value: 'medium', label: 'Modéré (80-120 BPM)', bpm: 100 },
  { value: 'fast', label: 'Rapide (120-160 BPM)', bpm: 140 },
];

export const SunoMusicGenerator: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [selectedMood, setSelectedMood] = useState(MOOD_OPTIONS[0].id);
  const [genre, setGenre] = useState('ambient');
  const [tempo, setTempo] = useState('medium');
  const [isInstrumental, setIsInstrumental] = useState(true);
  const [energy, setEnergy] = useState([0.5]);
  const [customPrompt, setCustomPrompt] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<GeneratedTrack | null>(null);
  const [generationQueue, setGenerationQueue] = useState<string[]>([]);
  const [savedTracks, setSavedTracks] = useState<GeneratedTrack[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement] = useState(() => new Audio());

  // Cleanup audio element on unmount
  React.useEffect(() => {
    const audio = audioElement;
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioElement]);

  // La clé API est gérée côté serveur, pas besoin de vérifier côté client
  const isApiConfigured = true; // L'API Suno est configurée via secrets serveur

  const handleGenerateMusic = async () => {
    if (!user) {
      toast({
        title: 'Connexion requise',
        description: 'Veuillez vous connecter pour générer de la musique',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const moodData = MOOD_OPTIONS.find((m) => m.id === selectedMood);
      const prompt = customPrompt || `therapeutic ${selectedMood} music, ${genre} style, ${isInstrumental ? 'instrumental' : 'with vocals'}`;

      logger.info('Generating Suno music', {
        mood: selectedMood,
        genre,
        tempo,
        energy: energy[0],
      }, 'MUSIC');

      // Call Suno edge function
      const { data, error } = await supabase.functions.invoke('suno-music', {
        body: {
          action: 'start',
          prompt,
          mood: selectedMood,
        },
      });

      if (error) {
        throw error;
      }

      // Check if generation was successful
      if (data.success && data.data) {
        const trackId = data.data.id || data.data[0]?.id;

        if (trackId) {
          setGenerationQueue((prev) => [...prev, trackId]);
          pollGenerationStatus(trackId);

          toast({
            title: 'Génération démarrée',
            description: 'Votre musique est en cours de création...',
          });
        }
      } else if (data.fallback) {
        // Use fallback tracks
        const fallbackTrack = data.fallback.tracks.find((t: any) => t.mood === selectedMood) || data.fallback.tracks[0];

        setCurrentTrack({
          id: fallbackTrack.id,
          title: `Musique ${moodData?.label || selectedMood} (Fallback)`,
          audioUrl: fallbackTrack.url,
          status: 'completed',
          prompt,
          mood: selectedMood,
        });

        toast({
          title: 'Piste de secours utilisée',
          description: 'Le service Suno est temporairement indisponible',
        });
      }
    } catch (error) {
      logger.error('Failed to generate music', error, 'MUSIC');

      toast({
        title: 'Erreur de génération',
        description: 'Impossible de générer la musique. Veuillez réessayer.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const pollGenerationStatus = async (trackId: string) => {
    const maxAttempts = 60; // 2 minutes max (2s interval)
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('suno-music', {
          body: {
            action: 'status',
            trackIds: [trackId],
          },
        });

        if (error || !data.success) {
          throw error || new Error('Status check failed');
        }

        const trackData = data.data;

        if (trackData.status === 'complete' || trackData.audio_url) {
          // Generation completed
          const moodData = MOOD_OPTIONS.find((m) => m.id === selectedMood);

          setCurrentTrack({
            id: trackId,
            title: trackData.title || `Musique ${moodData?.label || selectedMood}`,
            audioUrl: trackData.audio_url,
            imageUrl: trackData.image_url,
            duration: trackData.duration,
            status: 'completed',
            prompt: trackData.metadata?.prompt || '',
            mood: selectedMood,
          });

          setGenerationQueue((prev) => prev.filter((id) => id !== trackId));

          toast({
            title: 'Musique prête !',
            description: 'Votre musique personnalisée est disponible',
          });

          return;
        }

        // Still generating, check again
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 2000);
        } else {
          throw new Error('Generation timeout');
        }
      } catch (error) {
        logger.error('Failed to check generation status', error, 'MUSIC');

        setCurrentTrack((prev) =>
          prev?.id === trackId ? { ...prev, status: 'failed' } : prev
        );
        setGenerationQueue((prev) => prev.filter((id) => id !== trackId));

        toast({
          title: 'Erreur de génération',
          description: 'La génération a échoué. Veuillez réessayer.',
          variant: 'destructive',
        });
      }
    };

    checkStatus();
  };

  const handlePlayPause = () => {
    if (!currentTrack || currentTrack.status !== 'completed') return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      if (audioElement.src !== currentTrack.audioUrl) {
        audioElement.src = currentTrack.audioUrl;
      }
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const handleSaveTrack = async () => {
    if (!currentTrack || !user) return;

    try {
      // Save to user's favorites
      const { error } = await supabase.from('user_music_favorites').insert({
        user_id: user.id,
        track_id: currentTrack.id,
        title: currentTrack.title,
        audio_url: currentTrack.audioUrl,
        mood: currentTrack.mood,
        metadata: {
          prompt: currentTrack.prompt,
          genre,
          tempo,
          energy: energy[0],
        },
      });

      if (error) throw error;

      setSavedTracks((prev) => [...prev, currentTrack]);

      toast({
        title: 'Piste sauvegardée',
        description: 'Ajoutée à vos favoris',
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder la piste',
        variant: 'destructive',
      });
    }
  };

  const selectedMoodData = MOOD_OPTIONS.find((m) => m.id === selectedMood);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Générateur Musical Suno AI
          </CardTitle>
          <CardDescription className="text-base">
            Créez de la musique personnalisée basée sur vos émotions et préférences
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Info API - plus besoin de clé côté client */}
      {!user && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Connexion requise</AlertTitle>
          <AlertDescription>
            Connectez-vous pour accéder à la génération de musique IA
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Personnalisez votre expérience musicale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mood Selection */}
              <div className="space-y-3">
                <Label>Humeur cible</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {MOOD_OPTIONS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setSelectedMood(mood.id)}
                      className={cn(
                        'p-4 rounded-lg border-2 transition-all text-left',
                        selectedMood === mood.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <div className="text-2xl mb-2">{mood.icon}</div>
                      <div className="font-medium">{mood.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {mood.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre */}
              <div className="space-y-2">
                <Label htmlFor="genre">Genre musical</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger id="genre">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GENRE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tempo */}
              <div className="space-y-2">
                <Label htmlFor="tempo">Tempo</Label>
                <Select value={tempo} onValueChange={setTempo}>
                  <SelectTrigger id="tempo">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TEMPO_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Energy Level */}
              <div className="space-y-2">
                <Label>Niveau d'énergie: {Math.round(energy[0] * 100)}%</Label>
                <Slider
                  value={energy}
                  onValueChange={setEnergy}
                  min={0}
                  max={1}
                  step={0.1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Calme</span>
                  <span>Énergique</span>
                </div>
              </div>

              {/* Instrumental Switch */}
              <div className="flex items-center justify-between">
                <Label htmlFor="instrumental">Instrumental uniquement</Label>
                <Switch
                  id="instrumental"
                  checked={isInstrumental}
                  onCheckedChange={setIsInstrumental}
                />
              </div>

              {/* Custom Prompt */}
              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Prompt personnalisé (optionnel)</Label>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Décrivez le style de musique que vous souhaitez..."
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour utiliser les paramètres automatiques
                </p>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateMusic}
                disabled={isGenerating || !user}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5 mr-2" />
                    Générer la musique
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Player Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Lecteur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentTrack ? (
                <>
                  {currentTrack.imageUrl && (
                    <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={currentTrack.imageUrl}
                        alt={currentTrack.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="font-medium">{currentTrack.title}</h3>
                    <Badge variant="secondary">{selectedMoodData?.label}</Badge>
                  </div>

                  {currentTrack.status === 'completed' && (
                    <div className="space-y-3">
                      <Button
                        onClick={handlePlayPause}
                        className="w-full"
                        size="lg"
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="h-5 w-5 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-5 w-5 mr-2" />
                            Lecture
                          </>
                        )}
                      </Button>

                      <div className="flex gap-2">
                        <Button
                          onClick={handleSaveTrack}
                          variant="outline"
                          className="flex-1"
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                      </div>
                    </div>
                  )}

                  {currentTrack.status === 'generating' && (
                    <div className="text-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
                      <p className="text-sm text-muted-foreground">
                        Génération en cours...
                      </p>
                    </div>
                  )}

                  {currentTrack.status === 'failed' && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        La génération a échoué. Veuillez réessayer.
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Aucune piste en cours
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Configurez les paramètres et générez votre musique
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-blue-800">
                  <p className="font-medium">Génération musicale IA</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Musique unique générée pour vous</li>
                    <li>Basée sur vos émotions et préférences</li>
                    <li>Génération en ~30-60 secondes</li>
                    <li>Téléchargeable et sauvegardable</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Queue Status */}
      {generationQueue.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Génération en cours</AlertTitle>
          <AlertDescription>
            {generationQueue.length} piste{generationQueue.length > 1 ? 's' : ''} en cours de
            génération
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
