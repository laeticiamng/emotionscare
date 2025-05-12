
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import { Slider } from '@/components/ui/slider';

interface MusicControlsProps {
  showDrawer?: () => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({ showDrawer }) => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay,
    nextTrack,
    previousTrack,
    volume,
    setVolume
  } = useMusic();

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={previousTrack}
              disabled={!currentTrack}
              className="h-8 w-8 p-0 rounded-full"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlay}
              disabled={!currentTrack}
              className="h-10 w-10 rounded-full"
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
              onClick={nextTrack}
              disabled={!currentTrack}
              className="h-8 w-8 p-0 rounded-full"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
          
          {currentTrack ? (
            <div>
              <p className="text-sm font-medium">{currentTrack.title}</p>
              <p className="text-xs text-muted-foreground">{currentTrack.artist}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No track playing</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              className="w-24"
              onValueChange={(value) => setVolume(value[0] / 100)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicControls;
