
import React, { useEffect } from 'react';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import TrackInfo from './TrackInfo';
import ProgressBar from './ProgressBar';
import MusicControls from './MusicControls';
import { Card, CardContent } from '@/components/ui/card';

const MusicPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    currentTime, 
    duration, 
    formatTime,
    handleProgressClick,
    loadingTrack
  } = useAudioPlayer();

  useEffect(() => {
    console.group('🔍 MusicPlayer Component Imports');
    console.log('→ TrackInfo    :', typeof TrackInfo, TrackInfo);
    console.log('→ ProgressBar  :', typeof ProgressBar, ProgressBar);
    console.log('→ MusicControls:', typeof MusicControls, MusicControls);
    console.log('→ Card         :', typeof Card, Card);
    console.log('→ CardContent  :', typeof CardContent, CardContent);
    console.groupEnd();
  }, []);

  // Si pas de piste en cours, afficher un message
  if (!currentTrack) {
    return (
      <Card className="w-full bg-muted/20">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Aucune piste sélectionnée</p>
          <p className="text-xs mt-2">Sélectionnez une piste pour commencer</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <TrackInfo 
          currentTrack={currentTrack} 
          loadingTrack={loadingTrack}
        />
        
        <ProgressBar
          currentTime={currentTime}
          duration={duration}
          formatTime={formatTime}
          handleProgressClick={handleProgressClick}
        />
        
        <MusicControls 
          showVolume={true}
          showRepeat={true} 
          showShuffle={true}
        />
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
