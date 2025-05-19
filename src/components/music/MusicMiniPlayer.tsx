
import React from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '@/contexts/music';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MusicContextType } from '@/types/music';
import { getTrackCover, getTrackTitle, getTrackArtist } from '@/utils/musicCompatibility';

interface MusicMiniPlayerProps {
  className?: string;
}

const MusicMiniPlayer: React.FC<MusicMiniPlayerProps> = ({ className }) => {
  const musicContext = useMusic();
  
  // S'assurer que le contexte est complet avant de continuer
  if (!musicContext) return null;
  
  const { currentTrack, isPlaying } = musicContext as MusicContextType;
  
  // Méthodes contextuelles sans vérification typée
  const togglePlay = () => {
    if (musicContext.togglePlay) {
      musicContext.togglePlay();
    } else if (isPlaying && musicContext.pause) {
      musicContext.pause();
    } else if (!isPlaying && musicContext.resume) {
      musicContext.resume();
    }
  };
  
  const nextTrack = () => {
    if (musicContext.nextTrack) {
      musicContext.nextTrack();
    } else if (musicContext.next) {
      musicContext.next();
    }
  };
  
  const previousTrack = () => {
    if (musicContext.previousTrack) {
      musicContext.previousTrack();
    } else if (musicContext.previous) {
      musicContext.previous();
    }
  };
  
  const toggleDrawer = () => {
    if (musicContext.toggleDrawer) {
      musicContext.toggleDrawer();
    }
  };

  if (!currentTrack) return null;

  const cover = getTrackCover(currentTrack);
  const title = getTrackTitle(currentTrack);
  const artist = getTrackArtist(currentTrack);

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "flex items-center space-x-2 bg-background/80 backdrop-blur-md rounded-full px-3 py-1 border shadow-sm",
        className
      )}
    >
      {/* Track Info with Album art */}
      <div 
        className="flex items-center cursor-pointer"
        onClick={toggleDrawer}
      >
        <div className="h-7 w-7 rounded-full overflow-hidden flex-shrink-0 bg-primary/10">
          {cover ? (
            <img 
              src={cover} 
              alt={title} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Music className="h-3 w-3" />
            </div>
          )}
        </div>
        <div className="ml-2 hidden sm:block max-w-[120px]">
          <p className="text-xs font-medium truncate">{title}</p>
          <p className="text-xs text-muted-foreground truncate">{artist}</p>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={previousTrack}
        >
          <SkipBack className="h-3 w-3" />
          <span className="sr-only">Previous</span>
        </Button>
        
        <Button
          variant="default"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={togglePlay}
        >
          {isPlaying ? (
            <Pause className="h-3 w-3" />
          ) : (
            <Play className="h-3 w-3" />
          )}
          <span className="sr-only">{isPlaying ? 'Pause' : 'Play'}</span>
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full"
          onClick={nextTrack}
        >
          <SkipForward className="h-3 w-3" />
          <span className="sr-only">Next</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default MusicMiniPlayer;
