/**
 * Immersive Mode - Mode théâtre plein écran
 * Visualiseur, paroles synchronisées, contrôles gestuels
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Heart,
  Maximize,
  Minimize,
  Music,
  Mic2,
  Sparkles,
  Settings,
} from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { useMusicFavorites } from '@/hooks/useMusicFavorites';

interface LyricLine {
  time: number;
  text: string;
}

interface ImmersiveModeProps {
  track?: MusicTrack;
  isPlaying?: boolean;
  progress?: number;
  volume?: number;
  lyrics?: LyricLine[];
  isOpen?: boolean;
  onClose?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onSeek?: (position: number) => void;
  onVolumeChange?: (volume: number) => void;
}

// Generate therapeutic lyrics based on track mood
const generateImmersiveLyrics = (track?: { mood?: string; title?: string }): LyricLine[] => {
  if (!track) {
    return [{ time: 0, text: '♪ Instrumental ♪' }];
  }
  
  const mood = track.mood?.toLowerCase() || '';
  
  if (mood.includes('calm') || mood.includes('océan') || mood.includes('doux')) {
    return [
      { time: 0, text: '♪ Vagues apaisantes ♪' },
      { time: 10, text: 'Le calme t\'envahit doucement' },
      { time: 20, text: 'Respire... inspire... expire...' },
      { time: 30, text: 'Tu es en paix avec toi-même' },
      { time: 40, text: 'Laisse le stress s\'éloigner' },
      { time: 50, text: '♪ Sérénité ♪' },
    ];
  }
  
  if (mood.includes('energ') || mood.includes('dynam')) {
    return [
      { time: 0, text: '♪ Énergie montante ♪' },
      { time: 8, text: 'Sens la force en toi' },
      { time: 16, text: 'Chaque battement te propulse' },
      { time: 24, text: 'Tu es puissant, invincible' },
      { time: 32, text: 'Rien ne peut t\'arrêter' },
      { time: 40, text: '♪ Victoire ♪' },
    ];
  }
  
  if (mood.includes('focus') || mood.includes('concent') || mood.includes('créat')) {
    return [
      { time: 0, text: '♪ Clarté mentale ♪' },
      { time: 12, text: 'Ton esprit est affûté' },
      { time: 24, text: 'Les idées affluent naturellement' },
      { time: 36, text: 'Concentration profonde' },
      { time: 48, text: '♪ Excellence ♪' },
    ];
  }
  
  // Default healing/wellness
  return [
    { time: 0, text: '♪ Fréquences de guérison ♪' },
    { time: 15, text: 'Ton corps se régénère' },
    { time: 30, text: 'Harmonie corps et esprit' },
    { time: 45, text: 'Tu te sens renouvelé' },
    { time: 60, text: '♪ Bien-être profond ♪' },
  ];
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const ImmersiveMode: React.FC<ImmersiveModeProps> = ({
  track,
  isPlaying = false,
  progress = 0,
  volume = 80,
  lyrics: externalLyrics,
  isOpen = false,
  onClose,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
}) => {
  // Generate lyrics based on track if none provided
  const lyrics = externalLyrics || generateImmersiveLyrics(track);
  
  // Connect to favorites system
  const { isFavorite, toggleFavorite, isLoading: favoritesLoading } = useMusicFavorites();
  const isLiked = track ? isFavorite(track.id) : false;
  
  const handleToggleFavorite = useCallback(() => {
    if (track) {
      toggleFavorite(track);
    }
  }, [track, toggleFavorite]);
  
  const [showControls, setShowControls] = useState(true);
  const [showLyrics, setShowLyrics] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [visualizerBars, setVisualizerBars] = useState<number[]>(Array(32).fill(0));
  const [localVolume, setLocalVolume] = useState(volume);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync local volume with prop
  useEffect(() => {
    setLocalVolume(volume);
  }, [volume]);

  // Auto-hide controls
  useEffect(() => {
    if (showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        if (isPlaying) setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isPlaying]);

  // Simulate visualizer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVisualizerBars((bars) =>
        bars.map(() => Math.random() * 100)
      );
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Update current lyric based on progress
  useEffect(() => {
    const currentTime = (progress / 100) * (track?.duration || 0);
    const index = lyrics.findIndex((line, i) => {
      const nextLine = lyrics[i + 1];
      return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
    });
    if (index !== -1) setCurrentLyricIndex(index);
  }, [progress, track?.duration, lyrics]);

  const handleMouseMove = () => {
    setShowControls(true);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  // Handle keyboard shortcuts in immersive mode
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          handlePlayPause();
          break;
        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrevious?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          const newVolUp = Math.min(100, localVolume + 10);
          setLocalVolume(newVolUp);
          onVolumeChange?.(newVolUp);
          break;
        case 'ArrowDown':
          e.preventDefault();
          const newVolDown = Math.max(0, localVolume - 10);
          setLocalVolume(newVolDown);
          onVolumeChange?.(newVolDown);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handlePlayPause, onClose, onNext, onPrevious, localVolume, onVolumeChange]);

  if (!isOpen || !track) return null;

  const currentTime = (progress / 100) * (track.duration || 0);

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black"
        onMouseMove={handleMouseMove}
        onClick={() => setShowControls(!showControls)}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-black to-primary/10" />

        {/* Animated Background Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-primary/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Visualizer */}
        <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center gap-1 px-4">
          {visualizerBars.map((height, i) => (
            <motion.div
              key={i}
              className="w-2 rounded-t bg-gradient-to-t from-primary to-primary/50"
              initial={{ height: 0 }}
              animate={{ height: `${height * 0.8}%` }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Album Art */}
          <motion.div
            animate={{ rotate: isPlaying ? 360 : 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="relative w-48 h-48 rounded-full overflow-hidden shadow-2xl"
            style={{
              boxShadow: `0 0 60px ${isPlaying ? 'hsl(var(--primary) / 0.5)' : 'transparent'}`,
            }}
          >
            {track.coverUrl ? (
              <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <Music className="w-16 h-16 text-primary" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-black/80" />
            </div>
          </motion.div>

          {/* Track Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-8"
          >
            <h1 className="text-3xl font-bold text-white">{track.title}</h1>
            <p className="text-lg text-white/70 mt-2">{track.artist}</p>
            {track.emotion && (
              <Badge className="mt-3" variant="secondary">
                <Sparkles className="w-3 h-3 mr-1" />
                {track.emotion}
              </Badge>
            )}
          </motion.div>

          {/* Lyrics */}
          <AnimatePresence>
            {showLyrics && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-12 text-center max-w-2xl px-8"
              >
                <div className="space-y-4">
                  {lyrics.slice(Math.max(0, currentLyricIndex - 1), currentLyricIndex + 3).map((line, i) => {
                    const isActive = i === Math.min(1, currentLyricIndex);
                    return (
                      <motion.p
                        key={line.time}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isActive ? 1 : 0.4, y: 0, scale: isActive ? 1.1 : 1 }}
                        className={`text-xl transition-all ${
                          isActive ? 'text-white font-medium' : 'text-white/50'
                        }`}
                      >
                        {line.text}
                      </motion.p>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls Overlay */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="absolute top-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-6 w-6" />
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowLyrics(!showLyrics)}
                    className={`text-white hover:bg-white/10 ${showLyrics ? 'bg-white/10' : ''}`}
                  >
                    <Mic2 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleFavorite}
                    disabled={favoritesLoading}
                    className={`hover:bg-white/10 ${isLiked ? 'text-pink-500' : 'text-white'}`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Bottom Controls */}
              <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-auto">
              {/* Progress Bar - Seekable */}
                <div className="mb-4 space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => {
                      const progressPercent = Number(e.target.value);
                      // Convert progress % to seconds
                      const seekTimeSeconds = (progressPercent / 100) * (track?.duration || 0);
                      onSeek?.(seekTimeSeconds);
                    }}
                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(track.duration || 0)}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newMuted = !isMuted;
                        setIsMuted(newMuted);
                        onVolumeChange?.(newMuted ? 0 : localVolume);
                      }}
                      className="text-white hover:bg-white/10"
                    >
                      {isMuted || localVolume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={isMuted ? 0 : localVolume}
                      onChange={(e) => {
                        const newVol = Number(e.target.value);
                        setLocalVolume(newVol);
                        setIsMuted(newVol === 0);
                        onVolumeChange?.(newVol);
                      }}
                      className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onPrevious}
                    className="text-white hover:bg-white/10"
                  >
                    <SkipBack className="h-6 w-6" />
                  </Button>

                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      size="lg"
                      onClick={handlePlayPause}
                      className="h-16 w-16 rounded-full bg-white text-black hover:bg-white/90"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8 ml-1" />
                      )}
                    </Button>
                  </motion.div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onNext}
                    className="text-white hover:bg-white/10"
                  >
                    <SkipForward className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImmersiveMode;
