// @ts-nocheck

import React from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicMiniPlayerProps {
  className?: string;
}

const MusicMiniPlayer: React.FC<MusicMiniPlayerProps> = ({ className }) => {
  const { 
    currentTrack, 
    isPlaying, 
    pause, 
    play,
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

  const handleNext = () => {
    next();
  };

  const handlePrevious = () => {
    previous();
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
    <div className={cn("flex items-center space-x-2", className)}>
      <Button onClick={handlePrevious} size="icon" variant="ghost">
        <SkipBack className="h-4 w-4" />
        <span className="sr-only">Précédent</span>
      </Button>

      <Button onClick={handlePlayPause} size="icon">
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        <span className="sr-only">{isPlaying ? 'Pause' : 'Lecture'}</span>
      </Button>

      <Button onClick={handleNext} size="icon" variant="ghost">
        <SkipForward className="h-4 w-4" />
        <span className="sr-only">Suivant</span>
      </Button>

      <Button onClick={toggleMute} size="icon" variant="ghost">
        {volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        <span className="sr-only">{volume === 0 ? 'Activer le son' : 'Couper le son'}</span>
      </Button>

      <div className="hidden sm:block truncate max-w-[120px]">
        <p className="text-xs font-medium truncate">{currentTrack.title || 'Sans titre'}</p>
        <p className="text-xs text-muted-foreground truncate">
          {currentTrack.artist || 'Artiste inconnu'}
        </p>
      </div>
    </div>
  );
};

export default MusicMiniPlayer;
