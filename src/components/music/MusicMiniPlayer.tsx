
import React from 'react';
import { motion } from 'framer-motion';
import { useMusic } from '@/providers/MusicProvider';
import { Play, Pause, SkipBack, SkipForward, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MusicMiniPlayerProps {
  className?: string;
}

const MusicMiniPlayer: React.FC<MusicMiniPlayerProps> = ({ className }) => {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    previousTrack,
    toggleDrawer
  } = useMusic();

  if (!currentTrack) return null;

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
          {currentTrack.cover || currentTrack.coverUrl ? (
            <img 
              src={currentTrack.cover || currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Music className="h-3 w-3" />
            </div>
          )}
        </div>
        <div className="ml-2 hidden sm:block max-w-[120px]">
          <p className="text-xs font-medium truncate">{currentTrack.title}</p>
          <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
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
