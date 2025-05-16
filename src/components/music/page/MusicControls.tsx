
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { MusicTrack } from '@/types/music';

interface MusicControlsProps {
  track: MusicTrack;
  isPlaying: boolean;
  volume: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (value: number) => void;
  progress?: number;
  onSeek?: (position: number) => void;
  duration?: number;
  currentTime?: number;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  track,
  isPlaying,
  volume,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
  progress = 0,
  onSeek,
  duration = 0,
  currentTime = 0
}) => {
  const [isMuted, setIsMuted] = React.useState(false);
  const [internalVolume, setInternalVolume] = React.useState(volume);
  const previousVolume = React.useRef(volume);

  const toggleMute = () => {
    if (isMuted) {
      // Restore previous volume
      setIsMuted(false);
      onVolumeChange(previousVolume.current);
      setInternalVolume(previousVolume.current);
    } else {
      // Mute and store current volume
      previousVolume.current = internalVolume;
      setIsMuted(true);
      onVolumeChange(0);
      setInternalVolume(0);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setInternalVolume(newVolume);
    onVolumeChange(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    if (onSeek) {
      onSeek(value[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center">
        <div className="w-28 h-28 bg-muted rounded-lg overflow-hidden mb-3">
          {(track.cover_url || track.coverUrl || track.cover) ? (
            <img 
              src={track.cover_url || track.coverUrl || track.cover} 
              alt={track.title} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-muted-foreground">
              ♪
            </div>
          )}
        </div>
        <h3 className="font-medium text-center line-clamp-1">{track.title}</h3>
        <p className="text-sm text-muted-foreground text-center line-clamp-1 mb-4">
          {track.artist}
        </p>
      </div>
      
      {/* Progress bar */}
      <div className="space-y-1">
        <Slider
          value={[progress]}
          max={duration}
          step={1}
          onValueChange={handleSeek}
          className="mb-1"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <Button variant="ghost" size="icon" onClick={onPrevious}>
          <SkipBack className="h-5 w-5" />
        </Button>
        <Button
          className="h-10 w-10 rounded-full"
          onClick={isPlaying ? onPause : onPlay}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}
        </Button>
        <Button variant="ghost" size="icon" onClick={onNext}>
          <SkipForward className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Volume */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleMute}>
          {isMuted || internalVolume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          value={[internalVolume]}
          max={100}
          step={1}
          onValueChange={handleVolumeChange}
          className="flex-1"
        />
        <span className="text-xs text-muted-foreground w-8 text-right">
          {Math.round(internalVolume)}%
        </span>
      </div>
    </div>
  );
};

export default MusicControls;
