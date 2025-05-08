
import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlayerControlsProps } from '@/types/audio-player';

/**
 * Playback control buttons (play/pause, next/previous)
 */
const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  loadingTrack,
  onPlay,
  onPause,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex items-center gap-2 justify-center">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full" 
        onClick={onPrevious}
      >
        <SkipBack size={18} />
      </Button>
      
      <Button 
        variant="default" 
        size="icon" 
        className="rounded-full h-9 w-9" 
        onClick={isPlaying ? onPause : onPlay}
        disabled={loadingTrack}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full" 
        onClick={onNext}
      >
        <SkipForward size={18} />
      </Button>
    </div>
  );
};

export default PlayerControls;
