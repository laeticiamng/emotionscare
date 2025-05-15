
import React from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { MusicTrack, MusicPlaylist, MusicDrawerProps } from '@/types';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import TrackInfo from './TrackInfo';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  children,
  open = false,
  onOpenChange,
  onClose,
  currentTrack = null,
  playlist = null,
}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [volume, setVolume] = React.useState(70);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleClose = () => {
    if (onClose) onClose();
    if (onOpenChange) onOpenChange(false);
  };

  // Determine the cover URL - handle different property names
  const getCoverUrl = (track?: MusicTrack | null) => {
    if (!track) return '/images/music-placeholder.jpg';
    return track.coverUrl || track.cover || track.cover_url || '/images/music-placeholder.jpg';
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-background max-h-[85vh] p-6">
        <DrawerHeader className="p-0 mb-4">
          <DrawerTitle>Music Player</DrawerTitle>
          <Button
            variant="outline"
            size="sm"
            className="absolute top-4 right-4"
            onClick={handleClose}
          >
            Close
          </Button>
        </DrawerHeader>

        <div className="flex flex-col items-center space-y-8">
          {/* Album cover */}
          <div className="relative w-48 h-48 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-primary/5 shadow-lg">
            {currentTrack && (
              <img
                src={getCoverUrl(currentTrack)}
                alt={`${currentTrack.title} cover`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/images/music-placeholder.jpg';
                }}
              />
            )}
          </div>

          {/* Track info */}
          {currentTrack && (
            <div className="text-center">
              <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
              <p className="text-muted-foreground">{currentTrack.artist}</p>
            </div>
          )}

          {/* Player controls */}
          <div className="w-full max-w-md space-y-4">
            {/* Progress bar */}
            <div className="h-1 w-full bg-primary/20 rounded-full">
              <div className="h-full bg-primary rounded-full" style={{ width: '45%' }} />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1:35</span>
              <span>3:45</span>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-center space-x-6">
              <Button variant="ghost" size="icon">
                <SkipBack className="h-5 w-5" />
              </Button>
              
              <Button 
                className="h-12 w-12 rounded-full"
                onClick={handlePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              
              <Button variant="ghost" size="icon">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Volume */}
            <div className="flex items-center space-x-3">
              <Volume2 className="h-4 w-4 text-muted-foreground" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(value) => setVolume(value[0])}
              />
              <span className="text-xs w-8 text-muted-foreground">{volume}%</span>
            </div>
          </div>
          
          {/* Playlist if available */}
          {playlist && playlist.tracks && playlist.tracks.length > 0 && (
            <div className="w-full max-w-md">
              <h4 className="font-medium my-4">Playlist: {playlist.name}</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {playlist.tracks.map((track) => (
                  <div 
                    key={track.id} 
                    className={`p-2 rounded-lg ${
                      currentTrack?.id === track.id ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                  >
                    <TrackInfo track={track} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
