
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MiniPlayerProps {
  onExpand: () => void;
  className?: string;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onExpand, className }) => {
  const { currentTrack, isPlaying, play, pause } = useMusic();

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      play(currentTrack);
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className={cn(
      "fixed bottom-4 right-4 bg-card border rounded-lg p-3 shadow-lg z-50",
      "flex items-center gap-3 min-w-[200px]",
      className
    )}>
      <Button
        size="icon"
        variant="ghost"
        onClick={handlePlayPause}
        className="h-8 w-8"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      <div className="flex-1 min-w-0" onClick={onExpand}>
        <p className="text-sm font-medium truncate">{currentTrack.title}</p>
        <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
      </div>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={onExpand}
        className="h-6 w-6"
      >
        <Volume2 className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default MiniPlayer;
