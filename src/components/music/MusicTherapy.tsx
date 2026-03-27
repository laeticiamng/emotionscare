// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Heart,
  Brain,
  Moon,
  Zap,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useMusic } from '@/hooks/useMusic';
import { toast } from 'sonner';
import { MusicTrack as GlobalMusicTrack } from '@/types/music';

interface MusicTrack {
  id: string;
  title: string;
  mood: string;
  duration: number;
  description: string;
  category: 'relaxation' | 'energy' | 'focus' | 'sleep';
  url?: string;
}

const MusicTherapy: React.FC = () => {
  const { user } = useAuth();
  const musicContext = useMusic();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState([75]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync with global music context
  const isPlaying = musicContext.state.isPlaying;
  const progress = musicContext.state.currentTime;

  const predefinedTracks: MusicTrack[] = [
    {
      id: '1',
      title: 'Sérénité Matinale',
      mood: 'Calme',
      duration: 300,
      description: 'Musique douce pour commencer la journée en paix',
      category: 'relaxation'
    },
    {
      id: '2',
      title: 'Focus Profond',
      mood: 'Concentration',
      duration: 600,
      description: 'Sons binauraux pour améliorer la concentration',
      category: 'focus'
    },
    {
      id: '3',
      title: 'Énergie Positive',
      mood: 'Motivation',
      duration: 240,
      description: 'Rythmes énergisants pour retrouver la motivation',
      category: 'energy'
    },
    {
      id: '4',
      title: 'Sommeil Réparateur',
      mood: 'Détente',
      duration: 1800,
      description: 'Ambiances nocturnes pour un sommeil profond',
      category: 'sleep'
    }
  ];

  const generatePersonalizedMusic = async (mood: string) => {
    if (!user) return;

    setIsGenerating(true);
    try {
      // Simuler la génération de musique IA
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const newTrack: MusicTrack = {
        id: Date.now().toString(),
        title: `Musique personnalisée - ${mood}`,
        mood: mood,
        duration: 360,
        description: `Composition unique générée pour votre état émotionnel actuel`,
        category: 'relaxation'
      };

      setCurrentTrack(newTrack);
      toast.success('Musique personnalisée générée avec succès !');
      
    } catch (error) {
      logger.error('Music generation error', error as Error, 'MUSIC');
      toast.error('Erreur lors de la génération de musique');
    } finally {
      setIsGenerating(false);
    }
  };

  const playTrack = async (track: MusicTrack) => {
    setCurrentTrack(track);
    
    // Convert to global MusicTrack format and play via context
    const globalTrack: GlobalMusicTrack = {
      id: track.id,
      title: track.title,
      artist: 'EmotionsCare Therapy',
      duration: track.duration,
      url: track.url || '',
      audioUrl: track.url || '',
      coverUrl: '',
      mood: track.mood,
      genre: 'therapeutic',
    };
    
    try {
      await musicContext.play(globalTrack);
      toast.success(`Lecture de "${track.title}"`);
    } catch (error) {
      logger.error('Failed to play therapy track', error as Error, 'MUSIC');
      toast.error('Erreur lors de la lecture');
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      musicContext.pause();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };
  
  // Sync volume with context
  useEffect(() => {
    musicContext.setVolume(volume[0] / 100);
  }, [volume]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'relaxation': return <Heart className="h-4 w-4" />;
      case 'focus': return <Brain className="h-4 w-4" />;
      case 'energy': return <Zap className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      default: return <Music className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'relaxation': return 'bg-green-100 text-green-800';
      case 'focus': return 'bg-blue-100 text-blue-800';
      case 'energy': return 'bg-orange-100 text-orange-800';
      case 'sleep': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Player Principal */}
      {currentTrack && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
                  <Music className="h-8 w-8 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{currentTrack.title}</h3>
                <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
                
                {/* Contrôles de lecture */}
                <div className="flex items-center space-x-4 mt-3">
                  <Button variant="ghost" size="icon" aria-label="Piste précédente">
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button onClick={togglePlayPause} size="icon" aria-label={isPlaying ? "Mettre en pause" : "Lire"}>
                    {isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  
                  <Button variant="ghost" size="icon" aria-label="Piste suivante">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-20"
                      aria-label="Contrôle du volume"
                    />
                  </div>
                </div>
                
                {/* Barre de progression */}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
                  <div className="flex-1 bg-muted rounded-full h-1">
                    <div 
                      className="bg-primary rounded-full h-1 transition-all duration-300"
                      style={{ width: `${(progress / currentTrack.duration) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{formatTime(currentTrack.duration)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Génération IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-primary" />
              Musique Personnalisée IA
            </CardTitle>
            <CardDescription>
              Générez une composition unique basée sur votre état émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => generatePersonalizedMusic('Détente')}
                disabled={isGenerating}
                className="h-16 flex flex-col gap-1"
              >
                <Heart className="h-5 w-5" />
                <span className="text-xs">Détente</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => generatePersonalizedMusic('Concentration')}
                disabled={isGenerating}
                className="h-16 flex flex-col gap-1"
              >
                <Brain className="h-5 w-5" />
                <span className="text-xs">Focus</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => generatePersonalizedMusic('Énergie')}
                disabled={isGenerating}
                className="h-16 flex flex-col gap-1"
              >
                <Zap className="h-5 w-5" />
                <span className="text-xs">Énergie</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => generatePersonalizedMusic('Sommeil')}
                disabled={isGenerating}
                className="h-16 flex flex-col gap-1"
              >
                <Moon className="h-5 w-5" />
                <span className="text-xs">Sommeil</span>
              </Button>
            </div>

            {isGenerating && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Génération en cours...</span>
                </div>
              </div>
            )}

            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-blue-800 text-xs">
                🎵 Notre IA compose en temps réel une mélodie unique adaptée à vos besoins émotionnels actuels.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Bibliothèque */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              Bibliothèque Musicale
            </CardTitle>
            <CardDescription>
              Sélections thérapeutiques préparées par nos experts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predefinedTracks.map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getCategoryIcon(track.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{track.title}</h4>
                        <Badge className={getCategoryColor(track.category)}>
                          {track.mood}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.description}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(track.duration)}
                      </span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => playTrack(track)}
                    aria-label={`Lire ${track.title}`}
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations sur la musicothérapie */}
      <Card>
        <CardHeader>
          <CardTitle>Bienfaits de la Musicothérapie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">🧠 Effets sur le cerveau</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Réduction du cortisol (hormone du stress)</li>
                <li>• Stimulation de la sérotonine (bien-être)</li>
                <li>• Amélioration de la concentration</li>
                <li>• Facilitation de l'endormissement</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">💚 Bienfaits émotionnels</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Diminution de l'anxiété</li>
                <li>• Amélioration de l'humeur</li>
                <li>• Augmentation de la motivation</li>
                <li>• Renforcement de la résilience</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MusicTherapy;
