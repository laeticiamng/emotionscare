
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PlayerControls from './PlayerControls';
import TrackInfo from './TrackInfo';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { useMusicControls } from '@/hooks/useMusicControls';
import { MusicTrack } from '@/types/music';

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
    play,
    pause,
    seek,
    setVolume,
    toggleMute
  } = useMusicControls();

  const handlePrevious = () => {
    console.log('Previous track');
  };

  const handleNext = () => {
    console.log('Next track');
  };

  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        <TrackInfo track={track} />
        
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          onSeek={seek}
        />
        
        <div className="flex items-center justify-between">
          <PlayerControls
            isPlaying={isPlaying}
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
