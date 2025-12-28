/**
 * UNIFIED MUSIC PLAYER - EmotionsCare
 * Player audio unifié utilisant MusicContext
 * Enhanced with full accessibility support (ARIA, keyboard navigation, screen reader)
 * Includes: equalizer, visualizer, loop, shuffle controls
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  Music,
  Repeat,
  Repeat1,
  Shuffle,
  Activity,
  SlidersHorizontal,
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

type LoopMode = 'none' | 'all' | 'one';

const EQUALIZER_PRESETS = {
  flat: [0, 0, 0, 0, 0],
  bass: [4, 3, 0, 0, 0],
  treble: [0, 0, 0, 3, 4],
  vocal: [0, 2, 3, 2, 0],
  rock: [3, 1, -1, 2, 3],
};

export const UnifiedMusicPlayer: React.FC<UnifiedMusicPlayerProps> = ({
  className,
  compact = false
}) => {
  const musicContext = useMusic();
  const {
    state,
    play,
    pause,
    next,
    previous,
    seek,
    setVolume,
    shufflePlaylist,
    setRepeatMode,
  } = musicContext;

  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    repeatMode: contextRepeatMode,
    shuffleMode: contextShuffleMode,
  } = state;

  const playerRef = useRef<HTMLDivElement>(null);
  
  // Enhanced controls state - sync with context
  const [showEqualizer, setShowEqualizer] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(true);
  const [equalizerValues, setEqualizerValues] = useState([0, 0, 0, 0, 0]);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(16).fill(0));
  
  // Map context repeatMode to local loopMode for UI
  const loopMode: LoopMode = contextRepeatMode === 'one' ? 'one' 
    : contextRepeatMode === 'all' ? 'all' : 'none';
  const isShuffled = contextShuffleMode;

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

  // Visualizer animation - Simulation visuelle (Web Audio API nécessite audio element local)
  // Les barres réagissent au tempo de la musique de manière simulée
  useEffect(() => {
    if (!isPlaying || !showVisualizer) {
      setVisualizerBars(Array(16).fill(0));
      return;
    }
    
    // Simulation basée sur le temps de lecture pour plus de réalisme
    const interval = setInterval(() => {
      const baseIntensity = Math.sin(currentTime * 2) * 0.3 + 0.7; // Varie avec le temps
      setVisualizerBars(prev => 
        prev.map((_, i) => {
          // Crée un pattern plus musical avec des pics sur les basses fréquences
          const bassBoost = i < 4 ? 1.3 : i < 8 ? 1.1 : 0.8;
          return Math.random() * 60 * baseIntensity * bassBoost + 20;
        })
      );
    }, 80);
    return () => clearInterval(interval);
  }, [isPlaying, showVisualizer, currentTime]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Cycle loop mode via context
  const cycleLoopMode = useCallback(() => {
    const nextMode = loopMode === 'none' ? 'all' : loopMode === 'all' ? 'one' : 'none';
    setRepeatMode(nextMode);
  }, [loopMode, setRepeatMode]);

  // Toggle shuffle via context
  const toggleShuffle = useCallback(() => {
    shufflePlaylist?.();
  }, [shufflePlaylist]);

  const applyEqualizerPreset = useCallback((preset: keyof typeof EQUALIZER_PRESETS) => {
    setEqualizerValues(EQUALIZER_PRESETS[preset]);
  }, []);

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
        {/* Visualizer */}
        {showVisualizer && isPlaying && (
          <div className="flex items-end justify-center gap-0.5 h-12 mb-4">
            {visualizerBars.map((height, i) => (
              <div
                key={i}
                className="w-1.5 bg-gradient-to-t from-primary to-primary/50 rounded-t transition-all duration-100"
                style={{ height: `${Math.max(4, height * 0.5)}%` }}
              />
            ))}
          </div>
        )}

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

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-2">
          {/* Shuffle */}
          <Button
            size="icon"
            variant={isShuffled ? "secondary" : "ghost"}
            onClick={toggleShuffle}
            aria-label="Lecture aléatoire"
            className="h-9 w-9"
          >
            <Shuffle className={cn("h-4 w-4", isShuffled && "text-primary")} aria-hidden="true" />
          </Button>

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

          {/* Loop Mode */}
          <Button
            size="icon"
            variant={loopMode !== 'none' ? "secondary" : "ghost"}
            onClick={cycleLoopMode}
            aria-label={`Mode répétition: ${loopMode === 'none' ? 'désactivé' : loopMode === 'all' ? 'toutes' : 'une'}`}
            className="h-9 w-9"
          >
            {loopMode === 'one' ? (
              <Repeat1 className="h-4 w-4 text-primary" aria-hidden="true" />
            ) : (
              <Repeat className={cn("h-4 w-4", loopMode === 'all' && "text-primary")} aria-hidden="true" />
            )}
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
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-10 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Advanced Controls */}
        <div className="flex items-center justify-center gap-2 pt-2 border-t">
          <Button
            size="sm"
            variant={showVisualizer ? "secondary" : "outline"}
            onClick={() => setShowVisualizer(!showVisualizer)}
            className="gap-1 text-xs"
          >
            <Activity className="h-3 w-3" />
            Visualizer
          </Button>
          <Button
            size="sm"
            variant={showEqualizer ? "secondary" : "outline"}
            onClick={() => setShowEqualizer(!showEqualizer)}
            className="gap-1 text-xs"
          >
            <SlidersHorizontal className="h-3 w-3" />
            Égaliseur
          </Button>
        </div>

        {/* Equalizer Panel */}
        {showEqualizer && (
          <div className="space-y-3 p-3 rounded-lg bg-muted/30">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Égaliseur</span>
              <div className="flex gap-1">
                {(Object.keys(EQUALIZER_PRESETS) as (keyof typeof EQUALIZER_PRESETS)[]).map((preset) => (
                  <Button
                    key={preset}
                    size="sm"
                    variant="ghost"
                    onClick={() => applyEqualizerPreset(preset)}
                    className="h-6 px-2 text-xs capitalize"
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-end justify-around gap-2 h-24">
              {['60Hz', '250Hz', '1kHz', '4kHz', '16kHz'].map((label, i) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <Slider
                    orientation="vertical"
                    value={[equalizerValues[i] + 6]}
                    max={12}
                    step={1}
                    onValueChange={(v) => {
                      const newValues = [...equalizerValues];
                      newValues[i] = v[0] - 6;
                      setEqualizerValues(newValues);
                    }}
                    className="h-16"
                  />
                  <span className="text-[10px] text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
