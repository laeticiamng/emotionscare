/**
 * 🎵 UNIFIED MUSIC THERAPY PREMIUM
 * Composant unifié pour la musicothérapie adaptive
 * Génération et personnalisation de musique thérapeutique
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  Zap,
  Download,
  Share2,
  Repeat,
  Shuffle,
  Clock,
  Waves,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUnifiedMusic } from '@/hooks/useUnifiedMusic';
import { useAccessibility } from '@/hooks/useAccessibility';
import { toast } from 'sonner';

interface UnifiedMusicTherapyProps {
  emotion?: string;
  onTrackChange?: (track: any) => void;
  autoPlay?: boolean;
  showVisualizer?: boolean;
  showQueue?: boolean;
  showRecommendations?: boolean;
  compact?: boolean;
}

const THERAPY_MODES = [
  {
    id: 'adaptive',
    name: 'Adaptatif',
    description: 'Musique qui s\'adapte à votre état émotionnel',
    icon: Zap
  },
  {
    id: 'meditation',
    name: 'Méditation',
    description: 'Sons apaisants pour la méditation',
    icon: Heart
  },
  {
    id: 'focus',
    name: 'Concentration',
    description: 'Musique pour améliorer la concentration',
    icon: Waves
  },
  {
    id: 'sleep',
    name: 'Sommeil',
    description: 'Sons relaxants pour s\'endormir',
    icon: Clock
  }
];

const MUSIC_STYLES = [
  'Ambient',
  'Classique',
  'Nature',
  'Binaural',
  'Piano Solo',
  'Guitare Acoustique',
  'Chant Grégorien',
  'Sons de la Mer',
  'Pluie Douce',
  'Fréquences Solfège'
];

export const UnifiedMusicTherapy: React.FC<UnifiedMusicTherapyProps> = ({
  emotion,
  onTrackChange,
  autoPlay = false,
  showVisualizer = true,
  showQueue = true,
  showRecommendations = true,
  compact = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [selectedMode, setSelectedMode] = useState('adaptive');
  const [selectedStyle, setSelectedStyle] = useState('');
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const {
    currentTrack,
    queue,
    recommendations,
    isGenerating,
    isLoading,
    generateMusic,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
    addToFavorites,
    downloadTrack
  } = useUnifiedMusic();
  
  const { announce } = useAccessibility();

  // Gestion de l'audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      if (isRepeating) {
        audio.currentTime = 0;
        audio.play();
        setIsPlaying(true);
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isRepeating, nextTrack]);

  // Auto-play quand une nouvelle piste est chargée
  useEffect(() => {
    if (currentTrack && autoPlay) {
      handlePlay();
    }
  }, [currentTrack, autoPlay]);

  const handlePlay = async () => {
    if (!audioRef.current) return;
    
    try {
      await audioRef.current.play();
      setIsPlaying(true);
      announce(`Lecture de ${currentTrack?.title || 'la piste'}`, 'polite');
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
      toast.error('Impossible de lire la piste');
    }
  };

  const handlePause = () => {
    if (!audioRef.current) return;
    
    audioRef.current.pause();
    setIsPlaying(false);
    announce('Lecture en pause', 'polite');
  };

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newTime = (value[0] / 100) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return;
    
    const newVolume = value[0];
    setVolume([newVolume]);
    audioRef.current.volume = newVolume / 100;
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    audioRef.current.volume = newMuted ? 0 : volume[0] / 100;
  };

  const handleGenerateMusic = async () => {
    try {
      const params = {
        emotion: emotion || 'calm',
        mode: selectedMode,
        style: selectedStyle || 'ambient',
        duration: 180 // 3 minutes
      };
      
      await generateMusic(params);
      toast.success('Nouvelle piste générée avec succès!');
      announce('Nouvelle piste thérapeutique créée', 'assertive');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error('Erreur lors de la génération de musique');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className={`space-y-4 ${compact ? 'space-y-3' : ''}`}>
      <audio
        ref={audioRef}
        src={currentTrack?.audioUrl}
        preload="metadata"
      />

      {/* Main Player Card */}
      <Card className="overflow-hidden">
        <CardHeader className={`pb-4 ${compact ? 'pb-3' : ''}`}>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-primary" />
              Musicothérapie Premium
            </div>
            {isGenerating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération...
              </div>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Track Info */}
          {currentTrack && (
            <div className="text-center space-y-2">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                {currentTrack.coverArt ? (
                  <img 
                    src={currentTrack.coverArt} 
                    alt="Couverture" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Waves className="h-8 w-8 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-semibold">{currentTrack.title}</h3>
                <p className="text-sm text-muted-foreground">{currentTrack.description}</p>
              </div>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary">{currentTrack.emotion}</Badge>
                <Badge variant="outline">{currentTrack.style}</Badge>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[progress]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
              aria-label="Position de lecture"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShuffled(!isShuffled)}
              className={isShuffled ? 'text-primary' : ''}
              aria-label={isShuffled ? 'Désactiver le mode aléatoire' : 'Activer le mode aléatoire'}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={previousTrack}
              disabled={!currentTrack}
              aria-label="Piste précédente"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              size="icon"
              onClick={isPlaying ? handlePause : handlePlay}
              disabled={!currentTrack}
              className="h-12 w-12"
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={nextTrack}
              disabled={!currentTrack}
              aria-label="Piste suivante"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRepeating(!isRepeating)}
              className={isRepeating ? 'text-primary' : ''}
              aria-label={isRepeating ? 'Désactiver la répétition' : 'Activer la répétition'}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted || volume[0] === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={isMuted ? [0] : volume}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="flex-1"
              aria-label="Volume"
            />
            <span className="text-xs text-muted-foreground w-8">
              {isMuted ? 0 : volume[0]}%
            </span>
          </div>

          {/* Quick Actions */}
          {currentTrack && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addToFavorites(currentTrack.id)}
              >
                <Heart className="h-4 w-4 mr-2" />
                Favoris
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadTrack(currentTrack.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button
                variant="outline"
                size="sm"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Music Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Génération Personnalisée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Mode thérapeutique</label>
              <Select value={selectedMode} onValueChange={setSelectedMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {THERAPY_MODES.map((mode) => (
                    <SelectItem key={mode.id} value={mode.id}>
                      <div className="flex items-center gap-2">
                        <mode.icon className="h-4 w-4" />
                        {mode.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Style musical</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un style" />
                </SelectTrigger>
                <SelectContent>
                  {MUSIC_STYLES.map((style) => (
                    <SelectItem key={style} value={style.toLowerCase()}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerateMusic}
            disabled={isGenerating || !selectedStyle}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Générer une piste personnalisée
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Queue & Recommendations */}
      {(showQueue || showRecommendations) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Queue */}
          {showQueue && queue.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">File d'attente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {queue.slice(0, 5).map((track, index) => (
                    <div key={track.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                        <Music className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(track.duration)}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => playTrack(track.id)}>
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {showRecommendations && recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recommandations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {recommendations.slice(0, 5).map((track, index) => (
                    <div key={track.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                      <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded flex items-center justify-center">
                        <Heart className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{track.title}</p>
                        <p className="text-xs text-muted-foreground">{track.emotion}</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => playTrack(track.id)}>
                        <Play className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Visualizer */}
      {showVisualizer && isPlaying && (
        <Card>
          <CardContent className="pt-6">
            <div className="h-24 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 rounded-lg flex items-end justify-center gap-1 p-4">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-primary/60 w-2 rounded-full"
                  animate={{
                    height: [4, Math.random() * 40 + 10, 4],
                  }}
                  transition={{
                    duration: 0.5 + Math.random() * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};