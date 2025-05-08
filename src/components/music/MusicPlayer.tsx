
import React from 'react';
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
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

  console.log("Rendering MusicPlayer with MusicControls:", MusicControls);
  
  if (!MusicControls) {
    console.error("MusicControls is undefined in MusicPlayer component");
    return <div>Error: MusicControls component not found</div>;
  }

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
