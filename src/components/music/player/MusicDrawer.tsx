
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MusicTrack, MusicPlaylist, MusicDrawerProps } from '@/types/music';
import { useMusic } from '@/contexts/music';
import { Card } from '@/components/ui/card';
import TrackInfo from './TrackInfo';
import PlayerControls from './MusicControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';

const MusicDrawer: React.FC<MusicDrawerProps> = ({
  children,
  isOpen,
  onOpenChange,
  onClose,
  playlist,
  currentTrack,
  side = "right"
}) => {
  const {
    currentTrack: contextTrack,
    playlist: contextPlaylist,
    isPlaying,
    togglePlay,
    prevTrack,
    nextTrack,
    volume,
    setVolume,
    currentTime,
    duration,
    seekTo,
    muted,
    toggleMute,
    openDrawer,
    setOpenDrawer
  } = useMusic();

  // Use props or context values
  const activeTrack = currentTrack || contextTrack;
  const activePlaylist = playlist || contextPlaylist;
  const isOpened = isOpen !== undefined ? isOpen : openDrawer;
  
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setOpenDrawer(open);
    }
    
    if (!open && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpened} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col gap-4 p-2">
          {/* Track info */}
          {activeTrack && (
            <Card className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="text-center">
                  {activeTrack.coverUrl || activeTrack.coverImage || activeTrack.cover ? (
                    <img 
                      src={activeTrack.coverUrl || activeTrack.coverImage || activeTrack.cover} 
                      alt={activeTrack.title}
                      className="mx-auto h-40 w-40 object-cover rounded-md"
                    />
                  ) : (
                    <div className="mx-auto h-40 w-40 bg-muted flex items-center justify-center rounded-md">
                      <span className="text-4xl">♪</span>
                    </div>
                  )}
                </div>
                
                <TrackInfo track={activeTrack} />
                
                {/* Playback controls */}
                <div className="space-y-4">
                  <ProgressBar 
                    currentTime={currentTime} 
                    duration={duration} 
                    onSeek={seekTo} 
                    showTimestamps={true}
                  />
                  
                  <div className="flex flex-col space-y-2">
                    <PlayerControls 
                      isPlaying={isPlaying}
                      onPlay={togglePlay}
                      onPause={togglePlay}
                      onPrevious={prevTrack}
                      onNext={nextTrack}
                    />
                    
                    <VolumeControl 
                      volume={volume}
                      isMuted={muted}
                      onVolumeChange={setVolume}
                      onMuteToggle={toggleMute}
                      className="w-full justify-end"
                      showLabel={true}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}
          
          {/* Playlist tracks list */}
          {activePlaylist && activePlaylist.tracks && activePlaylist.tracks.length > 0 && (
            <div className="max-h-80 overflow-y-auto">
              <h3 className="font-medium mb-2">
                {activePlaylist.title || activePlaylist.name || "Current Playlist"}
              </h3>
              {/* Render playlist tracks here */}
              {children}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MusicDrawer;
