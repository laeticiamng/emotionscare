
import React from 'react';
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  ListMusic, Repeat, Shuffle
} from 'lucide-react';

interface MusicControlsProps {
  showDrawer?: () => void;
  compact?: boolean;
}

const MusicControls: React.FC<MusicControlsProps> = ({ 
  showDrawer,
  compact = false
}) => {
  const { 
    isPlaying, 
    currentTrack, 
    togglePlay,
    nextTrack,
    previousTrack,
    volume,
    setVolume,
    isMuted,
    toggleMute
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
    <div className={`p-2 ${compact ? 'space-y-1' : 'space-y-2'}`}>
      <div className="flex items-center justify-between">
        <div className={`${compact ? 'hidden' : 'hidden sm:flex'} items-center space-x-2 w-1/3`}>
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

        <div className={`flex items-center justify-center space-x-2 ${compact ? 'w-full' : 'flex-1 sm:w-1/3'}`}>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={previousTrack} 
            className={compact ? 'h-8 w-8' : 'h-9 w-9'}
            aria-label="Piste précédente"
          >
            <SkipBack className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </Button>
          
          <Button 
            size="icon" 
            onClick={togglePlay} 
            className={`${compact ? 'h-9 w-9' : 'h-10 w-10'} rounded-full`}
            aria-label={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? (
              <Pause className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
            ) : (
              <Play className={`${compact ? 'h-4 w-4 ml-0.5' : 'h-5 w-5 ml-0.5'}`} />
            )}
          </Button>
          
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={nextTrack} 
            className={compact ? 'h-8 w-8' : 'h-9 w-9'}
            aria-label="Piste suivante"
          >
            <SkipForward className={`${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
          </Button>
        </div>

        <div className={`${compact ? 'hidden' : 'hidden sm:flex'} items-center justify-end space-x-2 w-1/3`}>
          {showDrawer && (
            <Button variant="ghost" size="icon" onClick={showDrawer} aria-label="Afficher la playlist">
              <ListMusic className="h-4 w-4" />
            </Button>
          )}
          
          <div className="flex items-center space-x-2 w-28">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleMute} 
              className="h-8 w-8 p-0"
              aria-label={isMuted ? "Activer le son" : "Couper le son"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0] / 100)}
              className="w-full"
              aria-label="Volume"
            />
          </div>
        </div>
        
        {/* Mobile version for playlist button */}
        {showDrawer && (
          <div className={`${compact ? 'flex' : 'sm:hidden flex'} items-center`}>
            <Button variant="ghost" size="icon" onClick={showDrawer} aria-label="Afficher la playlist">
              <ListMusic className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicControls;
