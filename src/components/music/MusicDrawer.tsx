
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from '@/components/ui/drawer';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2, X } from 'lucide-react';
import { MusicTrack, MusicPlaylist, MusicDrawerProps } from '@/types';
import MusicProgressBar from './MusicProgressBar';
import VolumeControl from './VolumeControl';
import TrackInfo from './TrackInfo';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  children,
  isOpen,
  open,
  onOpenChange,
  onClose,
  currentTrack,
  playlist
}) => {
  // Mock values for the player state
  const isPlaying = false;
  const volume = 0.7;
  const progress = 45;
  
  // Mock handlers
  const handlePlay = () => console.log('Play');
  const handlePause = () => console.log('Pause');
  const handlePrev = () => console.log('Previous');
  const handleNext = () => console.log('Next');
  const handleVolumeChange = (value: number) => console.log('Volume:', value);

  if (!currentTrack) return null;

  return (
    <Drawer open={isOpen || open} onOpenChange={onOpenChange}>
      {children && <DrawerTrigger asChild>{children}</DrawerTrigger>}
      <DrawerContent className="max-h-[85vh]">
        <div className="container max-w-3xl">
          <DrawerHeader className="flex flex-row justify-between items-center">
            <DrawerTitle>{playlist ? playlist.name : 'Music Player'}</DrawerTitle>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <div className="p-4">
            {/* Album cover and track info */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-48 h-48 rounded-lg overflow-hidden bg-muted mb-4">
                <img 
                  src={currentTrack?.coverUrl || currentTrack?.cover_url || currentTrack?.cover || '/images/music-placeholder.jpg'} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/music-placeholder.jpg';
                  }}
                />
              </div>
              <h3 className="text-lg font-semibold">{currentTrack.title}</h3>
              <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
            </div>
            
            {/* Progress bar */}
            <MusicProgressBar progress={progress} />
            
            {/* Playback controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button variant="ghost" size="icon" onClick={handlePrev}>
                <SkipBack className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="default" 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={isPlaying ? handlePause : handlePlay}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon" onClick={handleNext}>
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
            
            {/* Volume control */}
            <div className="flex items-center gap-3 mt-6">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <VolumeControl 
                volume={volume} 
                onVolumeChange={handleVolumeChange} 
                className="w-full"
              />
            </div>
            
            {/* Playlist tracks */}
            {playlist && playlist.tracks && playlist.tracks.length > 0 && (
              <>
                <Separator className="my-6" />
                <h4 className="font-medium mb-3">Playlist Tracks</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {playlist.tracks.map(track => (
                    <TrackInfo key={track.id} track={track} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
