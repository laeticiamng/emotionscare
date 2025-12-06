/**
 * Home Widget Player - Mini-player pour la page d'accueil
 * Compact, responsive, avec contrôles essentiels
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Volume2,
  Music,
  ArrowRight,
  X,
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  mood: string;
  color: string;
  vinylColor: string;
}

interface HomeWidgetPlayerProps {
  currentTrack?: Track;
  isPlaying?: boolean;
  progress?: number;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onExpandClick?: () => void;
  onFavoriteToggle?: (trackId: string) => void;
  isFavorite?: boolean;
  showWidget?: boolean;
  onClose?: () => void;
}

export const HomeWidgetPlayer: React.FC<HomeWidgetPlayerProps> = ({
  currentTrack,
  isPlaying = false,
  progress = 0,
  onPlayPause,
  onNext,
  onPrevious,
  onExpandClick,
  onFavoriteToggle,
  isFavorite = false,
  showWidget = true,
  onClose,
}) => {
  const [displayProgress, setDisplayProgress] = useState(progress);
  const [isDragging, setIsDragging] = useState(false);

  // Animate progress
  useEffect(() => {
    if (!isDragging) {
      setDisplayProgress(progress);
    }
  }, [progress, isDragging]);

  if (!currentTrack || !showWidget) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTime = (displayProgress / 100) * currentTrack.duration;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 right-6 z-50 w-full max-w-sm"
      >
        <Card className="overflow-hidden shadow-2xl">
          {/* Header with Gradient Background */}
          <div
            className="h-20 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${currentTrack.color}dd, ${currentTrack.color}99)`,
            }}
          >
            {/* Animated Background */}
            <motion.div
              animate={{
                opacity: isPlaying ? [0.5, 0.8, 0.5] : 0.3,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 20% 50%, ${currentTrack.color}20 0%, transparent 50%)`,
              }}
            />

            {/* Close Button */}
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-2 right-2 h-6 w-6 p-0 text-white hover:bg-white/20 z-10"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Main Content */}
          <CardContent className="p-4 space-y-3">
            {/* Album Art and Info */}
            <div className="flex gap-3">
              {/* Vinyl Visual */}
              <motion.div
                animate={isPlaying ? { rotate: 360 } : {}}
                transition={
                  isPlaying
                    ? { duration: 3, repeat: Infinity, ease: 'linear' }
                    : {}
                }
                className="w-16 h-16 rounded-full flex-shrink-0"
                style={{ background: currentTrack.vinylColor }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Music className="h-4 w-4 text-white" />
                  </div>
                </div>
              </motion.div>

              {/* Track Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm truncate">
                    {currentTrack.title}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {currentTrack.artist}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="w-fit text-xs"
                  style={{
                    backgroundColor: `${currentTrack.color}20`,
                    color: currentTrack.color,
                  }}
                >
                  {currentTrack.mood}
                </Badge>
              </div>

              {/* Favorite Button */}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 flex-shrink-0 mt-1"
                onClick={() => onFavoriteToggle?.(currentTrack.id)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? 'fill-current text-destructive' : ''
                  }`}
                />
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <Progress value={displayProgress} className="h-1.5" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-1">
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={onPrevious}
              >
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                size="sm"
                onClick={onPlayPause}
                className="flex-1 gap-1"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    <span className="text-xs">Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span className="text-xs">Lancer</span>
                  </>
                )}
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={onNext}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            {/* Expand Button */}
            <Button
              size="sm"
              variant="outline"
              onClick={onExpandClick}
              className="w-full gap-2 text-xs h-8"
            >
              <Volume2 className="h-3 w-3" />
              Ouvrir le lecteur complet
              <ArrowRight className="h-3 w-3 ml-auto" />
            </Button>

            {/* Status Indicator */}
            {isPlaying && (
              <motion.div
                className="text-center text-xs text-muted-foreground"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                ♪ En cours de lecture...
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Floating Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <Badge variant="default" className="rounded-full px-2 py-1 text-xs gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Actif
          </Badge>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomeWidgetPlayer;
