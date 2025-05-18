
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
  side = "right",
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

  // Use the most available method
  const handlePrevious = prevTrack || previousTrack || (() => {});
  
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={side} className="w-[320px] sm:w-[400px]">
        <SheetHeader className="text-left mb-6">
          <SheetTitle>Music Player</SheetTitle>
        </SheetHeader>
        
        {/* Album art and track info */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-48 h-48 bg-muted rounded-lg overflow-hidden mb-4">
            {currentTrack?.cover ? (
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.name || currentTrack.title || "Album art"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Volume2 className="h-12 w-12 text-muted-foreground opacity-50" />
              </div>
            )}
          </div>
          
          <h3 className="font-semibold text-lg">
            {currentTrack?.name || currentTrack?.title || "No track selected"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {currentTrack?.artist || "Unknown artist"}
          </p>
        </div>
        
        {/* Progress bar */}
        <ProgressBar 
          currentTime={currentTime} 
          duration={duration} 
          onSeek={seekTo} 
        />
        
        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 my-6">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handlePrevious}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={nextTrack}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Volume control */}
        <VolumeControl 
          volume={volume} 
          muted={muted}
          onVolumeChange={setVolume}
          onMuteToggle={toggleMute}
        />
        
        {/* Playlist */}
        {playlist && playlist.tracks && playlist.tracks.length > 0 && (
          <div className="mt-8">
            <h3 className="font-medium text-sm mb-3">Playlist</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
              {playlist.tracks.map((track, index) => (
                <div 
                  key={track.id || index} 
                  className={`flex items-center p-2 rounded-md ${
                    currentTrack?.id === track.id 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="text-xs font-medium w-5 text-right mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {track.name || track.title || `Track ${index + 1}`}
                    </h4>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist || "Unknown"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {children}
      </SheetContent>
    </Sheet>
  );
};

export default MusicDrawer;
