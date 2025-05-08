
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useMusic } from '@/contexts/MusicContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { Repeat, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  className?: string;
  compact?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ className, compact = false }) => {
  const { 
    currentTrack, 
    isPlaying, 
    pauseTrack, 
    playTrack, 
    nextTrack, 
    previousTrack,
    currentTime,
    duration,
    formatTime,
    handleProgressClick,
    volume,
    handleVolumeChange,
    repeat,
    toggleRepeat,
    shuffle,
    toggleShuffle,
    loadingTrack
  } = useMusic();

  if (!currentTrack) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6 text-center text-muted-foreground">
          Aucune piste en cours de lecture
        </CardContent>
      </Card>
    );
  }

  // Function to get the cover image from track
  const getCoverImage = () => {
    if (currentTrack.coverUrl) return currentTrack.coverUrl;
    if (currentTrack.cover) return currentTrack.cover;
    if (currentTrack.coverImage) return currentTrack.coverImage;
    return null;
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className={cn("p-6", compact ? "space-y-2" : "space-y-4")}>
        {/* Track Info */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-secondary/30 rounded overflow-hidden flex-shrink-0">
            {getCoverImage() && (
              <img 
                src={getCoverImage()} 
                alt={currentTrack.title} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium truncate" title={currentTrack.title}>
              {currentTrack.title}
            </h3>
            <p className="text-sm text-muted-foreground truncate">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <ProgressBar 
          currentTime={currentTime}
          duration={duration}
          formatTime={formatTime}
          handleProgressClick={handleProgressClick}
        />
        
        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-8 w-8",
                repeat ? "text-primary" : "text-muted-foreground"
              )}
              onClick={toggleRepeat}
            >
              <Repeat size={16} />
            </Button>
            
            <PlayerControls
              isPlaying={isPlaying}
              loadingTrack={loadingTrack}
              onPlay={() => currentTrack && playTrack(currentTrack)}
              onPause={pauseTrack}
              onPrevious={previousTrack}
              onNext={nextTrack}
            />
            
            <Button 
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full h-8 w-8",
                shuffle ? "text-primary" : "text-muted-foreground"
              )}
              onClick={toggleShuffle}
            >
              <Shuffle size={16} />
            </Button>
          </div>
          
          {!compact && (
            <VolumeControl 
              volume={volume} 
              onVolumeChange={handleVolumeChange} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
