
import React, { useState, useEffect } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Disc3, SkipForward, SkipBack, Play, Pause, Volume } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { useMusic } from '@/contexts/MusicContext';
import VolumeControl from './VolumeControl';
import { MusicTrack, MusicPlaylist } from '@/types';

interface MusicDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ isOpen, onOpenChange }) => {
  const {
    currentTrack,
    isPlaying,
    play,
    pause,
    nextTrack,
    prevTrack,
    progress,
    duration,
    seek,
    volume,
    setVolume,
    playlist
  } = useMusic();

  const [localVolume, setLocalVolume] = useState(volume * 100);
  const [showPlaylist, setShowPlaylist] = useState(false);

  useEffect(() => {
    setLocalVolume(volume * 100);
  }, [volume]);

  const handleVolumeChange = (value: number) => {
    setLocalVolume(value);
    setVolume(value / 100);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const getTrackImage = (track: MusicTrack | null) => {
    if (!track) return "";
    return track.coverUrl || track.cover || "https://via.placeholder.com/80";
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[70vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center">
            <Disc3 className="mr-2 h-5 w-5" /> Lecteur Audio
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <div className="flex flex-col space-y-4">
            {currentTrack ? (
              <div className="flex items-center space-x-4">
                <div 
                  className="h-20 w-20 rounded-md bg-cover bg-center bg-no-repeat" 
                  style={{ backgroundImage: `url(${getTrackImage(currentTrack)})` }}
                />
                <div className="flex-1">
                  <h3 className="font-medium">{currentTrack.title}</h3>
                  <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
                </div>
              </div>
            ) : (
              <div className="h-20 flex items-center justify-center bg-muted rounded-md">
                <p className="text-muted-foreground">Aucun titre en cours de lecture</p>
              </div>
            )}

            <ProgressBar 
              currentTime={progress} 
              duration={duration} 
              onSeek={seek} 
              formatTime={formatTime}
            />
            
            <div className="flex justify-between items-center">
              <div className="flex-1 flex justify-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={prevTrack}
                  disabled={!currentTrack}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant={isPlaying ? "secondary" : "default"}
                  size="icon"
                  onClick={togglePlayPause}
                  disabled={!currentTrack}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={nextTrack}
                  disabled={!currentTrack}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
              </div>
              
              <VolumeControl
                volume={localVolume}
                onVolumeChange={handleVolumeChange}
                className="w-24"
              />
            </div>
            
            {playlist.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">En lecture</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPlaylist(!showPlaylist)}
                  >
                    {showPlaylist ? 'Masquer' : 'Afficher'}
                  </Button>
                </div>
                
                {showPlaylist && (
                  <div className="max-h-40 overflow-y-auto mt-2">
                    {playlist.map((track, index) => (
                      <div 
                        key={track.id || index}
                        className={`flex items-center p-2 rounded-md cursor-pointer ${
                          currentTrack?.id === track.id ? 'bg-primary/10' : 'hover:bg-accent'
                        }`}
                        onClick={() => play(track)}
                      >
                        <div className="w-6 text-sm text-muted-foreground mr-2">{index + 1}</div>
                        <div className="flex-1">
                          <div className="font-medium truncate">{track.title}</div>
                          <div className="text-xs text-muted-foreground">{track.artist}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
