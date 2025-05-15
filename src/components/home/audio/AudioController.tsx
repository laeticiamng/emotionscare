
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Play, Pause, SkipBack, SkipForward, Volume1, VolumeX } from 'lucide-react';

interface AudioControllerProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
  showVolumeControl?: boolean;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  volume,
  onVolumeChange,
  className = '',
  showVolumeControl = true,
}) => {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {onPrevious && (
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={onPrevious}
          aria-label="Précédent"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-8 h-8 p-0"
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause" : "Lecture"}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      {onNext && (
        <Button
          variant="ghost"
          size="sm"
          className="w-8 h-8 p-0"
          onClick={onNext}
          aria-label="Suivant"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      )}

      {showVolumeControl && (
        <div className="flex items-center gap-2">
          <VolumeIcon className="h-4 w-4 text-muted-foreground" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-20 h-1.5 bg-muted rounded-full appearance-none"
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
};

export default AudioController;
