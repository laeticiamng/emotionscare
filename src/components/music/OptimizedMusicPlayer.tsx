/**
 * 🎵 OPTIMIZED MUSIC PLAYER - EmotionsCare
 * Lecteur musical premium optimisé avec accessibilité complète
 */

import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '@/components/accessibility/AccessibilityProvider';
import { usePlatformManager } from '@/hooks/usePlatformManager';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
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
  Download
} from 'lucide-react';

interface OptimizedMusicPlayerProps {
  className?: string;
  showVisualizer?: boolean;
  compact?: boolean;
}

export const OptimizedMusicPlayer: React.FC<OptimizedMusicPlayerProps> = ({
  className = "",
  showVisualizer = true,
  compact = false
}) => {
  const { announce } = useAccessibility();
  const { musicManager, emotionManager } = usePlatformManager();
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'none' | 'one' | 'all'>('none');
  const [isLiked, setIsLiked] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with real data
  const currentTrack = {
    id: '1',
    title: 'Sérénité Océanique',
    artist: 'EmotionsCare AI',
    emotion: 'calm',
    duration: 240,
    coverUrl: '/placeholder-album.jpg'
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    announce(isPlaying ? 'Musique en pause' : 'Lecture de la musique', 'polite');
  };

  const handlePrevious = () => {
    announce('Piste précédente', 'polite');
    // Logic for previous track
  };

  const handleNext = () => {
    announce('Piste suivante', 'polite');
    // Logic for next track
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0];
    setVolume(vol);
    setIsMuted(vol === 0);
    announce(`Volume: ${vol}%`, 'polite');
  };

  const handleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    announce(newMuted ? 'Son coupé' : 'Son rétabli', 'polite');
  };

  const handleProgressChange = (progress: number[]) => {
    const newTime = (progress[0] / 100) * duration;
    setCurrentTime(newTime);
    announce(`Position: ${formatTime(newTime)}`, 'polite');
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
    announce(isShuffled ? 'Lecture aléatoire désactivée' : 'Lecture aléatoire activée', 'polite');
  };

  const toggleRepeat = () => {
    const modes = ['none', 'one', 'all'] as const;
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
    
    const modeText = {
      none: 'désactivée',
      one: 'piste actuelle',
      all: 'toutes les pistes'
    };
    announce(`Répétition: ${modeText[nextMode]}`, 'polite');
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    announce(isLiked ? 'Retiré des favoris' : 'Ajouté aux favoris', 'polite');
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 p-2 bg-card rounded-lg ${className}`}>
        <Button
          size="sm"
          variant="ghost"
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Mettre en pause" : "Lire"}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{currentTrack.title}</p>
          <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>
        
        <div className="flex items-center gap-1">
          <Button size="sm" variant="ghost" onClick={handleMute}>
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardContent className="p-6">
        {/* Album Cover & Track Info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
            <div className="w-8 h-8 bg-primary/60 rounded-full" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg leading-tight truncate">
              {currentTrack.title}
            </h3>
            <p className="text-muted-foreground text-sm truncate">
              {currentTrack.artist}
            </p>
            <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mt-1">
              {currentTrack.emotion}
            </span>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleLike}
            aria-label={isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <Slider
            value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
            max={100}
            step={1}
            onValueChange={handleProgressChange}
            className="w-full"
            aria-label="Position de lecture"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleShuffle}
            aria-label="Lecture aléatoire"
            className={isShuffled ? 'text-primary' : ''}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePrevious}
            aria-label="Piste précédente"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            size="lg"
            onClick={handlePlayPause}
            className="rounded-full w-12 h-12"
            aria-label={isPlaying ? "Mettre en pause" : "Lire"}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleNext}
            aria-label="Piste suivante"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleRepeat}
            aria-label="Mode de répétition"
            className={repeatMode !== 'none' ? 'text-primary' : ''}
          >
            <Repeat className="w-4 h-4" />
            {repeatMode === 'one' && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                1
              </span>
            )}
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleMute}
            aria-label={isMuted ? "Réactiver le son" : "Couper le son"}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          
          <Slider
            value={[isMuted ? 0 : volume]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
            aria-label="Contrôle du volume"
          />
          
          <span className="text-xs text-muted-foreground w-8 text-right">
            {isMuted ? 0 : volume}%
          </span>
        </div>

        {/* Visualizer */}
        {showVisualizer && (
          <div className="mt-4 h-12 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg flex items-end justify-center gap-1 p-2">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-primary/60 rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'h-1'
                }`}
                style={{
                  height: isPlaying ? `${Math.random() * 100 + 20}%` : '4px',
                  animationDelay: `${i * 50}ms`
                }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};