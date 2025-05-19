
import React from 'react';
import { useMusic } from '@/contexts/music';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, ChevronUp } from 'lucide-react';

const MusicMiniPlayer: React.FC = () => {
  const { isPlaying, currentTrack, togglePlay, toggleDrawer } = useMusic();

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="bg-background border rounded-full shadow-lg flex items-center p-1 pr-3">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={togglePlay}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4" />
        )}
      </Button>
      
      <div className="ml-2 mr-3">
        <p className="text-sm font-medium line-clamp-1">{currentTrack.title}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{currentTrack.artist}</p>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={toggleDrawer}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MusicMiniPlayer;
