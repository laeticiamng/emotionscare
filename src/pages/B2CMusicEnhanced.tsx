import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  ArrowLeft,
  Music,
  Volume2,
  Disc3,
  Heart,
  Brain,
  Zap,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { UniverseEngine } from '@/components/universe/UniverseEngine';
import { RewardSystem } from '@/components/rewards/RewardSystem';
import { getOptimizedUniverse } from '@/data/universes/config';
import { useOptimizedAnimation } from '@/hooks/useOptimizedAnimation';
import { useClinicalHints } from '@/hooks/useClinicalHints';
import { ConsentGate } from '@/features/clinical-optin/ConsentGate';

interface VinylTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // en secondes
  category: 'doux' | 'énergique' | 'créatif' | 'guérison';
  mood: string;
  color: string;
  vinylColor: string;
  description: string;
}

const vinylTracks: VinylTrack[] = [
  {
    id: 'vinyl-1',
    title: 'Sérénité Fluide',
    artist: 'Studio EmotionsCare',
    duration: 180, // 3 minutes
    category: 'doux',
    mood: 'Calme océanique',
    color: 'hsl(200, 70%, 60%)',
    vinylColor: 'linear-gradient(135deg, hsl(200, 70%, 60%), hsl(180, 60%, 70%))',
    description: 'Ondes douces qui bercent ton esprit'
  },
  {
    id: 'vinyl-2',
    title: 'Éveil Créatif',
    artist: 'Harmonies Génératives',
    duration: 240, // 4 minutes
    category: 'créatif',
    mood: 'Inspiration pure',
    color: 'hsl(280, 70%, 60%)',
    vinylColor: 'linear-gradient(135deg, hsl(280, 70%, 60%), hsl(320, 60%, 70%))',
    description: 'Stimule ta créativité naturelle'
  },
  {
    id: 'vinyl-3',
    title: 'Boost Vital',
    artist: 'Rythmes Organiques',
    duration: 150, // 2.5 minutes
    category: 'énergique',
    mood: 'Dynamisme zen',
    color: 'hsl(30, 80%, 60%)',
    vinylColor: 'linear-gradient(135deg, hsl(30, 80%, 60%), hsl(60, 70%, 70%))',
    description: 'Énergie sans stress'
  },
  {
    id: 'vinyl-4',
    title: 'Résonance Curative',
    artist: 'Fréquences Sacrées',
    duration: 300, // 5 minutes
    category: 'guérison',
    mood: 'Régénération',
    color: 'hsl(140, 60%, 60%)',
    vinylColor: 'linear-gradient(135deg, hsl(140, 60%, 60%), hsl(120, 70%, 70%))',
    description: 'Harmonise ton être intérieur'
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
  const clinicalHints = useClinicalHints();
  const musicHints = clinicalHints.moduleCues.music;
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = window.localStorage.getItem('music:favorites');
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.warn('[music] unable to read favorites', error);
      return [];
    }
  });
  const [lastPlayedId, setLastPlayedId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem('music:lastPlayed');
    } catch (error) {
      console.warn('[music] unable to read last played track', error);
      return null;
    }
  });

  // Get optimized universe config
  const universe = getOptimizedUniverse('music');
  
  // Universe state
  const [isEntering, setIsEntering] = useState(true);
  const [universeEntered, setUniverseEntered] = useState(false);
  
  // Music state
  const [selectedTrack, setSelectedTrack] = useState<VinylTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [showReward, setShowReward] = useState(false);
  const [vinylRotation, setVinylRotation] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Optimized animations
  const { entranceVariants, cleanupAnimation } = useOptimizedAnimation({
    enableComplexAnimations: !prefersReducedMotion,
    useCSSAnimations: true,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem('music:favorites', JSON.stringify(favorites));
    } catch (error) {
      console.warn('[music] unable to persist favorites', error);
    }
  }, [favorites]);

  const resumeTrack = lastPlayedId ? vinylTracks.find(track => track.id === lastPlayedId) ?? null : null;
  const intensityLabel = musicHints
    ? musicHints.intensity === 'low'
      ? 'douce'
      : musicHints.intensity === 'high'
        ? 'énergique'
        : 'modérée'
    : null;
  const textureLabel = musicHints
    ? musicHints.texture === 'airy'
      ? 'aérienne'
      : musicHints.texture === 'bright'
        ? 'lumineuse'
        : 'chaleureuse'
    : null;
  const categoryLabel = musicHints
    ? {
        doux: 'détente',
        créatif: 'créativité',
        énergique: 'énergie',
        guérison: 'régénération',
      }[musicHints.recommendedCategory]
    : null;

  const handleToggleFavorite = (trackId: string) => {
    setFavorites(prev => (prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]));
  };

  // Handle universe entrance
  const handleUniverseEnterComplete = () => {
    setUniverseEntered(true);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAnimation();
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
    };
  }, [cleanupAnimation]);

  // Track progress and vinyl rotation
  useEffect(() => {
    if (isPlaying && selectedTrack) {
      // Progress timer
      intervalRef.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            stopTrack();
            return 0;
          }
          return prev + (100 / selectedTrack.duration); // Increment based on track duration
        });
      }, 1000);

      // Vinyl rotation
      rotationIntervalRef.current = setInterval(() => {
        setVinylRotation(prev => (prev + 6) % 360); // 6 degrees per 100ms = smooth rotation
      }, 100);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
      };
    }
  }, [isPlaying, selectedTrack]);

  const startTrack = (track: VinylTrack) => {
    setSelectedTrack(track);
    setProgress(0);
    setIsPlaying(true);
    setLastPlayedId(track.id);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem('music:lastPlayed', track.id);
      } catch (error) {
        console.warn('[music] unable to persist last played track', error);
      }
    }

    toast({
      title: "Vinyle en rotation ♪",
      description: `${track.title} compose ton aura sonore`,
    });
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const stopTrack = () => {
    setIsPlaying(false);
    setProgress(0);
    
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
    
    // Show reward after completion
    if (selectedTrack) {
      setShowReward(true);
    }
  };

  const handleRewardComplete = () => {
    setShowReward(false);
    setSelectedTrack(null);
    
    toast({
      title: "Harmonie du moment ✨",
      description: "Ton cristal sonore résonne maintenant dans ta collection",
    });
  };

  if (showReward && selectedTrack) {
    return (
      <ConsentGate>
        <RewardSystem
          reward={{
            type: 'crystal',
            name: 'Cristal Sonore',
            description: universe.artifacts.description,
            moduleId: 'music'
          }}
          badgeText="Harmonie créée ♪"
          onComplete={handleRewardComplete}
        />
      </ConsentGate>
    );
  }

  return (
    <ConsentGate>
      <UniverseEngine
        universe={universe}
        isEntering={isEntering}
        onEnterComplete={handleUniverseEnterComplete}
        enableParticles={true}
        enableAmbianceSound={false}
        className="min-h-screen"
      >
      {/* Header */}
      <header className="relative z-50 p-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/app" 
            className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Retour</span>
          </Link>
          
          <div className="flex items-center space-x-2 text-foreground">
            <Music className="h-6 w-6 text-amber-500" />
            <h1 className="text-xl font-light tracking-wide">{universe.name}</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {!selectedTrack ? (
            <motion.div
              key="selection"
              variants={entranceVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-12"
            >
              {/* Introduction */}
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                  style={{ 
                    background: `linear-gradient(135deg, ${universe.ambiance.colors.primary}, ${universe.ambiance.colors.accent})` 
                  }}
                >
                  <Disc3 className="h-10 w-10 text-white" />
                </motion.div>
                
                <h2 className="text-4xl font-light text-foreground tracking-wide">
                  Vinyles en Apesanteur
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                  Choisis ton vinyle et laisse-le composer ton aura sonore.
                  Chaque mélodie s'adapte à ton état pour créer l'harmonie parfaite.
                </p>
                {musicHints && (
                  <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground" aria-live="polite">
                    {textureLabel && (
                      <Badge variant="secondary">Texture {textureLabel}</Badge>
                    )}
                    {intensityLabel && (
                      <Badge variant="outline">Intensité {intensityLabel}</Badge>
                    )}
                    {categoryLabel && (
                      <Badge variant="secondary">Voie {categoryLabel}</Badge>
                    )}
                  </div>
                )}
              </div>

              {resumeTrack && (
                <div className="flex justify-center">
                  <Button
                    variant="secondary"
                    onClick={() => startTrack(resumeTrack)}
                    className="px-6"
                  >
                    {musicHints?.resumeLabel ?? 'Reprise instantanée'}
                  </Button>
                </div>
              )}

              {/* Vinyl Collection */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
                {vinylTracks.map((track, index) => {
                  const Icon = categoryIcons[track.category];
                  
                  return (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 30, rotateY: -30 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ delay: 0.7 + index * 0.2 }}
                      whileHover={{ scale: 1.05, rotateY: 15 }}
                      whileTap={{ scale: 0.95 }}
                      className="perspective-1000"
                    >
                      <Card
                        className={`h-full bg-card/90 backdrop-blur-md hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden ${
                          musicHints?.recommendedCategory === track.category ? 'ring-2 ring-yellow-400/50' : ''
                        }`}
                        onClick={() => startTrack(track)}
                      >
                        <CardContent className="p-6 space-y-4">
                          {/* Vinyl Disc */}
                          <div className="relative">
                            <motion.div
                              className="w-24 h-24 mx-auto rounded-full relative overflow-hidden group-hover:scale-110 transition-transform duration-300"
                              style={{ background: track.vinylColor }}
                              whileHover={{ rotateZ: 180 }}
                              transition={{ duration: 1 }}
                            >
                              {/* Vinyl grooves */}
                              <div className="absolute inset-2 rounded-full border-2 border-black/20" />
                              <div className="absolute inset-4 rounded-full border border-black/20" />
                              <div className="absolute inset-6 rounded-full border border-black/20" />
                              
                              {/* Center hole */}
                              <div className="absolute top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 rounded-full bg-card border-2 border-black/30 flex items-center justify-center">
                                <Icon className="w-3 h-3" style={{ color: track.color }} />
                              </div>
                            </motion.div>
                            
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

                            {musicHints?.recommendedCategory === track.category && (
                              <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                                Recommandé
                              </Badge>
                            )}

                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {track.description}
                            </p>

                            <div className="pt-2">
                              <Button
                                size="sm"
                                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                                style={{
                                  backgroundColor: `${track.color}15`,
                                  color: track.color,
                                  borderColor: `${track.color}30`
                                }}
                                onClick={() => startTrack(track)}
                              >
                                <Play className="h-3 w-3 mr-2" />
                                Lancer le vinyle
                              </Button>
                              <Button
                                variant={favorites.includes(track.id) ? 'secondary' : 'ghost'}
                                size="sm"
                                className="mt-2 w-full"
                                aria-pressed={favorites.includes(track.id)}
                                aria-label={favorites.includes(track.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleToggleFavorite(track.id);
                                }}
                              >
                                <Heart className={`h-3 w-3 mr-2 ${favorites.includes(track.id) ? 'fill-current text-red-500' : ''}`} />
                                {favorites.includes(track.id) ? 'Favori enregistré' : 'Ajouter aux favoris'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl mx-auto text-center space-y-12"
            >
              {/* Track Info */}
              <div className="space-y-4">
                <h2 className="text-3xl font-light text-foreground tracking-wide">
                  {selectedTrack.title}
                </h2>
                <p className="text-muted-foreground text-lg">{selectedTrack.description}</p>
                <Badge 
                  variant="secondary"
                  className="text-sm"
                  style={{ 
                    backgroundColor: `${selectedTrack.color}20`,
                    color: selectedTrack.color 
                  }}
                >
                  {selectedTrack.mood}
                </Badge>
              </div>

              {/* Floating Vinyl Player */}
              <div className="relative">
                <motion.div
                  className="w-64 h-64 mx-auto rounded-full relative"
                  style={{ background: selectedTrack.vinylColor }}
                  animate={{ 
                    rotateZ: isPlaying ? vinylRotation : 0,
                    y: isPlaying ? [-5, 5, -5] : 0 
                  }}
                  transition={{ 
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                    rotateZ: { duration: 0.1 }
                  }}
                >
                  {/* Vinyl grooves */}
                  {Array.from({ length: 8 }, (_, i) => (
                    <div 
                      key={i}
                      className={`absolute rounded-full border border-black/20`}
                      style={{
                        inset: `${8 + i * 4}px`,
                      }}
                    />
                  ))}
                  
                  {/* Center */}
                  <div className="absolute top-1/2 left-1/2 w-16 h-16 -mt-8 -ml-8 rounded-full bg-card border-4 border-black/30 flex items-center justify-center shadow-lg">
                    <div className="w-8 h-8 rounded-full" style={{ backgroundColor: selectedTrack.color }} />
                  </div>

                  {/* Floating glow */}
                  <div 
                    className="absolute -inset-8 rounded-full opacity-40 blur-xl"
                    style={{ background: selectedTrack.vinylColor }}
                  />
                </motion.div>

                {/* Progress ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-72 h-72 -rotate-90">
                    <circle
                      cx="144"
                      cy="144"
                      r="140"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className="opacity-20"
                    />
                    <circle
                      cx="144"
                      cy="144"
                      r="140"
                      stroke={selectedTrack.color}
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 140}`}
                      strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                      className="transition-all duration-1000"
                    />
                  </svg>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-6">
                <div className="flex justify-center items-center space-x-6">
                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="w-16 h-16 rounded-full"
                    style={{ backgroundColor: selectedTrack.color }}
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  
                  <Button
                    onClick={stopTrack}
                    variant="outline"
                    size="lg"
                    className="min-w-32"
                  >
                    Terminer la session
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="max-w-md mx-auto">
                  <div className="flex items-center gap-4">
                    <Volume2 className="w-5 h-5 text-muted-foreground" />
                    <Slider
                      value={volume}
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-muted-foreground w-12">
                      {volume[0]}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </UniverseEngine>
    </ConsentGate>
  );
}

export default B2CMusicEnhanced;
