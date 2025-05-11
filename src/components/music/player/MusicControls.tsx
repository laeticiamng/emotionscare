
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Repeat, Shuffle
} from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

export interface MusicControlsProps {
  showDrawer?: () => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({ showDrawer }) => {
  const { 
    currentTrack,
    isPlaying,
    volume,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume,
    toggleRepeat,
    toggleShuffle,
  } = useMusic();

  // Format time in mm:ss
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  return (
    <div className="w-full flex flex-col bg-card p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={previousTrack}
            disabled={!currentTrack}
          >
            <SkipBack size={20} />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={togglePlay}
            disabled={!currentTrack}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextTrack}
            disabled={!currentTrack}
          >
            <SkipForward size={20} />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleRepeat}
            disabled={!currentTrack}
          >
            <Repeat size={16} />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleShuffle}
            disabled={!currentTrack}
          >
            <Shuffle size={16} />
          </Button>
          
          <div className="flex items-center space-x-2 w-24">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
              className="p-0"
            >
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            
            <Slider 
              value={[volume * 100]} 
              max={100} 
              step={1}
              onValueChange={handleVolumeChange}
            />
          </div>
          
          {showDrawer && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={showDrawer}
              className="ml-2"
            >
              Playlist
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicControls;
