
import React from 'react';
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
// Import direct pour éviter les références circulaires potentielles
import MusicControls from './MusicControls';

interface MusicPlayerProps {
  // Add props if needed
}

const MusicPlayer: React.FC<MusicPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  
  const handlePlay = () => {
    console.log("Play triggered");
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    console.log("Pause triggered");
    setIsPlaying(false);
  };

  return (
    <Card className="music-player">
      <CardHeader>
        <CardTitle className="text-lg">Lecteur musical</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="py-4">
          <p className="text-muted-foreground mb-2">Aucun titre en cours de lecture</p>
        </div>
        
        <MusicControls 
          isPlaying={isPlaying} 
          onPlay={handlePlay}
          onPause={handlePause}
        />
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
