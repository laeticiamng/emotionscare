// @ts-nocheck
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Music, ChevronUp } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import TrackInfo from './TrackInfo';

interface MusicDrawerProps {
  children?: React.ReactNode;
}

const MusicDrawer: React.FC<MusicDrawerProps> = ({ children }) => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    currentTime, 
    duration,
    togglePlayer,
    setVolume,
    seekTo,
    nextTrack,
    previousTrack
  } = useMusic();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children || (
          <Button 
            variant="outline" 
            size="icon" 
            className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
            aria-label="Ouvrir le lecteur de musique"
          >
            <Music className="h-5 w-5" />
            <ChevronUp className="h-3 w-3 absolute -top-0.5" />
          </Button>
        )}
      </DrawerTrigger>
      
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="text-left">
          <DrawerTitle className="flex items-center gap-2">
            <Music className="h-5 w-5 text-primary" />
            Lecteur de musique
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-6 space-y-6">
          {currentTrack ? (
            <>
              <TrackInfo track={currentTrack} />
              
              <ProgressBar
                currentTime={currentTime}
                duration={duration}
                onSeek={seekTo}
                formatTime={formatTime}
              />
              
              <div className="flex items-center justify-between">
                <VolumeControl
                  volume={volume}
                  onVolumeChange={setVolume}
                  isMuted={volume === 0}
                  onMuteToggle={() => setVolume(volume === 0 ? 0.7 : 0)}
                />
                
                <PlayerControls
                  isPlaying={isPlaying}
                  onPlay={togglePlayer}
                  onPause={togglePlayer}
                  onPrevious={previousTrack}
                  onNext={nextTrack}
                />
                
                <div className="w-24" /> {/* Spacer pour centrer les contrôles */}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Music className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>Aucune piste en lecture</p>
              <p className="text-sm mt-1">
                Sélectionnez une piste pour commencer
              </p>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default MusicDrawer;
