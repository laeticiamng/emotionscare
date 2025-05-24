
import React from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface MiniPlayerProps {
  onExpand?: () => void;
  className?: string;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onExpand, className = '' }) => {
  const { 
    currentTrack, 
    isPlaying, 
    play, 
    pause, 
    next, 
    previous, 
    volume, 
    setVolume 
  } = useMusic();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      play(currentTrack);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setVolume(0);
    } else {
      setVolume(0.8);
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div 
      className={`fixed bottom-4 right-4 bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg ${className}`}
    >
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          className="h-8 w-8"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={previous}
          className="h-8 w-8"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={next}
          className="h-8 w-8"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="h-8 w-8"
        >
          {volume === 0 ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>

        <div className="hidden sm:block text-xs max-w-[100px]">
          <p className="font-medium truncate">{currentTrack.title}</p>
          <p className="text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
