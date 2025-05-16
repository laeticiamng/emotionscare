
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export interface PlayerControlsProps {
  isPlaying: boolean;
  loadingTrack?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  loadingTrack = false,
  onPlay,
  onPause,
  onPrevious,
  onNext,
  size = 'md'
}) => {
  const buttonSize = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  }[size];
  
  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }[size];
  
  return (
    <div className="flex items-center justify-center gap-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onPrevious}
        disabled={loadingTrack}
        className={buttonSize}
      >
        <SkipBack className={iconSize} />
      </Button>
      
      {isPlaying ? (
        <Button 
          variant="default" 
          size="icon"
          onClick={onPause}
          disabled={loadingTrack}
          className={buttonSize}
        >
          <Pause className={iconSize} />
        </Button>
      ) : (
        <Button 
          variant="default" 
          size="icon"
          onClick={onPlay}
          disabled={loadingTrack}
          className={buttonSize}
        >
          <Play className={iconSize} />
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onNext}
        disabled={loadingTrack}
        className={buttonSize}
      >
        <SkipForward className={iconSize} />
      </Button>
    </div>
  );
};

export default PlayerControls;
