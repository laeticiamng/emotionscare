/**
 * UNIFIED MUSIC PLAYER - EmotionsCare
 * Player audio unifié utilisant MusicContext
 * Enhanced with full accessibility support (ARIA, keyboard navigation, screen reader)
 */

import React, { useEffect, useRef } from 'react';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Music
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';
import {
  setupMusicKeyboardNavigation,
  announceTrackChange,
  announcePlaybackState,
  announceVolumeChange,
  getPlayerAriaAttributes,
  getPlayButtonAriaAttributes,
  getVolumeSliderAriaAttributes,
  getProgressAriaAttributes,
  formatTimeForScreenReader
} from '@/utils/music-a11y';

interface UnifiedMusicPlayerProps {
  className?: string;
  compact?: boolean;
}

export const UnifiedMusicPlayer: React.FC<UnifiedMusicPlayerProps> = ({
  className,
  compact = false
}) => {
  const {
    state,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume
  } = useMusic();

  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
  } = state;

  const playerRef = useRef<HTMLDivElement>(null);

  // Announce track changes to screen readers
  useEffect(() => {
    if (currentTrack) {
      announceTrackChange(currentTrack);
    }
  }, [currentTrack?.id]);

  // Announce playback state changes
  useEffect(() => {
    if (currentTrack) {
      announcePlaybackState(isPlaying, currentTrack);
    }
  }, [isPlaying, currentTrack?.id]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      if (currentTrack) {
        play();
      }
    }
  };

  const handleSeek = useDebouncedCallback((value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seek(newTime);
  }, 100);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    announceVolumeChange(newVolume);
  };

  const handleVolumeUp = () => {
    const newVolume = Math.min(1, volume + 0.1);
    setVolume(newVolume);
    announceVolumeChange(newVolume);
  };

  const handleVolumeDown = () => {
    const newVolume = Math.max(0, volume - 0.1);
    setVolume(newVolume);
    announceVolumeChange(newVolume);
  };

  const handleMute = () => {
    const newVolume = volume > 0 ? 0 : 0.7;
    setVolume(newVolume);
    announceVolumeChange(newVolume);
  };

  // Setup keyboard navigation
  useEffect(() => {
    if (!playerRef.current) return;

    const cleanup = setupMusicKeyboardNavigation(playerRef.current, {
      onPlayPause: handlePlayPause,
      onNext: next,
      onPrev: previous,
      onVolumeUp: handleVolumeUp,
      onVolumeDown: handleVolumeDown,
      onMute: handleMute
    });

    return cleanup;
  }, [handlePlayPause, next, previous]);

  if (!currentTrack) {
    return (
      <Card className={cn("bg-card/50 backdrop-blur-sm", className)}>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Sélectionnez un vinyle pour commencer</p>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className={cn("flex items-center gap-4 p-4 bg-card/90 backdrop-blur-sm rounded-lg", className)}>
        {/* Play/Pause */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handlePlayPause}
          className="h-10 w-10"
          aria-label={isPlaying ? 'Mettre en pause' : 'Lire'}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate text-sm">{currentTrack.title}</p>
          <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 w-24">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <Card
      ref={playerRef}
      {...getPlayerAriaAttributes(isPlaying, currentTrack)}
      className={cn("bg-card/90 backdrop-blur-md", className)}
    >
      <CardContent className="p-6 space-y-6">
        {/* Track Info */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-medium">{currentTrack.title}</h3>
          <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          {currentTrack.mood && (
            <p className="text-xs text-muted-foreground italic">{currentTrack.mood}</p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            {...getProgressAriaAttributes(currentTime, duration)}
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span aria-label={`Temps écoulé: ${formatTimeForScreenReader(currentTime)}`}>
              {formatTime(currentTime)}
            </span>
            <span aria-label={`Durée totale: ${formatTimeForScreenReader(duration)}`}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Live region for screen readers */}
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
          {isPlaying ? `Lecture en cours : ${currentTrack?.title} par ${currentTrack?.artist}` : 'Lecture en pause'}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            size="icon"
            variant="ghost"
            onClick={previous}
            aria-label="Piste précédente"
            className="h-10 w-10"
          >
            <SkipBack className="h-5 w-5" aria-hidden="true" />
          </Button>

          <Button
            size="icon"
            onClick={handlePlayPause}
            {...getPlayButtonAriaAttributes(isPlaying)}
            className="h-14 w-14 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Play className="h-6 w-6 ml-1" aria-hidden="true" />
            )}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={next}
            aria-label="Piste suivante"
            className="h-10 w-10"
          >
            <SkipForward className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleMute}
            aria-label={volume === 0 ? 'Activer le son' : 'Couper le son'}
            className="h-8 w-8"
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Volume2 className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
          <Slider
            {...getVolumeSliderAriaAttributes(volume)}
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-full"
          />
          <span
            className="text-xs text-muted-foreground w-12 text-right"
            aria-label={`Volume actuel: ${Math.round(volume * 100)} pourcent`}
          >
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="text-xs text-center text-muted-foreground pt-2 border-t">
          <p>
            Raccourcis: <kbd className="px-1 py-0.5 bg-muted rounded">Espace</kbd> Lecture/Pause •{' '}
            <kbd className="px-1 py-0.5 bg-muted rounded">↑/↓</kbd> Volume •{' '}
            <kbd className="px-1 py-0.5 bg-muted rounded">←/→</kbd> Piste •{' '}
            <kbd className="px-1 py-0.5 bg-muted rounded">M</kbd> Muet
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedMusicPlayer;
