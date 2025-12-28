import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1, Volume2, VolumeX } from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { cn } from '@/lib/utils';

export interface MusicControlsProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onTogglePlay?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  shuffleMode?: boolean;
  repeatMode?: 'none' | 'one' | 'all';
  onToggleShuffle?: () => void;
  onToggleRepeat?: () => void;
  currentTime?: number;
  duration?: number;
  onSeek?: (time: number) => void;
  volume?: number;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onVolumeChange?: (volume: number) => void;
  track?: MusicTrack;
  showVolume?: boolean;
  size?: 'sm' | 'md' | 'lg';
  vertical?: boolean;
  className?: string;
  progress?: number;
}

const formatTime = (seconds: number): string => {
  if (!seconds || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying = false,
  onPlay,
  onPause,
  onTogglePlay,
  onNext,
  onPrevious,
  shuffleMode = false,
  repeatMode = 'none',
  onToggleShuffle,
  onToggleRepeat,
  currentTime = 0,
  duration = 0,
  onSeek,
  volume = 0.7,
  isMuted = false,
  onToggleMute,
  onVolumeChange,
  track,
  showVolume = false,
  size = 'md',
  vertical = false,
  className = '',
}) => {
  const handleTogglePlay = () => {
    if (onTogglePlay) {
      onTogglePlay();
    } else if (isPlaying && onPause) {
      onPause();
    } else if (!isPlaying && onPlay) {
      onPlay();
    }
  };

  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5';
  const buttonSize = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      {/* Shuffle button */}
      {onToggleShuffle && (
        <Button
          variant={shuffleMode ? 'default' : 'ghost'}
          size="icon"
          onClick={onToggleShuffle}
          className={cn(size === 'sm' ? 'h-7 w-7' : 'h-8 w-8')}
          aria-label={shuffleMode ? 'Désactiver lecture aléatoire' : 'Activer lecture aléatoire'}
        >
          <Shuffle className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4', shuffleMode && 'text-primary-foreground')} />
        </Button>
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={!onPrevious}
        className={buttonSize}
        aria-label="Piste précédente"
      >
        <SkipBack className={iconSize} />
      </Button>
      
      <Button
        variant="default"
        size="icon"
        onClick={handleTogglePlay}
        className={cn('rounded-full', buttonSize)}
        aria-label={isPlaying ? "Pause" : "Lecture"}
      >
        {isPlaying ? (
          <Pause className={iconSize} />
        ) : (
          <Play className={cn(iconSize, 'ml-0.5')} />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={!onNext}
        className={buttonSize}
        aria-label="Piste suivante"
      >
        <SkipForward className={iconSize} />
      </Button>

      {/* Repeat button */}
      {onToggleRepeat && (
        <Button
          variant={repeatMode !== 'none' ? 'default' : 'ghost'}
          size="icon"
          onClick={onToggleRepeat}
          className={cn(size === 'sm' ? 'h-7 w-7' : 'h-8 w-8')}
          aria-label={`Mode répétition: ${repeatMode}`}
        >
          {repeatMode === 'one' ? (
            <Repeat1 className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
          ) : (
            <Repeat className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4', repeatMode === 'all' && 'text-primary-foreground')} />
          )}
        </Button>
      )}

      {/* Volume control */}
      {showVolume && onVolumeChange && (
        <div className="flex items-center gap-2 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            className={cn(size === 'sm' ? 'h-7 w-7' : 'h-8 w-8')}
            aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
            ) : (
              <Volume2 className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : (volume ?? 0.7)]}
            onValueChange={(v) => onVolumeChange(v[0])}
            max={1}
            step={0.01}
            className="w-20"
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
};

export default MusicControls;
