
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PlayerControls from './PlayerControls';
import { useMusicControls } from '@/hooks/useMusicControls';

const SimpleMusicPlayer: React.FC = () => {
  const {
    isPlaying,
    play,
    pause,
    togglePlayPause
  } = useMusicControls();

  const handlePrevious = () => {
    console.log('Previous track');
  };

  const handleNext = () => {
    console.log('Next track');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Lecteur Musical</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="font-medium">Aucune piste sélectionnée</p>
          <p className="text-sm text-muted-foreground">Choisissez une musique pour commencer</p>
        </div>
        
        <PlayerControls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />
      </CardContent>
    </Card>
  );
};

export default SimpleMusicPlayer;
