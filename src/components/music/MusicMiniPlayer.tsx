
import React from 'react';
import { useMusicContext } from '@/contexts/MusicContext';
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
    resume,
    next,
    previous,
    prevTrack, // Utilisation de prevTrack au lieu de previousTrack
    muted,
    toggleMute 
  } = useMusicContext();

  const handlePlayPause = () => {
    if (isPlaying) {
      if (typeof pause === 'function') {
        pause();
      }
    } else {
      if (typeof resume === 'function') {
        resume();
      }
    }
  };

  const handleNext = () => {
    if (typeof next === 'function') {
      next();
    }
  };

  const handlePrevious = () => {
    if (typeof prevTrack === 'function') {
      prevTrack();
    } else if (typeof previous === 'function') {
      previous();
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
        {muted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
        <span className="sr-only">{muted ? 'Activer le son' : 'Couper le son'}</span>
      </Button>

      <div className="hidden sm:block truncate max-w-[120px]">
        <p className="text-xs font-medium truncate">{currentTrack?.title || 'Sans titre'}</p>
        <p className="text-xs text-muted-foreground truncate">
          {currentTrack?.artist || 'Artiste inconnu'}
        </p>
      </div>
    </div>
  );
};

export default MusicMiniPlayer;
