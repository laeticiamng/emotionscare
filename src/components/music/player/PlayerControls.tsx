// @ts-nocheck

import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

export interface PlayerControlsProps {
  isPlaying: boolean;
  loadingTrack?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  loadingTrack = false,
  onPlay,
  onPause,
  onPrevious,
  onNext
}) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onPrevious}
        disabled={loadingTrack}
        className="h-8 w-8"
        aria-label="Piste précédente"
      >
        <SkipBack className="h-4 w-4" />
      </Button>
      
      {isPlaying ? (
        <Button 
          variant="default" 
          size="icon"
          onClick={onPause}
          disabled={loadingTrack}
          className="h-10 w-10"
          aria-label="Mettre en pause"
        >
          <Pause className="h-5 w-5" />
        </Button>
      ) : (
        <Button 
          variant="default" 
          size="icon"
          onClick={onPlay}
          disabled={loadingTrack}
          className="h-10 w-10"
          aria-label="Lire"
        >
          <Play className="h-5 w-5" />
        </Button>
      )}
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={onNext}
        disabled={loadingTrack}
        className="h-8 w-8"
        aria-label="Piste suivante"
      >
        <SkipForward className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PlayerControls;
