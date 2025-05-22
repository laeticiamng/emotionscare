
import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, VolumeX, Volume2, SkipBack, SkipForward, Repeat, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AudioControlsProps {
  className?: string;
  minimal?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  onSeek?: (position: number) => void;
  duration?: number;
  currentTime?: number;
  isPlaying?: boolean;
  volume?: number;
  showProgress?: boolean;
  trackTitle?: string;
  artist?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({ 
  className, 
  minimal = false,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
  onSeek,
  duration = 0,
  currentTime = 0,
  isPlaying: externalIsPlaying,
  volume: externalVolume,
  showProgress = !minimal,
  trackTitle,
  artist
}) => {
  // State is controlled by props if provided, otherwise managed internally
  const [isPlaying, setIsPlaying] = useState(externalIsPlaying || false);
  const [volume, setVolume] = useState(externalVolume !== undefined ? externalVolume : 70);
  const [isMuted, setIsMuted] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  // Update internal state when props change
  useEffect(() => {
    if (externalIsPlaying !== undefined) {
      setIsPlaying(externalIsPlaying);
    }
  }, [externalIsPlaying]);

  useEffect(() => {
    if (externalVolume !== undefined) {
      setVolume(externalVolume);
    }
  }, [externalVolume]);

  // Toggle play/pause
  const togglePlayback = useCallback(() => {
    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);
    
    // Call external handlers if provided
    if (newIsPlaying) {
      onPlay && onPlay();
    } else {
      onPause && onPause();
    }
  }, [isPlaying, onPlay, onPause]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    
    // If unmuting, restore previous volume, otherwise set to 0
    if (isMuted) {
      onVolumeChange && onVolumeChange(volume);
    } else {
      onVolumeChange && onVolumeChange(0);
    }
  }, [isMuted, volume, onVolumeChange]);

  // Handle volume change
  const handleVolumeChange = useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    
    onVolumeChange && onVolumeChange(newVolume);
  }, [isMuted, onVolumeChange]);

  // Format time for display
  const formatTime = useCallback((timeInSeconds: number): string => {
    if (isNaN(timeInSeconds)) return "0:00";
    
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // Handle seeking
  const handleSeek = useCallback((value: number[]) => {
    onSeek && onSeek(value[0]);
  }, [onSeek]);

  // Minimal view for compact displays
  if (minimal) {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={togglePlayback}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
      </div>
    );
  }

  // Full view with all controls
  return (
    <div className={cn("flex flex-col w-full space-y-2", className)}>
      {/* Track info */}
      {(trackTitle || artist) && (
        <div className="text-sm">
          {trackTitle && <div className="font-medium truncate">{trackTitle}</div>}
          {artist && <div className="text-xs text-muted-foreground truncate">{artist}</div>}
        </div>
      )}
      
      {/* Progress bar */}
      {showProgress && (
        <div className="flex items-center space-x-2 w-full">
          <span className="text-xs text-muted-foreground w-10 text-right">
            {formatTime(currentTime)}
          </span>
          
          <Slider
            value={[currentTime]}
            min={0}
            max={Math.max(duration, 1)} // Prevent division by zero
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          
          <span className="text-xs text-muted-foreground w-10">
            {formatTime(duration)}
          </span>
        </div>
      )}
      
      {/* Control buttons */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full"
                  onClick={() => setShuffle(!shuffle)}
                >
                  <Shuffle size={18} className={cn(shuffle ? "text-primary" : "text-muted-foreground")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{shuffle ? "Désactiver la lecture aléatoire" : "Activer la lecture aléatoire"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="flex items-center space-x-2">
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
            className="rounded-full"
            onClick={togglePlayback}
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
        
        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full"
                  onClick={() => setRepeat(!repeat)}
                >
                  <Repeat size={18} className={cn(repeat ? "text-primary" : "text-muted-foreground")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{repeat ? "Désactiver la répétition" : "Activer la répétition"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </Button>
          
          <Slider
            min={0}
            max={100}
            step={1}
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioControls;
