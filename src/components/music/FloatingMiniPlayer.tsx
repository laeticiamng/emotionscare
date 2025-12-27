/**
 * Floating Mini Player - Player audio flottant
 * Affiche en permanence la chanson en cours sur la page
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  X,
  Maximize2,
  Volume2,
  Sparkles,
} from 'lucide-react';
import type { MusicTrack } from '@/types/music';

interface FloatingMiniPlayerProps {
  currentTrack?: MusicTrack | null;
  isPlaying?: boolean;
  progress?: number;
  duration?: number;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onExpand?: () => void;
  onClose?: () => void;
  onImmersive?: () => void;
  onSeek?: (position: number) => void;
  isDocked?: boolean;
}

export const FloatingMiniPlayer: React.FC<FloatingMiniPlayerProps> = ({
  currentTrack,
  isPlaying = false,
  progress = 0,
  duration,
  onPlayPause,
  onNext,
  onPrevious,
  onExpand,
  onClose,
  onImmersive,
  onSeek,
  isDocked = false,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  if (!currentTrack) {
    return null;
  }

  // Fallback values for optional properties
  const vinylColor = currentTrack.vinylColor || 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary-foreground)))';
  const trackColor = currentTrack.color || 'hsl(var(--primary)), hsl(var(--accent))';

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (progress / 100) * (currentTrack.duration || 180);

  return (
    <AnimatePresence>
      {!isDocked && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 right-6 z-40 max-w-sm"
        >
          {isMinimized ? (
            /* Minimized State */
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="flex items-center gap-3 p-3 rounded-full bg-card/95 backdrop-blur-md border shadow-lg cursor-pointer hover:shadow-xl transition-all"
              onClick={() => setIsMinimized(false)}
            >
              {/* Vinyl Animation */}
              <motion.div
                animate={{ rotate: isPlaying ? 360 : 0 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-full flex-shrink-0 relative"
                style={{ background: vinylColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-card" />
                </div>
              </motion.div>

              {/* Info */}
              <div className="hidden sm:block min-w-0">
                <p className="text-xs font-medium truncate">{currentTrack.title}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentTrack.artist}
                </p>
              </div>

              {/* Expand Button */}
              <Button
                size="sm"
                variant="ghost"
                className="p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand?.();
                }}
              >
                <Maximize2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            /* Full State */
            <Card className="overflow-hidden shadow-2xl">
              {/* Header with Gradient */}
              <div
                className="h-24 relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${trackColor})`,
                }}
              >
                {/* Vinyl Disc - Large */}
                <motion.div
                  animate={{ rotate: isPlaying ? 360 : 0 }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20 border-4 border-white"
                  style={{ background: vinylColor }}
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                {/* Track Info */}
                <div className="space-y-1">
                  <h3 className="font-semibold truncate">{currentTrack.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentTrack.artist}
                  </p>
                  <div className="text-xs text-muted-foreground">
                    Mood: {currentTrack.mood}
                  </div>
                </div>

                {/* Progress Bar - Interactive Seekbar */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={progress}
                    onChange={(e) => onSeek?.(Number(e.target.value))}
                    className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                    aria-label="Progression de lecture"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration || currentTrack.duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onPrevious}
                    className="h-8 w-8 p-0"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    onClick={onPlayPause}
                    className="flex-1 gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Lancer
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onNext}
                    className="h-8 w-8 p-0"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={onExpand}
                  >
                    <Maximize2 className="h-4 w-4" />
                    Agrandir
                  </Button>

                  <Button
                    size="sm"
                    variant="secondary"
                    className="gap-1"
                    onClick={onImmersive}
                    title="Mode immersif"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsMinimized(true)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingMiniPlayer;
