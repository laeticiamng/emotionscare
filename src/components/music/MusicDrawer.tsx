
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import MusicProgressBar from './MusicProgressBar';
import VolumeControl from './VolumeControl';
import { MusicDrawerProps, MusicTrack } from '@/types';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  children,
  side = "bottom",
  open = false,
  onOpenChange,
  currentTrack = null,
  playlist = null
}) => {
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(0.5);
  const [isMuted, setIsMuted] = React.useState(false);
  
  // Handle play/pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Handle seeking
  const handleSeek = (value: number) => {
    setCurrentTime(value);
  };
  
  // Handle volume change
  const handleVolumeChange = (value: number) => {
    setVolume(value / 100);
  };
  
  // Handle mute toggle
  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };
  
  // Format time function
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="px-4 pt-3 pb-6">
        <DrawerHeader className="px-0">
          <DrawerTitle>
            {currentTrack?.title || 'Musique'}
          </DrawerTitle>
        </DrawerHeader>
        
        {currentTrack && (
          <div className="space-y-4">
            {/* Album cover if available */}
            {currentTrack.cover_url && (
              <div className="flex justify-center">
                <img 
                  src={currentTrack.cover_url} 
                  alt={currentTrack.title} 
                  className="w-32 h-32 object-cover rounded-md shadow-md"
                />
              </div>
            )}
            
            {/* Track info */}
            <div className="text-center">
              <h3 className="font-medium">{currentTrack.title}</h3>
              <p className="text-sm text-muted-foreground">{currentTrack.artist || 'Unknown Artist'}</p>
            </div>
            
            {/* Progress bar */}
            <MusicProgressBar 
              value={currentTime}
              max={duration} 
              currentTime={currentTime}
              duration={duration}
              onSeek={handleSeek}
              className="px-2"
              showTimestamps={true}
            />
            
            {/* Playback controls */}
            <div className="flex items-center justify-center gap-4">
              <Button variant="ghost" size="icon" aria-label="Previous track">
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full w-10 h-10" 
                onClick={handlePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <Button variant="ghost" size="icon" aria-label="Next track">
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Volume control */}
            <div className="flex justify-center">
              <VolumeControl 
                volume={volume}
                onChange={handleVolumeChange}
                isMuted={isMuted}
                onMuteToggle={handleMuteToggle}
                className="mt-2"
                showLabel={true}
              />
            </div>
          </div>
        )}
        
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
