
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Repeat, Shuffle } from 'lucide-react';

export interface MusicControlsProps {
  showDrawer?: () => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({ showDrawer }) => {
  const { 
    isPlaying, 
    currentTrack, 
    playTrack, 
    pauseTrack, 
    nextTrack, 
    previousTrack,
    toggleRepeat,
    toggleShuffle 
  } = useMusic();

  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleShuffle}
        className="h-8 w-8"
      >
        <Shuffle className="h-4 w-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={previousTrack}
        className="h-8 w-8"
      >
        <SkipBack className="h-4 w-4" />
      </Button>

      <Button 
        variant="default" 
        size="sm" 
        onClick={handleTogglePlay}
        className="h-10 w-10 rounded-full"
      >
        {isPlaying ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 ml-0.5" />
        )}
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={nextTrack}
        className="h-8 w-8"
      >
        <SkipForward className="h-4 w-4" />
      </Button>

      <Button 
        variant="ghost" 
        size="sm" 
        onClick={toggleRepeat}
        className="h-8 w-8"
      >
        <Repeat className="h-4 w-4" />
      </Button>
      
      {showDrawer && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={showDrawer}
          className="ml-2"
        >
          More
        </Button>
      )}
    </div>
  );
};

export default MusicControls;
