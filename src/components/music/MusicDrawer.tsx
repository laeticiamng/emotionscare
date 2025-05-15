
import React, { useState } from 'react';
import { Drawer, DrawerContent } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { MusicTrack, MusicPlaylist, MusicDrawerProps } from '@/types';
import MusicProgressBar from './MusicProgressBar';
import VolumeControl from './VolumeControl';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  children,
  side = "right",
  open,
  isOpen,
  onClose,
  onOpenChange,
  currentTrack,
  playlist
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);

  const handleSeek = (value: number) => {
    setCurrentTime(value);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    // Implement previous track logic
  };

  const handleNext = () => {
    // Implement next track logic
  };

  const handleVolumeChange = (value: number) => {
    setVolume(value);
    if (value > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Drawer open={open || isOpen} onOpenChange={onOpenChange} direction={side}>
      <DrawerContent className="h-[85vh] p-4 rounded-t-xl">
        <div className="flex items-start justify-between mb-6">
          <h2 className="text-xl font-semibold">Player musical</h2>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex flex-col h-full">
          {currentTrack ? (
            <>
              <div className="flex-1 flex flex-col items-center justify-center space-y-6 mb-6">
                <div className="w-64 h-64 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/30">
                  {currentTrack.cover || currentTrack.cover_url ? (
                    <img
                      src={currentTrack.cover || currentTrack.cover_url}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/30">
                      <Volume2 className="h-16 w-16 text-primary" />
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-semibold">{currentTrack.title}</h3>
                  <p className="text-muted-foreground">{currentTrack.artist}</p>
                </div>
              </div>

              <div className="space-y-6">
                <MusicProgressBar
                  value={currentTime}
                  max={duration}
                  currentTime={currentTime}
                  duration={duration}
                  onSeek={handleSeek}
                  className="w-full"
                  showTimestamps={true}
                />

                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handlePrev}
                  >
                    <SkipBack className="h-6 w-6" />
                  </Button>

                  <Button
                    variant="default"
                    size="icon"
                    className="h-12 w-12 rounded-full"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-1" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handleNext}
                  >
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>

                <div className="flex justify-center">
                  <VolumeControl
                    volume={volume}
                    onChange={handleVolumeChange}
                    isMuted={isMuted}
                    onMuteToggle={handleMuteToggle}
                    className="w-48"
                    showLabel={true}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 text-center">
              <Volume2 className="h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-xl font-semibold">Aucun morceau</h3>
                <p className="text-muted-foreground mt-1">
                  Sélectionnez un morceau pour commencer à écouter
                </p>
              </div>
            </div>
          )}

          {playlist && playlist.tracks && playlist.tracks.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">
                {playlist.name || playlist.title || 'Playlist actuelle'}
              </h3>
              <div className="max-h-64 overflow-y-auto">
                {playlist.tracks.map((track) => (
                  <div
                    key={track.id}
                    className={`flex items-center p-2 rounded-md ${
                      currentTrack && currentTrack.id === track.id
                        ? 'bg-primary/10'
                        : 'hover:bg-accent'
                    } cursor-pointer`}
                  >
                    <div className="h-10 w-10 rounded overflow-hidden bg-muted flex-shrink-0">
                      {track.cover || track.cover_url ? (
                        <img
                          src={track.cover || track.cover_url}
                          alt={track.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-primary/10">
                          <Volume2 className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {track.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {track.artist}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground ml-2">
                      {Math.floor(track.duration / 60)}:
                      {String(Math.floor(track.duration % 60)).padStart(2, '0')}
                    </div>
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
