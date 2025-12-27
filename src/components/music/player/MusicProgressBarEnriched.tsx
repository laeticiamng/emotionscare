import React, { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Repeat, Shuffle, Heart, Share2, ListMusic, Maximize2,
  ChevronDown, ChevronUp
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

export interface MusicProgressBarEnrichedProps {
  // Playback state
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  volume?: number;
  isMuted?: boolean;
  isShuffled?: boolean;
  repeatMode?: 'none' | 'one' | 'all';
  
  // Track info
  trackTitle?: string;
  trackArtist?: string;
  trackCover?: string;
  
  // Callbacks
  onSeek?: (time: number) => void;
  onPlayPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: () => void;
  onShuffleToggle?: () => void;
  onRepeatToggle?: () => void;
  onLike?: () => void;
  onShare?: () => void;
  onQueueOpen?: () => void;
  onFullscreen?: () => void;
  
  // UI options
  showTimestamps?: boolean;
  showControls?: boolean;
  showVolumeControl?: boolean;
  showTrackInfo?: boolean;
  showExtraActions?: boolean;
  variant?: 'minimal' | 'default' | 'full';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  
  // State
  isLiked?: boolean;
  hasQueue?: boolean;
}

// ─────────────────────────────────────────────────────────────
// UTILITY FUNCTIONS
// ─────────────────────────────────────────────────────────────

const formatTime = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatTimeVerbose = (seconds: number): string => {
  if (isNaN(seconds) || !isFinite(seconds)) return '0 min';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins === 0) return `${secs}s`;
  return `${mins}min ${secs}s`;
};

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

const MusicProgressBarEnriched: React.FC<MusicProgressBarEnrichedProps> = ({
  currentTime = 0,
  duration = 0,
  isPlaying = false,
  volume = 100,
  isMuted = false,
  isShuffled = false,
  repeatMode = 'none',
  trackTitle,
  trackArtist,
  trackCover,
  onSeek,
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeChange,
  onMuteToggle,
  onShuffleToggle,
  onRepeatToggle,
  onLike,
  onShare,
  onQueueOpen,
  onFullscreen,
  showTimestamps = true,
  showControls = true,
  showVolumeControl = true,
  showTrackInfo = false,
  showExtraActions = false,
  variant = 'default',
  size = 'md',
  className,
  isLiked = false,
  hasQueue = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const remaining = duration - currentTime;

  // Handle progress bar click/drag
  const handleProgressInteraction = useCallback((clientX: number) => {
    if (!progressRef.current || !onSeek) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = percent * duration;
    
    onSeek(newTime);
  }, [duration, onSeek]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleProgressInteraction(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      handleProgressInteraction(e.clientX);
    }
    
    // Update hover time
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverTime(percent * duration);
    }
  }, [isDragging, duration, handleProgressInteraction]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseLeave = () => {
    setHoverTime(null);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Size classes
  const sizeClasses = {
    sm: { bar: 'h-1', thumb: 'w-2 h-2', text: 'text-xs', icon: 'h-3 w-3', button: 'h-6 w-6' },
    md: { bar: 'h-1.5', thumb: 'w-3 h-3', text: 'text-sm', icon: 'h-4 w-4', button: 'h-8 w-8' },
    lg: { bar: 'h-2', thumb: 'w-4 h-4', text: 'text-base', icon: 'h-5 w-5', button: 'h-10 w-10' },
  };

  const sizes = sizeClasses[size];

  // Repeat icon based on mode
  const RepeatIcon = () => {
    if (repeatMode === 'one') {
      return <span className="relative"><Repeat className={sizes.icon} /><span className="absolute -top-0.5 -right-0.5 text-[8px] font-bold">1</span></span>;
    }
    return <Repeat className={sizes.icon} />;
  };

  // Minimal variant
  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        {showTimestamps && (
          <span className={cn('text-muted-foreground tabular-nums', sizes.text)}>
            {formatTime(currentTime)}
          </span>
        )}
        <div 
          ref={progressRef}
          className={cn('flex-1 bg-muted rounded-full cursor-pointer relative group', sizes.bar)}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          <div 
            className={cn(
              'absolute top-1/2 -translate-y-1/2 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity',
              sizes.thumb
            )}
            style={{ left: `calc(${progress}% - ${parseInt(sizes.thumb.split(' ')[0].replace('w-', '')) * 2}px)` }}
          />
        </div>
        {showTimestamps && (
          <span className={cn('text-muted-foreground tabular-nums', sizes.text)}>
            {formatTime(duration)}
          </span>
        )}
      </div>
    );
  }

  // Full variant
  if (variant === 'full') {
    return (
      <div className={cn('rounded-xl bg-card/80 backdrop-blur-lg border p-4 space-y-4', className)}>
        {/* Track info */}
        {showTrackInfo && (
          <div className="flex items-center gap-3">
            {trackCover && (
              <img 
                src={trackCover} 
                alt={trackTitle} 
                className="w-12 h-12 rounded-lg object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium truncate">{trackTitle || 'Untitled'}</h4>
              <p className="text-sm text-muted-foreground truncate">{trackArtist || 'Unknown Artist'}</p>
            </div>
            {showExtraActions && (
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(sizes.button, isLiked && 'text-red-500')}
                  onClick={onLike}
                >
                  <Heart className={cn(sizes.icon, isLiked && 'fill-current')} />
                </Button>
                <Button variant="ghost" size="icon" className={sizes.button} onClick={onShare}>
                  <Share2 className={sizes.icon} />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Progress bar with hover tooltip */}
        <TooltipProvider>
          <div className="space-y-1">
            <div 
              ref={progressRef}
              className={cn(
                'relative bg-muted rounded-full cursor-pointer group',
                sizes.bar
              )}
              onMouseDown={handleMouseDown}
              onMouseMove={(e) => {
                const rect = progressRef.current?.getBoundingClientRect();
                if (rect) {
                  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  setHoverTime(percent * duration);
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              {/* Buffered indicator (placeholder) */}
              <div 
                className="absolute inset-y-0 left-0 bg-muted-foreground/20 rounded-full"
                style={{ width: `${Math.min(progress + 20, 100)}%` }}
              />
              
              {/* Progress */}
              <div 
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
              
              {/* Hover preview */}
              {hoverTime !== null && (
                <div 
                  className="absolute -top-8 transform -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs shadow-lg"
                  style={{ left: `${(hoverTime / duration) * 100}%` }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
              
              {/* Thumb */}
              <div 
                className={cn(
                  'absolute top-1/2 -translate-y-1/2 bg-primary rounded-full shadow-lg transition-transform',
                  'opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100',
                  isDragging && 'opacity-100 scale-100',
                  sizes.thumb
                )}
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            </div>
            
            {/* Time display */}
            {showTimestamps && (
              <div className="flex justify-between">
                <span className={cn('text-muted-foreground tabular-nums', sizes.text)}>
                  {formatTime(currentTime)}
                </span>
                <span className={cn('text-muted-foreground tabular-nums', sizes.text)}>
                  -{formatTime(remaining)}
                </span>
              </div>
            )}
          </div>
        </TooltipProvider>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-between">
            {/* Left actions */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(sizes.button, isShuffled && 'text-primary')}
                onClick={onShuffleToggle}
              >
                <Shuffle className={sizes.icon} />
              </Button>
            </div>

            {/* Center controls */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className={sizes.button} onClick={onPrevious}>
                <SkipBack className={sizes.icon} />
              </Button>
              
              <Button 
                variant="default" 
                size="icon" 
                className={cn('rounded-full', size === 'lg' ? 'h-12 w-12' : size === 'md' ? 'h-10 w-10' : 'h-8 w-8')}
                onClick={onPlayPause}
              >
                {isPlaying ? (
                  <Pause className={size === 'lg' ? 'h-6 w-6' : sizes.icon} />
                ) : (
                  <Play className={cn(size === 'lg' ? 'h-6 w-6' : sizes.icon, 'ml-0.5')} />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" className={sizes.button} onClick={onNext}>
                <SkipForward className={sizes.icon} />
              </Button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(sizes.button, repeatMode !== 'none' && 'text-primary')}
                onClick={onRepeatToggle}
              >
                <RepeatIcon />
              </Button>
            </div>
          </div>
        )}

        {/* Volume & extra controls */}
        {(showVolumeControl || showExtraActions) && (
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            {/* Volume */}
            {showVolumeControl && (
              <div className="flex items-center gap-2 w-32">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={sizes.button}
                  onClick={onMuteToggle}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className={sizes.icon} />
                  ) : (
                    <Volume2 className={sizes.icon} />
                  )}
                </Button>
                <Slider
                  value={[isMuted ? 0 : volume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([v]) => onVolumeChange?.(v)}
                  className="flex-1"
                />
              </div>
            )}

            {/* Extra actions */}
            {showExtraActions && (
              <div className="flex items-center gap-1">
                {hasQueue && (
                  <Button variant="ghost" size="icon" className={sizes.button} onClick={onQueueOpen}>
                    <ListMusic className={sizes.icon} />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className={sizes.button} onClick={onFullscreen}>
                  <Maximize2 className={sizes.icon} />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('space-y-2', className)}>
      {/* Expandable header */}
      {showTrackInfo && (
        <div 
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {trackCover && (
            <img 
              src={trackCover} 
              alt={trackTitle} 
              className="w-10 h-10 rounded object-cover"
            />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{trackTitle || 'Untitled'}</h4>
            <p className="text-xs text-muted-foreground truncate">{trackArtist}</p>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      )}

      {/* Progress bar */}
      <div className="flex items-center gap-2">
        {showTimestamps && (
          <span className={cn('text-muted-foreground tabular-nums min-w-[40px]', sizes.text)}>
            {formatTime(currentTime)}
          </span>
        )}
        
        <div 
          ref={progressRef}
          className={cn(
            'flex-1 bg-muted rounded-full cursor-pointer relative group',
            sizes.bar
          )}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
          <div 
            className={cn(
              'absolute top-1/2 -translate-y-1/2 bg-primary rounded-full shadow',
              'opacity-0 group-hover:opacity-100 transition-opacity',
              sizes.thumb
            )}
            style={{ left: `calc(${progress}% - 6px)` }}
          />
        </div>
        
        {showTimestamps && (
          <span className={cn('text-muted-foreground tabular-nums min-w-[40px] text-right', sizes.text)}>
            {formatTime(duration)}
          </span>
        )}
      </div>

      {/* Controls row */}
      {showControls && (
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon" className={sizes.button} onClick={onPrevious}>
            <SkipBack className={sizes.icon} />
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full h-10 w-10"
            onClick={onPlayPause}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button variant="ghost" size="icon" className={sizes.button} onClick={onNext}>
            <SkipForward className={sizes.icon} />
          </Button>
        </div>
      )}

      {/* Expanded controls */}
      {isExpanded && (
        <div className="flex items-center justify-between pt-2 border-t border-border/50 animate-fade-in">
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn('h-7 w-7', isShuffled && 'text-primary')}
              onClick={onShuffleToggle}
            >
              <Shuffle className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn('h-7 w-7', repeatMode !== 'none' && 'text-primary')}
              onClick={onRepeatToggle}
            >
              <RepeatIcon />
            </Button>
          </div>
          
          {showVolumeControl && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7"
                onClick={onMuteToggle}
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={100}
                step={1}
                onValueChange={([v]) => onVolumeChange?.(v)}
                className="w-20"
              />
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn('h-7 w-7', isLiked && 'text-red-500')}
              onClick={onLike}
            >
              <Heart className={cn('h-3.5 w-3.5', isLiked && 'fill-current')} />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onShare}>
              <Share2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MusicProgressBarEnriched;
