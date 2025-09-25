/**
 * Lecteur audio HTML5 avec accessibilité et reprise automatique
 * Respecte les politiques de user-gesture des navigateurs
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Heart, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { saveRecent } from '@/services/music/recentApi';
import { toggleFavorite, isFavorite } from '@/services/music/favoritesApi';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  artist?: string;
  cover?: string;
  url: string;
  duration_sec: number;
  genre?: string;
}

interface PlayerProps {
  track: Track;
  autoResume?: boolean;
  resumePosition?: number;
  onTrackEnd?: () => void;
  onPositionChange?: (position: number) => void;
  className?: string;
}

export const Player: React.FC<PlayerProps> = ({
  track,
  autoResume = false,
  resumePosition = 0,
  onTrackEnd,
  onPositionChange,
  className
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  
  // États du lecteur
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Sauvegarder périodiquement la position
  const lastSaveRef = useRef(0);
  const saveInterval = useRef<NodeJS.Timeout>();
  
  // Formater le temps en mm:ss
  const formatTime = useCallback((timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  // Vérifier si la piste est en favoris
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const favorite = await isFavorite(track.id);
        setIsFav(favorite);
      } catch (error) {
        console.error('Erreur vérification favori:', error);
      }
    };
    
    checkFavorite();
  }, [track.id]);
  
  // Configuration de l'élément audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = volume;
    setIsLoading(true);
    setCurrentTime(0);
    setDuration(0);
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      
      // Reprendre à la position sauvegardée si spécifiée
      if (resumePosition > 0 && resumePosition < audio.duration) {
        audio.currentTime = resumePosition;
        setCurrentTime(resumePosition);
      }
    };
    
    const handleTimeUpdate = () => {
      const time = audio.currentTime;
      setCurrentTime(time);
      onPositionChange?.(time);
      
      // Sauvegarder la position toutes les 10 secondes
      if (time - lastSaveRef.current > 10) {
        lastSaveRef.current = time;
        saveRecent(track.id, time, {
          title: track.title,
          artist: track.artist,
          cover: track.cover,
          duration_sec: audio.duration,
          genre: track.genre
        }).catch(console.error);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      onTrackEnd?.();
      
      // Nettoyer la sauvegarde de position à la fin
      saveRecent(track.id, audio.duration, {
        title: track.title,
        artist: track.artist,
        cover: track.cover,
        duration_sec: audio.duration,
        genre: track.genre
      }).catch(console.error);
    };
    
    const handleError = (e: Event) => {
      console.error('Erreur audio:', e);
      setIsLoading(false);
      toast({
        title: 'Erreur de lecture',
        description: 'Impossible de lire cette piste audio',
        variant: 'destructive'
      });
    };
    
    const handleCanPlay = () => {
      setIsLoading(false);
    };
    
    // Événements
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [track, resumePosition, volume, onTrackEnd, onPositionChange, toast]);
  
  // Nettoyage à la fermeture
  useEffect(() => {
    return () => {
      if (saveInterval.current) {
        clearInterval(saveInterval.current);
      }
      
      // Sauvegarder la position finale
      const audio = audioRef.current;
      if (audio && audio.currentTime > 5) {
        saveRecent(track.id, audio.currentTime, {
          title: track.title,
          artist: track.artist,
          cover: track.cover,
          duration_sec: audio.duration,
          genre: track.genre
        }).catch(console.error);
      }
    };
  }, [track]);
  
  // Contrôles de lecture
  const handlePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    setHasUserInteracted(true);
    
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Erreur lecture/pause:', error);
      toast({
        title: 'Erreur de lecture',
        description: 'Impossible de contrôler la lecture',
        variant: 'destructive'
      });
    }
  }, [isPlaying, toast]);
  
  // Gestion du seek
  const handleSeek = useCallback((value: number[]) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    
    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);
  
  // Avancer/reculer de 10 secondes
  const handleSkipBackward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  }, []);
  
  const handleSkipForward = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = Math.min(duration, audio.currentTime + 10);
  }, [duration]);
  
  // Gestion du volume
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    
    const audio = audioRef.current;
    if (audio) {
      audio.volume = newVolume;
    }
  }, []);
  
  // Basculer favori
  const handleToggleFavorite = useCallback(async () => {
    try {
      const newFavState = await toggleFavorite({
        id: track.id,
        title: track.title,
        artist: track.artist,
        cover: track.cover,
        duration_sec: track.duration_sec,
        genre: track.genre
      });
      
      setIsFav(newFavState);
      
      toast({
        title: newFavState ? 'Ajouté aux favoris' : 'Retiré des favoris',
        description: `"${track.title}" ${newFavState ? 'ajouté à' : 'retiré de'} vos favoris`
      });
    } catch (error) {
      console.error('Erreur toggle favori:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier les favoris',
        variant: 'destructive'
      });
    }
  }, [track, toast]);
  
  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasUserInteracted) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSkipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSkipForward();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasUserInteracted, handlePlayPause, handleSkipBackward, handleSkipForward]);
  
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  return (
    <div className={cn("bg-card p-6 rounded-lg border shadow-sm", className)}>
      {/* Élément audio masqué */}
      <audio
        ref={audioRef}
        src={track.url}
        preload="metadata"
        aria-label={`Lecture audio de ${track.title}`}
      />
      
      {/* Informations de la piste */}
      <div className="flex items-center gap-4 mb-4">
        {track.cover && (
          <img
            src={track.cover}
            alt={`Pochette de ${track.title}`}
            className="w-16 h-16 rounded-md object-cover"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{track.title}</h3>
          {track.artist && (
            <p className="text-muted-foreground truncate">{track.artist}</p>
          )}
          {track.genre && (
            <p className="text-xs text-muted-foreground">{track.genre}</p>
          )}
        </div>
        
        {/* Bouton favori */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleToggleFavorite}
          aria-label={isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          className="shrink-0"
        >
          <Heart 
            className={cn(
              "h-5 w-5",
              isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )} 
          />
        </Button>
      </div>
      
      {/* Contrôles principaux */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSkipBackward}
          aria-label="Reculer de 10 secondes"
          disabled={isLoading}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button
          size="lg"
          onClick={handlePlayPause}
          disabled={isLoading}
          aria-label={isPlaying ? 'Mettre en pause' : 'Lecture'}
          className="w-12 h-12"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSkipForward}
          aria-label="Avancer de 10 secondes"
          disabled={isLoading}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Barre de progression */}
      <div className="space-y-2">
        <Slider
          value={[progressPercentage]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
          aria-label="Position de lecture"
          disabled={isLoading || duration === 0}
        />
        
        {/* Temps */}
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Contrôle de volume */}
      <div className="flex items-center gap-2 mt-4">
        <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
        <Slider
          value={[volume * 100]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="flex-1"
          aria-label="Volume"
        />
        <span className="text-sm text-muted-foreground w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      </div>
      
      {/* Instructions d'accessibilité */}
      <div className="sr-only" aria-live="polite">
        {isPlaying ? 'Lecture en cours' : 'Lecture en pause'}
        {` - ${formatTime(currentTime)} / ${formatTime(duration)}`}
      </div>
      
      {/* Message d'aide pour les raccourcis */}
      {hasUserInteracted && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Raccourcis : Espace (lecture/pause), ← → (navigation)
        </p>
      )}
    </div>
  );
};