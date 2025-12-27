/**
 * Mini Player - Lecteur flottant compact
 * Gestes, animations, contrôles rapides
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, PanInfo, useDragControls } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  X,
  Maximize2,
  Heart,
  Music,
  Repeat,
  Shuffle,
} from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { useToast } from '@/hooks/use-toast';

interface MiniPlayerProps {
  track?: MusicTrack;
  isPlaying?: boolean;
  progress?: number;
  volume?: number;
  isVisible?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  onSeek?: (position: number) => void;
  onExpand?: () => void;
  onClose?: () => void;
  onToggleLike?: () => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  track,
  isPlaying = false,
  progress = 0,
  volume = 80,
  isVisible = true,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
  onSeek,
  onExpand,
  onClose,
  onToggleLike,
}) => {
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.();
    } else {
      onPlay?.();
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    onVolumeChange?.(isMuted ? volume : 0);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onToggleLike?.();
    toast({
      title: isLiked ? '💔 Retiré des favoris' : '❤️ Ajouté aux favoris',
      duration: 1000,
    });
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    
    // Snap to edges
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let newX = position.x + info.offset.x;
    let newY = position.y + info.offset.y;

    // Snap to right edge if closer
    if (rect.right + info.offset.x > windowWidth - 100) {
      newX = windowWidth - rect.width - 20;
    }

    // Keep in bounds
    newX = Math.max(-rect.left + 20, Math.min(newX, windowWidth - rect.width - 20));
    newY = Math.max(-rect.top + 80, Math.min(newY, windowHeight - rect.height - 20));

    setPosition({ x: newX, y: newY });
  };

  // Swipe gestures
  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (direction === 'left') {
      onNext?.();
      toast({ title: '⏭️ Suivant', duration: 500 });
    } else if (direction === 'right') {
      onPrevious?.();
      toast({ title: '⏮️ Précédent', duration: 500 });
    } else if (direction === 'up') {
      onExpand?.();
    }
  };

  if (!track) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            y: 0, 
            scale: 1,
            x: position.x,
          }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          drag
          dragControls={dragControls}
          dragConstraints={{ left: -200, right: 200, top: -100, bottom: 100 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
          className="fixed bottom-4 right-4 z-50"
        >
          <motion.div
            className={`rounded-2xl bg-background/95 backdrop-blur-xl border shadow-2xl overflow-hidden ${
              isDragging ? 'ring-2 ring-primary' : ''
            }`}
            style={{ width: 320 }}
            layout
          >
            {/* Swipe Areas */}
            <motion.div
              className="absolute inset-0 z-10"
              onPanEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 50) {
                  handleSwipe(info.offset.x > 0 ? 'right' : 'left');
                } else if (info.offset.y < -50) {
                  handleSwipe('up');
                }
              }}
            />

            {/* Progress Bar */}
            <div className="h-1 bg-muted relative">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            <div className="p-3">
              <div className="flex items-center gap-3">
                {/* Album Art */}
                <motion.div
                  className="relative h-12 w-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center overflow-hidden flex-shrink-0"
                  animate={{ 
                    rotate: isPlaying ? [0, 360] : 0 
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: isPlaying ? Infinity : 0,
                    ease: 'linear'
                  }}
                >
                  {track.coverUrl ? (
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Music className="h-6 w-6 text-primary" />
                  )}
                  
                  {/* Playing Indicator */}
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="flex gap-0.5">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-0.5 bg-white rounded-full"
                            animate={{ height: [4, 12, 4] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              delay: i * 0.1,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{track.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted-foreground">
                      {formatTime((progress / 100) * (track.duration || 0))}
                    </span>
                    {track.emotion && (
                      <Badge variant="secondary" className="text-[10px] h-4 px-1">
                        {track.emotion}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={onPrevious}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      size="sm"
                      className="h-9 w-9 rounded-full"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4 ml-0.5" />
                      )}
                    </Button>
                  </motion.div>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={onNext}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t">
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`h-7 w-7 p-0 ${isLiked ? 'text-pink-500' : ''}`}
                    onClick={handleLike}
                  >
                    <Heart className={`h-3.5 w-3.5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={handleMuteToggle}
                  >
                    {isMuted ? (
                      <VolumeX className="h-3.5 w-3.5" />
                    ) : (
                      <Volume2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                  >
                    <Shuffle className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                  >
                    <Repeat className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0"
                    onClick={onExpand}
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 hover:text-destructive"
                    onClick={onClose}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Drag Handle Indicator */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-muted-foreground/30" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MiniPlayer;
