
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward } from 'lucide-react';
import { useMusic } from '@/contexts/music';

interface MusicMiniPlayerProps {
  onOpen: () => void;
}

const MusicMiniPlayer: React.FC<MusicMiniPlayerProps> = ({ onOpen }) => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack, 
    nextTrack,
    playlist
  } = useMusic();

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-16 right-4 p-3 bg-background border shadow-md rounded-lg flex items-center gap-3 z-50">
      <div onClick={onOpen} className="flex-1 cursor-pointer">
        <p className="text-sm font-medium truncate max-w-[120px]">
          {currentTrack.title}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {currentTrack.artist}
        </p>
      </div>

      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8" 
          onClick={handleTogglePlay}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8" 
          onClick={() => nextTrack()}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MusicMiniPlayer;
