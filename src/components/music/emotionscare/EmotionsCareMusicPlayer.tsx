/**
 * LECTEUR MUSIQUE EMOTIONSCARE - COMPOSANT PREMIUM
 * Player avancé avec intégration émotionnelle et accessibilité complète
 */

import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle,
  Heart,
  Download,
  Share2,
  Settings,
  Music
} from 'lucide-react';
import { useEmotionsCareMusicContext } from '@/contexts/EmotionsCareMusicContext';
import { cn } from '@/lib/utils';

interface EmotionsCareMusicPlayerProps {
  className?: string;
  compact?: boolean;
  showPlaylist?: boolean;
}

const EmotionsCareMusicPlayer: React.FC<EmotionsCareMusicPlayerProps> = ({
  className,
  compact = false,
  showPlaylist = true
}) => {
  const {
    state,
    play,
    pause,
    stop,
    nextTrack,
    previousTrack,
    selectTrack,
    setVolume,
    toggleMute,
    setRepeat,
    toggleShuffle,
    formatTime,
    getProgressPercentage
  } = useEmotionsCareMusicContext();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // === GESTION AUDIO HTML5 ===
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !state.currentTrack) return;

    audio.src = state.currentTrack.url;
    audio.volume = state.isMuted ? 0 : state.volume;

    if (state.isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [state.currentTrack, state.isPlaying, state.volume, state.isMuted]);

  // === GESTION DES ÉVÉNEMENTS AUDIO ===
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (!isUserSeeking) {
        // Mise à jour du temps via le reducer
        // Note: Dans un vrai contexte, il faudrait dispatcher une action
      }
    };

    const handleLoadedMetadata = () => {
      // Mise à jour de la durée
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isUserSeeking, nextTrack]);

  // === HANDLERS ===
  const handlePlayPause = () => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const newTime = (value[0] / 100) * audio.duration;
      audio.currentTime = newTime;
    }
  };

  const handleProgressStart = () => {
    setIsUserSeeking(true);
  };

  const handleProgressEnd = () => {
    setIsUserSeeking(false);
  };

  const toggleRepeat = () => {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(state.repeat);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeat(nextMode);
  };

  const getRepeatIcon = () => {
    switch (state.repeat) {
      case 'one': return '1';
      case 'all': return '∞';
      default: return '';
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Ici, on pourrait sauvegarder en base de données
  };

  // === MODE COMPACT ===
  if (compact) {
    return (
      <Card className={cn("w-full max-w-sm", className)}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            {state.currentTrack?.coverUrl && (
              <img 
                src={state.currentTrack.coverUrl} 
                alt={`Pochette de ${state.currentTrack.title}`}
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">
                {state.currentTrack?.title || 'Aucun titre'}
              </h4>
              <p className="text-xs text-muted-foreground truncate">
                {state.currentTrack?.artist || 'Artiste inconnu'}
              </p>
            </div>
            
            <div className="flex items-center space-x-1">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={previousTrack}
                disabled={!state.currentPlaylist}
                aria-label="Titre précédent"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              
              <Button 
                size="sm" 
                onClick={handlePlayPause}
                disabled={!state.currentTrack}
                aria-label={state.isPlaying ? 'Pause' : 'Lecture'}
              >
                {state.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={nextTrack}
                disabled={!state.currentPlaylist}
                aria-label="Titre suivant"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // === MODE COMPLET ===
  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Music className="w-5 h-5 text-primary" />
          EmotionsCare Player
          {state.isLoading && (
            <Badge variant="secondary" className="ml-2">
              Génération...
            </Badge>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* === INFORMATIONS DU TITRE === */}
        <div className="text-center space-y-2">
          {state.currentTrack?.coverUrl && (
            <img 
              src={state.currentTrack.coverUrl} 
              alt={`Pochette de ${state.currentTrack.title}`}
              className="w-32 h-32 mx-auto rounded-lg object-cover shadow-lg"
            />
          )}
          
          <div>
            <h3 className="text-xl font-semibold">
              {state.currentTrack?.title || 'Aucun titre sélectionné'}
            </h3>
            <p className="text-muted-foreground">
              {state.currentTrack?.artist || 'Artiste inconnu'}
            </p>
            {state.currentTrack?.emotion && (
              <Badge variant="outline" className="mt-2">
                {state.currentTrack.emotion}
              </Badge>
            )}
          </div>
        </div>

        {/* === BARRE DE PROGRESSION === */}
        <div className="space-y-2">
          <Slider
            value={[getProgressPercentage()]}
            max={100}
            step={0.1}
            onValueChange={handleProgressChange}
            onPointerDown={handleProgressStart}
            onPointerUp={handleProgressEnd}
            className="w-full"
            aria-label="Progression de la lecture"
            disabled={!state.currentTrack}
          />
          
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* === CONTRÔLES PRINCIPAUX === */}
        <div className="flex items-center justify-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleShuffle}
            className={cn(state.shuffle && "text-primary")}
            aria-label="Mode aléatoire"
            aria-pressed={state.shuffle}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={previousTrack}
            disabled={!state.currentPlaylist}
            aria-label="Titre précédent"
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          
          <Button 
            size="lg"
            onClick={handlePlayPause}
            disabled={!state.currentTrack || state.isLoading}
            className="w-14 h-14 rounded-full"
            aria-label={state.isPlaying ? 'Pause' : 'Lecture'}
          >
            {state.isLoading ? (
              <div className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : state.isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={nextTrack}
            disabled={!state.currentPlaylist}
            aria-label="Titre suivant"
          >
            <SkipForward className="w-5 h-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleRepeat}
            className={cn(state.repeat !== 'none' && "text-primary")}
            aria-label={`Mode répétition: ${state.repeat}`}
            aria-pressed={state.repeat !== 'none'}
          >
            <Repeat className="w-4 h-4" />
            {getRepeatIcon() && (
              <span className="ml-1 text-xs">{getRepeatIcon()}</span>
            )}
          </Button>
        </div>

        {/* === CONTRÔLES VOLUME === */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleMute}
            aria-label={state.isMuted ? 'Réactiver le son' : 'Couper le son'}
          >
            {state.isMuted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </Button>
          
          <Slider
            value={[state.isMuted ? 0 : state.volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
            aria-label="Volume"
            disabled={state.isMuted}
          />
          
          <span className="text-sm text-muted-foreground w-8">
            {Math.round(state.isMuted ? 0 : state.volume * 100)}
          </span>
        </div>

        {/* === ACTIONS SUPPLÉMENTAIRES === */}
        <div className="flex items-center justify-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleFavorite}
            className={cn(isFavorite && "text-red-500")}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!state.currentTrack}
            aria-label="Télécharger"
          >
            <Download className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            disabled={!state.currentTrack}
            aria-label="Partager"
          >
            <Share2 className="w-4 h-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            aria-label="Paramètres"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* === PLAYLIST === */}
        {showPlaylist && state.currentPlaylist && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">
              {state.currentPlaylist.name}
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-1">
              {state.currentPlaylist.tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => selectTrack(index)}
                  className={cn(
                    "w-full text-left p-2 rounded-md text-sm transition-colors",
                    "hover:bg-muted focus:bg-muted focus:outline-none focus:ring-2 focus:ring-primary",
                    index === state.currentIndex && "bg-primary/10 text-primary"
                  )}
                  aria-label={`Jouer ${track.title} par ${track.artist}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.title}</p>
                      <p className="text-muted-foreground truncate">{track.artist}</p>
                    </div>
                    <span className="text-muted-foreground ml-2">
                      {formatTime(track.duration)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* === ÉLÉMENT AUDIO MASQUÉ === */}
      <audio
        ref={audioRef}
        preload="metadata"
        onError={(e) => console.error('Erreur audio:', e)}
        aria-hidden="true"
      />
    </Card>
  );
};

export default EmotionsCareMusicPlayer;