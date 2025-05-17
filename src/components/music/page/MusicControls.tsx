
import React from 'react';
import { Button } from '@/components/ui/button';
import { MusicControlsProps } from '@/types/music';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  shuffleMode,
  repeatMode,
  onToggleShuffle,
  onToggleRepeat,
  onPlay,
  onPause,
  currentTime,
  duration,
  onSeek,
  volume,
  isMuted,
  onToggleMute,
  onVolumeChange,
  track,
  showVolume,
  size = 'md',
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

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onPrevious}
        disabled={!onPrevious}
        className={size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'}
      >
        <SkipBack className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      </Button>
      
      <Button
        variant="default"
        size="icon"
        onClick={handleTogglePlay}
        className={`rounded-full ${size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10'}`}
      >
        {isPlaying ? (
          <Pause className={size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} />
        ) : (
          <Play className={`${size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-6 w-6' : 'h-5 w-5'} ml-0.5`} />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={onNext}
        disabled={!onNext}
        className={size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'}
      >
        <SkipForward className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
      </Button>
    </div>
  );
};

export default MusicControls;
