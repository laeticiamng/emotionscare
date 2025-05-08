
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

interface MusicControlsProps {
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying = false,
  onPlay = () => {},
  onPause = () => {},
  onNext = () => {},
  onPrevious = () => {}
}) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button variant="ghost" size="icon" onClick={onPrevious}>
        <SkipBack className="h-5 w-5" />
      </Button>
      
      <Button 
        variant="outline" 
        size="icon" 
        className="rounded-full h-10 w-10" 
        onClick={isPlaying ? onPause : onPlay}
      >
        {isPlaying ? 
          <Pause className="h-5 w-5" /> : 
          <Play className="h-5 w-5" />
        }
      </Button>
      
      <Button variant="ghost" size="icon" onClick={onNext}>
        <SkipForward className="h-5 w-5" />
      </Button>
      
      <Volume2 className="h-5 w-5 text-muted-foreground ml-2" />
    </div>
  );
};

export default MusicControls;
