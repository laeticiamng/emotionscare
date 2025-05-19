
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, ChevronUp } from 'lucide-react';
import { getTrackTitle, getTrackArtist } from '@/utils/musicCompatibility';

const MusicMiniPlayer: React.FC = () => {
  const { isPlaying, currentTrack, togglePlay, toggleDrawer } = useMusic();

  if (!currentTrack) {
    return null;
  }

  // Use utility functions to get title and artist, handling different property naming
  const title = getTrackTitle(currentTrack);
  const artist = getTrackArtist(currentTrack);

  return (
    <div className="bg-background border rounded-full shadow-lg flex items-center p-1 pr-3 fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
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
        <p className="text-sm font-medium line-clamp-1">{title}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{artist}</p>
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
