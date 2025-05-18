
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle, Music } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMusic } from '@/contexts/music';
import { MusicContextType } from '@/types/music';

// Provide default implementation for missing properties
const MusicMiniPlayerWrapper: React.FC = () => {
  const musicContext = useMusic();
  
  // Create an enhanced context with fallbacks for missing properties
  const enhancedContext: MusicContextType = {
    ...musicContext,
    playlist: musicContext.playlist || null,
    nextTrack: musicContext.nextTrack || (() => {}),
  };
  
  return <MusicMiniPlayer context={enhancedContext} />;
};

interface MusicMiniPlayerProps {
  context: MusicContextType;
}

const MusicMiniPlayer = ({ context }: MusicMiniPlayerProps) => {
  const { 
    isPlaying, 
    currentTrack,
    togglePlay, 
    setOpenDrawer,
  } = context;
  
  return (
    <div 
      className={cn(
        "flex items-center justify-between px-3 py-2 rounded-lg",
        "transition-all duration-300 ease-in-out",
        isPlaying 
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20" 
          : "bg-muted/50"
      )}
    >
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn(
            "h-8 w-8 rounded-full transition-all", 
            isPlaying ? "text-primary bg-white dark:bg-primary/10" : "text-muted-foreground"
          )}
          onClick={togglePlay}
        >
          {isPlaying 
            ? <PauseCircle className="h-5 w-5" />
            : <PlayCircle className="h-5 w-5" />
          }
        </Button>
        
        <div className="ml-3 cursor-pointer" onClick={() => setOpenDrawer(true)}>
          {currentTrack ? (
            <div>
              <h4 className="font-medium text-sm line-clamp-1">
                {currentTrack.name || currentTrack.title || 'Unknown Track'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {currentTrack.artist || 'Unknown Artist'}
              </p>
            </div>
          ) : (
            <div className="flex items-center">
              <Music className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Music Player</span>
            </div>
          )}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        className="text-xs"
        onClick={() => setOpenDrawer(true)}
      >
        Open
      </Button>
    </div>
  );
};

export default MusicMiniPlayerWrapper;
