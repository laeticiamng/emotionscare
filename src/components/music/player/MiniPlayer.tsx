
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import PlayerControls from './PlayerControls';
import { Music, Waveform } from 'lucide-react';

interface MiniPlayerProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePlay = () => {
    setIsPlaying(true);
    console.log('Play clicked');
  };
  
  const handlePause = () => {
    setIsPlaying(false);
    console.log('Pause clicked');
  };
  
  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-xl">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-base">
              Musicothérapie
            </h3>
            <p className="text-xs text-muted-foreground">
              Écoutez de la musique pour améliorer votre bien-être
            </p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="w-full bg-muted rounded-lg h-2 overflow-hidden">
            <div className="bg-primary h-full w-1/3"></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1:15</span>
            <span>3:45</span>
          </div>
          <div className="flex justify-center">
            <PlayerControls 
              isPlaying={isPlaying}
              onPlay={handlePlay}
              onPause={handlePause}
              onPrevious={() => console.log('Previous clicked')}
              onNext={() => console.log('Next clicked')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniPlayer;
