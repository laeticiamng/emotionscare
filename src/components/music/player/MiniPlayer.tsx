
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

interface MiniPlayerProps {
  onExpand: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onExpand }) => {
  const { currentTrack, isPlaying, play, pause } = useMusic();

  if (!currentTrack) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="bg-card border rounded-lg p-2 shadow-lg flex items-center space-x-2 max-w-64">
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
        
        <div className="flex-1 min-w-0 cursor-pointer" onClick={onExpand}>
          <p className="text-xs font-medium truncate">{currentTrack.title}</p>
          <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
        </div>
      </div>
    </div>
  );
};

export default MiniPlayer;
