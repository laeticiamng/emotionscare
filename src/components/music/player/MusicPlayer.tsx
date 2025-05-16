
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TrackInfo from './TrackInfo';
import ProgressBar from './ProgressBar';
import MusicControls from './MusicControls';
import VolumeControl from './VolumeControl';
import { useMusic } from '@/contexts/music/MusicContextProvider';
import { Music } from 'lucide-react';

const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    nextTrack,
    previousTrack,
    duration,
    currentTime,
    seekTo,
    volume,
    setVolume,
    muted,
    toggleMute
  } = useMusic();
  
  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          {currentTrack ? (
            <div className="flex items-center justify-between">
              <TrackInfo 
                track={currentTrack} 
                showCover={true}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Music className="w-12 h-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium">Aucune lecture en cours</h3>
              <p className="text-sm text-muted-foreground">Sélectionnez une piste pour commencer l'écoute</p>
            </div>
          )}
          
          {currentTrack && (
            <>
              <ProgressBar 
                currentTime={currentTime} 
                duration={duration} 
                onSeek={seekTo} 
                formatTime={formatTime}
                showTimestamps={true}
              />
              
              <div className="flex items-center justify-between">
                <MusicControls 
                  isPlaying={isPlaying} 
                  onPlay={togglePlay} 
                  onPause={togglePlay} 
                  onNext={nextTrack} 
                  onPrevious={previousTrack}
                  size="md"
                />
                
                <VolumeControl 
                  volume={volume} 
                  onVolumeChange={setVolume} 
                  isMuted={muted} 
                  onMuteToggle={toggleMute} 
                  showLabel={true}
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
