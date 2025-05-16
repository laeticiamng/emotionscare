
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MusicControlsProps } from '@/types/music';
import { Play, Pause, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeX } from 'lucide-react';

const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying = false,
  onPlay,
  onPause,
  onTogglePlay,
  onPrevious,
  onNext,
  currentTime = 0,
  duration = 0,
  onSeek,
  volume = 1,
  isMuted = false,
  onToggleMute,
  onVolumeChange,
  track,
  showVolume = true,
  size = 'md',
  vertical = false,
  className = ''
}) => {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleTogglePlay = () => {
    if (onTogglePlay) {
      onTogglePlay();
    } else if (isPlaying && onPause) {
      onPause();
    } else if (!isPlaying && onPlay) {
      onPlay();
    }
  };
  
  const buttonClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };
  
  const iconClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };
  
  // Volume icon selection based on state
  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className={iconClasses[size]} />;
    if (volume < 0.3) return <Volume className={iconClasses[size]} />;
    if (volume < 0.7) return <Volume1 className={iconClasses[size]} />;
    return <Volume2 className={iconClasses[size]} />;
  };
  
  const containerClasses = vertical
    ? `flex flex-col items-center gap-4 ${className}`
    : `flex items-center gap-4 ${className}`;
  
  return (
    <div className={containerClasses}>
      {/* Playback controls */}
      <div className="flex items-center gap-2">
        {onPrevious && (
          <Button 
            variant="ghost" 
            size="icon" 
            className={buttonClasses[size]}
            onClick={onPrevious}
          >
            <SkipBack className={iconClasses[size]} />
          </Button>
        )}
        
        <Button
          variant={isPlaying ? "secondary" : "default"}
          size="icon"
          className={`${buttonClasses[size]} rounded-full`}
          onClick={handleTogglePlay}
        >
          {isPlaying ? (
            <Pause className={iconClasses[size]} />
          ) : (
            <Play className={iconClasses[size]} />
          )}
        </Button>
        
        {onNext && (
          <Button 
            variant="ghost" 
            size="icon" 
            className={buttonClasses[size]}
            onClick={onNext}
          >
            <SkipForward className={iconClasses[size]} />
          </Button>
        )}
      </div>
      
      {/* Progress slider */}
      {onSeek && (
        <div className={`flex items-center ${vertical ? 'w-full' : 'flex-1'} gap-2`}>
          <span className="text-xs w-8 text-right">{formatTime(currentTime)}</span>
          <Slider 
            value={[currentTime]} 
            max={duration || 1} 
            step={1}
            onValueChange={(values) => onSeek(values[0])} 
            className="flex-1"
          />
          <span className="text-xs w-8">{formatTime(duration)}</span>
        </div>
      )}
      
      {/* Volume control */}
      {showVolume && onVolumeChange && (
        <div className="flex items-center gap-2">
          {onToggleMute && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={onToggleMute}
            >
              <VolumeIcon />
            </Button>
          )}
          <Slider 
            value={[isMuted ? 0 : volume * 100]} 
            max={100} 
            step={1}
            onValueChange={(values) => onVolumeChange(values[0] / 100)} 
            className="w-24"
          />
        </div>
      )}
    </div>
  );
};

export default MusicControls;
