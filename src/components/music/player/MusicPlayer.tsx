// @ts-nocheck

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PlayerControls from './PlayerControls';
import TrackInfo from './TrackInfo';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { useMusicControls } from '@/hooks/useMusicControls';
import { MusicTrack } from '@/types/music';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

interface MusicPlayerProps {
  track?: MusicTrack | null;
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ track, className }) => {
  const {
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    play,
    pause,
    seek,
    setVolume,
    toggleMute
  } = useMusicControls();

  const handlePrevious = () => {
    logger.info('Previous track');
  };

  const handleNext = () => {
    logger.info('Next track');
  };

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <TrackInfo track={track} />
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement...
            </div>
          )}
        </div>
        
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
        />
        
        <div className="flex items-center justify-between">
          <PlayerControls
            isPlaying={isPlaying}
            loadingTrack={isLoading}
            onPlay={play}
            onPause={pause}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
          
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={setVolume}
            onMuteToggle={toggleMute}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
