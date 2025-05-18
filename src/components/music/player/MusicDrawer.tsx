
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useMusic } from '@/contexts/music';
import { MusicDrawerProps } from '@/types/music';
import { ProgressBar } from './ProgressBar';
import { VolumeControl } from './VolumeControl';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  open,
  onOpenChange,
  playlist,
  currentTrack,
  children
}) => {
  const { 
    isPlaying, 
    togglePlay,
    prevTrack,
    previousTrack, // Alternate name
    nextTrack,
    volume,
    setVolume,
    currentTime,
    duration,
    seekTo,
    muted,
    toggleMute,
  } = useMusic();

  // Use the appropriate previous track function
  const handlePreviousTrack = () => {
    if (typeof prevTrack === 'function') {
      prevTrack();
    } else if (typeof previousTrack === 'function') {
      previousTrack();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Music Player</SheetTitle>
        </SheetHeader>
        
        <div className="py-6">
          {children ? (
            children
          ) : (
            <div className="space-y-6">
              {currentTrack && (
                <div className="flex flex-col items-center space-y-4">
                  {currentTrack.coverUrl && (
                    <div className="rounded-lg overflow-hidden w-48 h-48">
                      <img 
                        src={currentTrack.coverUrl} 
                        alt={currentTrack.title || 'Album cover'} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="font-medium text-lg">
                      {currentTrack.title || currentTrack.name || 'Unknown Track'}
                    </h3>
                    <p className="text-muted-foreground">
                      {currentTrack.artist || 'Unknown Artist'}
                    </p>
                  </div>
                  
                  <ProgressBar 
                    currentTime={currentTime} 
                    duration={duration} 
                    onSeek={seekTo} 
                  />
                  
                  <div className="flex items-center justify-center space-x-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handlePreviousTrack}
                    >
                      <SkipBack />
                    </Button>
                    
                    <Button 
                      size="icon" 
                      className="h-12 w-12 rounded-full" 
                      onClick={togglePlay}
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={nextTrack}
                    >
                      <SkipForward />
                    </Button>
                  </div>
                  
                  <VolumeControl 
                    volume={volume} 
                    muted={muted} 
                    onVolumeChange={setVolume} 
                    onMuteToggle={toggleMute} 
                  />
                </div>
              )}
              
              {playlist && playlist.tracks.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h4 className="font-medium">Playlist: {playlist.name || 'Current Playlist'}</h4>
                  <div className="space-y-1">
                    {playlist.tracks.map(track => (
                      <div 
                        key={track.id} 
                        className={`flex items-center p-2 rounded-md ${
                          currentTrack?.id === track.id ? 'bg-secondary' : 'hover:bg-accent'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {track.title || track.name || 'Unknown Track'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {track.artist || 'Unknown Artist'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
