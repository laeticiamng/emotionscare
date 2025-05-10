
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-react';

interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  progress?: number;
  duration?: number;
  onProgressChange?: (value: number) => void;
  repeat?: boolean;
  shuffle?: boolean;
  onToggleRepeat?: () => void;
  onToggleShuffle?: () => void;
  className?: string;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
  volume = 0.5,
  progress = 0,
  duration = 0,
  onProgressChange,
  repeat = false,
  shuffle = false,
  onToggleRepeat,
  onToggleShuffle,
  className = ''
}) => {
  const handleVolumeChange = (values: number[]) => {
    if (onVolumeChange && values.length > 0) {
      onVolumeChange(values[0] / 100);
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Playback progress */}
      {duration > 0 && (
        <div className="space-y-1">
          <Slider
            value={[progress]}
            max={duration}
            step={1}
            onValueChange={onProgressChange ? (values) => onProgressChange(values[0]) : undefined}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}
      
      {/* Playback controls */}
      <div className="flex items-center justify-center gap-4">
        {onToggleShuffle && (
          <Button
            variant="ghost" 
            size="sm"
            onClick={onToggleShuffle}
            className={shuffle ? "text-primary" : "text-muted-foreground"}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
        )}
        
        {onPrevious && (
          <Button
            variant="ghost" 
            size="icon"
            onClick={onPrevious}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
        )}
        
        <Button
          size="icon"
          variant="outline"
          onClick={isPlaying ? onPause : onPlay}
          className="h-10 w-10 rounded-full"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        {onNext && (
          <Button
            variant="ghost" 
            size="icon"
            onClick={onNext}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        )}
        
        {onToggleRepeat && (
          <Button
            variant="ghost" 
            size="sm"
            onClick={onToggleRepeat}
            className={repeat ? "text-primary" : "text-muted-foreground"}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Volume control */}
      {onVolumeChange && (
        <div className="flex items-center gap-2 mt-2">
          <Button variant="ghost" size="sm" className="p-1">
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      )}
    </div>
  );
};

export default MusicControls;
