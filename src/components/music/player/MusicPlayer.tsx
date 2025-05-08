
import React from 'react';
import { Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMusic } from '@/contexts/MusicContext';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import TrackInfo from './TrackInfo';
import VolumeControl from './VolumeControl';
import { useAudioPlayer } from './useAudioPlayer';
import { convertMusicTrackToTrack } from '@/services/music/converters';
import { MusicTrack } from '@/types/music';
import { Track } from '@/services/music/types';

const MusicPlayer = () => {
  const { currentTrack: contextTrack } = useMusic();
  const { 
    isPlaying,
    currentTime,
    duration,
    audioError,
    loadingTrack,
    handleProgressClick,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    volume,
    handleVolumeChange,
    formatTime
  } = useAudioPlayer();
  
  // If no track is selected, show empty state
  if (!contextTrack) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed">
        <Music2 className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Aucune musique sélectionnée</h3>
        <p className="text-muted-foreground">
          Sélectionnez un morceau de musique dans les recommandations ou créez votre propre musique
        </p>
      </div>
    );
  }
  
  const handlePlay = () => {
    // Make sure the track has a duration property before playing
    const trackWithDuration = {
      ...contextTrack,
      duration: contextTrack.duration || 0 // Default to 0 if missing
    };
    
    // Convert MusicTrack to Track if needed before playing
    const trackToPlay = 'url' in trackWithDuration ? 
      trackWithDuration as Track : 
      convertMusicTrackToTrack(trackWithDuration as MusicTrack);
    
    playTrack(trackToPlay);
  };
  
  return (
    <div className="rounded-md border p-4 bg-background">
      <TrackInfo 
        currentTrack={contextTrack} 
        loadingTrack={loadingTrack} 
        audioError={audioError} 
      />
      
      <ProgressBar 
        currentTime={currentTime} 
        duration={duration} 
        formatTime={formatTime} 
        handleProgressClick={handleProgressClick} 
      />
      
      <div className="flex items-center justify-between">
        <PlayerControls 
          isPlaying={isPlaying} 
          loadingTrack={loadingTrack} 
          onPlay={handlePlay} 
          onPause={pauseTrack} 
          onPrevious={previousTrack} 
          onNext={nextTrack} 
        />
        
        <VolumeControl 
          volume={volume} 
          onVolumeChange={handleVolumeChange} 
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
