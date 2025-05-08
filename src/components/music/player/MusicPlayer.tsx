
import React from 'react';
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import TrackInfo from './TrackInfo';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useAudioPlayerState } from '@/hooks/audio/useAudioPlayerState';

/**
 * Complete music player component that combines all player controls
 */
const MusicPlayer: React.FC = () => {
  const { 
    playTrack, 
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    handleProgressClick,
    handleVolumeChange,
    error
  } = useAudioPlayer();
  
  const {
    currentTrack,
    isPlaying,
    loadingTrack,
    currentTime,
    duration
  } = useAudioPlayerState();
  
  const handlePlay = () => {
    if (currentTrack) {
      resumeTrack();
    }
  };
  
  const handlePause = () => {
    pauseTrack();
  };

  const handlePrevious = () => {
    previousTrack();
  };

  const handleNext = () => {
    nextTrack();
  };

  return (
    <Card className="music-player">
      <CardHeader>
        <CardTitle className="text-lg">Lecteur musical</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentTrack ? (
          <>
            <TrackInfo 
              currentTrack={currentTrack} 
              loadingTrack={loadingTrack} 
              audioError={!!error} 
            />
            
            <ProgressBar 
              currentTime={currentTime} 
              duration={duration} 
              handleProgressClick={handleProgressClick} 
            />
            
            <div className="flex items-center justify-between">
              <PlayerControls 
                isPlaying={isPlaying} 
                loadingTrack={loadingTrack}
                onPlay={handlePlay}
                onPause={handlePause}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
              
              <VolumeControl 
                volume={useAudioPlayerState().volume} 
                onVolumeChange={handleVolumeChange} 
              />
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun titre en cours de lecture</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
