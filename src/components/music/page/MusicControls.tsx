import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, List } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

interface MusicControlsProps {
  showDetails?: boolean;
  showDrawer?: () => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({ 
  showDetails = true,
  showDrawer
}) => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack, 
    nextTrack, 
    previousTrack,
    volume,
    setVolume 
  } = useMusic();
  
  // Fix: Accepter un tableau de valeurs et utiliser le premier élément
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0] / 100);
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };
  
  if (!currentTrack) {
    return showDetails ? (
      <div className="text-center text-muted-foreground p-4">
        Aucune musique en cours de lecture
      </div>
    ) : null;
  }
  
  // Déterminer l'URL de la couverture de la piste
  const getCoverUrl = () => {
    if (!currentTrack) return null;
    
    if (currentTrack.coverUrl) return currentTrack.coverUrl;
    if (currentTrack.cover) return currentTrack.cover;
    if (currentTrack.coverImage) return currentTrack.coverImage;
    
    return null;
  };
  
  const coverUrl = getCoverUrl();
  
  return (
    <div className="flex flex-col gap-2">
      {showDetails && (
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center overflow-hidden">
            {coverUrl ? (
              <img 
                src={coverUrl} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentTrack.title}</p>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 flex items-center justify-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={previousTrack}
            className="h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            variant={isPlaying ? "secondary" : "default"}
            size="icon"
            onClick={togglePlayPause}
            className="h-10 w-10"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={nextTrack}
            className="h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            defaultValue={[volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="w-20"
          />
          
          {showDrawer && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={showDrawer}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MusicControls;
