// @ts-nocheck
/**
 * B2C MUSIC ENHANCED - EmotionsCare
 * Interface vinyles thérapeutiques avec player audio unifié
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Music,
  Disc3,
  Heart,
  Brain,
  Zap,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMusic } from '@/hooks/useMusic';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { getOptimizedUniverse } from '@/data/universes/config';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { UnifiedMusicPlayer } from '@/components/music/UnifiedMusicPlayer';
import type { MusicTrack } from '@/types/music';
import { logger } from '@/lib/logger';

interface VinylTrack extends MusicTrack {
  category: 'doux' | 'énergique' | 'créatif' | 'guérison';
  color: string;
  vinylColor: string;
  description: string;
}

// Tracks avec URLs audio réelles de test
const vinylTracks: VinylTrack[] = [
  {
    id: 'vinyl-1',
    title: 'Sérénité Fluide',
    artist: 'Studio EmotionsCare',
    duration: 180,
    category: 'doux',
    mood: 'Calme océanique',
    color: 'hsl(200, 70%, 60%)',
    vinylColor: 'linear-gradient(135deg, hsl(200, 70%, 60%), hsl(180, 60%, 70%))',
    description: 'Ondes douces qui bercent ton esprit',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    emotion: 'calm'
  },
  {
    id: 'vinyl-2',
    title: 'Éveil Créatif',
    artist: 'Harmonies Génératives',
    duration: 240,
    category: 'créatif',
    mood: 'Inspiration pure',
    color: 'hsl(280, 70%, 60%)',
    vinylColor: 'linear-gradient(135deg, hsl(280, 70%, 60%), hsl(320, 60%, 70%))',
    description: 'Stimule ta créativité naturelle',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    emotion: 'creative'
  },
  {
    id: 'vinyl-3',
    title: 'Boost Vital',
    artist: 'Rythmes Organiques',
    duration: 150,
    category: 'énergique',
    mood: 'Dynamisme zen',
    color: 'hsl(30, 80%, 60%)',
    vinylColor: 'linear-gradient(135deg, hsl(30, 80%, 60%), hsl(60, 70%, 70%))',
    description: 'Énergie sans stress',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    emotion: 'energetic'
  },
  {
    id: 'vinyl-4',
    title: 'Résonance Curative',
    artist: 'Fréquences Sacrées',
    duration: 300,
    category: 'guérison',
    mood: 'Régénération',
    color: 'hsl(140, 60%, 60%)',
    vinylColor: 'linear-gradient(135deg, hsl(140, 60%, 60%), hsl(120, 70%, 70%))',
    description: 'Harmonise ton être intérieur',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    emotion: 'healing'
  }
];

const categoryIcons = {
  doux: Heart,
  créatif: Sparkles,
  énergique: Zap,
  guérison: Brain,
};

const B2CMusicEnhanced: React.FC = () => {
  const { toast } = useToast();
  
  // Protection du contexte Music
  let musicContext;
  try {
    musicContext = useMusic();
  } catch (error) {
    logger.error('MusicContext not available', error as Error, 'MUSIC');
    return (
      <div className="min-h-full bg-background p-8 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center space-y-4">
            <Music className="h-12 w-12 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold text-foreground">Service musical indisponible</h2>
            <p className="text-muted-foreground">Le service de musique n'est pas disponible actuellement.</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const { state, play, setPlaylist } = musicContext;
  
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem('music:favorites');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [lastPlayedId, setLastPlayedId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem('music:lastPlayed');
    } catch {
      return null;
    }
  });

  const [showReward, setShowReward] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);

  const universe = getOptimizedUniverse('music');
  const { entranceVariants, cleanupAnimation } = useOptimizedAnimation({
    enableComplexAnimations: !prefersReducedMotion,
    useCSSAnimations: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('music:favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    // Set playlist on mount
    setPlaylist(vinylTracks);
  }, [setPlaylist]);

  useEffect(() => {
    return () => cleanupAnimation();
  }, [cleanupAnimation]);

  const resumeTrack = lastPlayedId ? vinylTracks.find(track => track.id === lastPlayedId) ?? null : null;

  const handleToggleFavorite = (trackId: string) => {
    setFavorites(prev => (
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId) 
        : [...prev, trackId]
    ));
  };

  const startTrack = async (track: VinylTrack) => {
    await play(track);
    setPlayerVisible(true);
    setLastPlayedId(track.id);
    
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('music:lastPlayed', track.id);
      } catch {}
    }

    toast({
      title: "Vinyle en rotation ♪",
      description: `${track.title} compose ton aura sonore`,
    });
  };

  const handleBackToSelection = () => {
    setPlayerVisible(false);
  };

  return (
    <div className="min-h-full bg-background p-8">
      {showReward && (
        <RewardSystem
          reward={{
            type: 'crystal',
            name: 'Cristal Sonore',
            description: universe.artifacts.description,
            moduleId: 'music'
          }}
          badgeText="Harmonie créée ♪"
          onComplete={() => setShowReward(false)}
        />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-accent to-accent/80">
            <Music className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Musicothérapie</h1>
            <p className="text-muted-foreground">Playlists thérapeutiques personnalisées</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div>
        {!playerVisible ? (
          <div
            className="space-y-12"
          >
            {/* Introduction */}
            <div className="text-center space-y-6">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                style={{ 
                  background: `linear-gradient(135deg, ${universe.ambiance.colors.primary}, ${universe.ambiance.colors.accent})` 
                }}
              >
                <Disc3 className="h-10 w-10 text-primary-foreground" />
              </div>
              
              <h2 className="text-4xl font-light text-foreground tracking-wide">
                Vinyles en Apesanteur
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                Choisis ton vinyle et laisse-le composer ton aura sonore.
                Chaque mélodie s'adapte à ton état pour créer l'harmonie parfaite.
              </p>
            </div>

            {resumeTrack && (
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  onClick={() => startTrack(resumeTrack)}
                  className="px-6"
                >
                  Reprendre la session
                </Button>
              </div>
            )}

            {/* Vinyl Collection */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
              {vinylTracks.map((track, index) => {
                const Icon = categoryIcons[track.category];
                
                return (
                  <div key={track.id}>
                    <Card
                      className="h-full bg-card/90 backdrop-blur-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
                      onClick={() => startTrack(track)}
                    >
                      <CardContent className="p-6 space-y-4">
                        {/* Vinyl Disc */}
                        <div className="relative">
                          <div
                            className="w-24 h-24 mx-auto rounded-full relative overflow-hidden transition-transform duration-300"
                            style={{ background: track.vinylColor }}
                          >
                            {/* Vinyl grooves */}
                            <div className="absolute inset-2 rounded-full border-2 border-foreground/20" />
                            <div className="absolute inset-4 rounded-full border border-foreground/20" />
                            <div className="absolute inset-6 rounded-full border border-foreground/20" />
                            
                            {/* Center hole */}
                            <div className="absolute top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 rounded-full bg-card border-2 border-foreground/30 flex items-center justify-center">
                              <Icon className="w-3 h-3" style={{ color: track.color }} />
                            </div>
                          </div>
                          
                          {/* Floating effect */}
                          <div 
                            className="absolute -inset-2 rounded-full opacity-30 blur-md"
                            style={{ background: track.vinylColor }}
                          />
                        </div>
                        
                        <div className="text-center space-y-2">
                          <h3 className="text-lg font-medium text-foreground">
                            {track.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {track.artist}
                          </p>
                          
                          <Badge
                            variant="secondary"
                            className="text-xs"
                            style={{
                              backgroundColor: `${track.color}20`,
                              color: track.color
                            }}
                          >
                            {track.mood}
                          </Badge>

                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {track.description}
                          </p>

                          <div className="pt-2 space-y-2">
                            <Button
                              size="sm"
                              className="w-full"
                              style={{
                                backgroundColor: `${track.color}15`,
                                color: track.color,
                                borderColor: `${track.color}30`
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                startTrack(track);
                              }}
                            >
                              <Play className="h-3 w-3 mr-2" />
                              Lancer le vinyle
                            </Button>
                            <Button
                              variant={favorites.includes(track.id) ? 'secondary' : 'ghost'}
                              size="sm"
                              className="w-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleFavorite(track.id);
                              }}
                            >
                              <Heart className={`h-3 w-3 mr-2 ${favorites.includes(track.id) ? 'fill-current text-destructive' : ''}`} />
                              {favorites.includes(track.id) ? 'Favori' : 'Ajouter'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className="max-w-2xl mx-auto space-y-6"
          >
            <Button
              variant="ghost"
              onClick={handleBackToSelection}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux vinyles
            </Button>

            <UnifiedMusicPlayer />
          </div>
        )}
      </div>
    </div>
  );
};

export default B2CMusicEnhanced;
