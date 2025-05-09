
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import PlayerControls from './PlayerControls';

interface MiniPlayerProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({
  isPlaying = false,
  onPlay = () => console.log('Play clicked'),
  onPause = () => console.log('Pause clicked')
}) => {
  console.log('🔍 Rendering MiniPlayer with props:', { isPlaying });
  
  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-4">
        <div className="text-center mb-3">
          <h3 className="font-medium">
            Music Player
          </h3>
          <p className="text-xs text-muted-foreground">
            Diagnostic version
          </p>
        </div>
        
        <div className="flex justify-center">
          <PlayerControls 
            isPlaying={isPlaying}
            onPlay={onPlay}
            onPause={onPause}
            onPrevious={() => console.log('Previous clicked')}
            onNext={() => console.log('Next clicked')}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MiniPlayer;
