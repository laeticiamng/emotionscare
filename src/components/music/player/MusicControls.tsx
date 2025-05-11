
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, 
  ListMusic, Repeat, Shuffle
} from 'lucide-react';

interface MusicControlsProps {
  showDrawer?: () => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({ 
  showDrawer 
}) => {
  const { 
    isPlaying, 
    currentTrack, 
    togglePlay,
    nextTrack,
    previousTrack,
    volume,
    setVolume
  } = useMusic();

  if (!currentTrack) {
    return (
      <div className="flex items-center justify-center p-4">
        <Button variant="ghost" className="text-muted-foreground" onClick={showDrawer}>
          <ListMusic className="h-5 w-5 mr-2" />
          Parcourir la bibliothèque musicale
        </Button>
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="flex items-center justify-between">
        <div className="hidden sm:flex items-center space-x-2 w-1/3">
          <img 
            src={currentTrack.coverUrl || currentTrack.cover_url || '/images/music/default-cover.jpg'} 
            alt={currentTrack.title} 
            className="h-12 w-12 rounded object-cover"
          />
          <div className="overflow-hidden">
            <p className="font-medium truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-2 flex-1 sm:w-1/3">
          <Button size="icon" variant="ghost" onClick={previousTrack}>
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button size="icon" onClick={togglePlay} className="h-10 w-10 rounded-full">
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button size="icon" variant="ghost" onClick={nextTrack}>
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>

        <div className="hidden sm:flex items-center justify-end space-x-2 w-1/3">
          <Button variant="ghost" size="icon" onClick={showDrawer}>
            <ListMusic className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-2 w-28">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0] / 100)}
              className="w-full"
            />
          </div>
        </div>
        
        {/* Mobile version for track info */}
        <div className="sm:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={showDrawer}>
            <ListMusic className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MusicControls;
