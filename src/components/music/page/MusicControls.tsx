
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { MusicTrack, MusicControlsProps } from '@/types/music';
import { formatTime } from '@/utils/formatUtils';

const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onTogglePlay,
  onPrevious,
  onNext,
  volume = 0.5,
  onVolumeChange,
  track,
  currentTrack,
  currentTime = 0,
  duration = 0,
  onSeek,
  isMuted = false,
  onToggleMute
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

  const handleVolumeChange = (value: number[]) => {
    if (onVolumeChange) {
      onVolumeChange(value[0]);
    }
  };

  const displayTrack = currentTrack || track;
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Track info */}
      {displayTrack && (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
            {displayTrack.coverUrl || displayTrack.cover_url || displayTrack.cover ? (
              <img 
                src={displayTrack.coverUrl || displayTrack.cover_url || displayTrack.cover} 
                alt={displayTrack.title} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                <span className="text-lg">♪</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{displayTrack.title}</div>
            <div className="text-sm text-muted-foreground truncate">{displayTrack.artist}</div>
          </div>
        </div>
      )}
      
      {/* Progress bar */}
      {onSeek && (
        <div className="w-full">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={(values) => onSeek(values[0])}
          />
        </div>
      )}
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        {onPrevious && (
          <Button variant="ghost" size="icon" onClick={onPrevious}>
            <SkipBack className="h-5 w-5" />
          </Button>
        )}
        
        <Button 
          className="h-10 w-10 rounded-full" 
          onClick={handleTogglePlay}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        
        {onNext && (
          <Button variant="ghost" size="icon" onClick={onNext}>
            <SkipForward className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      {/* Volume control */}
      {onVolumeChange && (
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={onToggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <Slider
            className="flex-1"
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(values) => handleVolumeChange([values[0] / 100])}
          />
        </div>
      )}
    </div>
  );
};

export default MusicControls;
