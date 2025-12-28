import React from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MusicMiniPlayerProps {
  className?: string;
}

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MusicMiniPlayer: React.FC<MusicMiniPlayerProps> = ({ className }) => {
  const { 
    state, 
    pause, 
    play,
    next,
    previous,
    setVolume,
    seek 
  } = useMusic();

  const { currentTrack, isPlaying, volume, currentTime, duration, progress } = state;

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

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    seek(percent * duration);
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

      <div className="hidden sm:flex items-center gap-2 flex-1 min-w-0">
        <div className="truncate max-w-[100px]">
          <p className="text-xs font-medium truncate">{currentTrack.title || 'Sans titre'}</p>
          <p className="text-xs text-muted-foreground truncate">
            {currentTrack.artist || 'Artiste inconnu'}
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="flex items-center gap-1 flex-1 min-w-[80px]">
          <span className="text-[10px] text-muted-foreground w-8 text-right">
            {formatTime(currentTime)}
          </span>
          <div 
            className="flex-1 cursor-pointer" 
            onClick={handleProgressClick}
            role="slider"
            aria-label="Progression"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <Progress value={progress} className="h-1" />
          </div>
          <span className="text-[10px] text-muted-foreground w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MusicMiniPlayer;
