
import React from 'react';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/MusicContext';
import { Play, Pause, SkipBack, SkipForward, Volume, VolumeX } from 'lucide-react';

interface MusicControlsProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MusicControls: React.FC<MusicControlsProps> = ({ size = 'md', className = '' }) => {
  const { 
    isPlaying, 
    currentTrack, 
    togglePlay, 
    nextTrack, 
    previousTrack,
    volume,
    muted,
    toggleMute
  } = useMusic();
  
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
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className={buttonSize}
        onClick={previousTrack}
        disabled={!currentTrack}
      >
        <SkipBack className={iconSize} />
      </Button>
      
      <Button
        variant={isPlaying ? "secondary" : "default"}
        size="icon"
        className={`${buttonSize} rounded-full`}
        onClick={togglePlay}
        disabled={!currentTrack}
      >
        {isPlaying ? (
          <Pause className={iconSize} />
        ) : (
          <Play className={iconSize} />
        )}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className={buttonSize}
        onClick={nextTrack}
        disabled={!currentTrack}
      >
        <SkipForward className={iconSize} />
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8"
        onClick={toggleMute}
      >
        {muted || volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default MusicControls;
