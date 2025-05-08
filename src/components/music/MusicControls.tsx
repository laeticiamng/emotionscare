
import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';

interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  showVolume?: boolean;
  showDetails?: boolean;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
  volume = 100,
  showVolume = false,
  showDetails = true
}) => {
  const [isMuted, setIsMuted] = React.useState(false);
  
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause();
    } else {
      onPlay();
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (onVolumeChange) {
      onVolumeChange(isMuted ? volume : 0);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-center gap-2">
        {onPrevious && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onPrevious}
            className="rounded-full"
          >
            <SkipBack className="h-5 w-5" />
          </Button>
        )}
        
        <Button 
          variant="default" 
          size="icon"
          onClick={handlePlayPause}
          className="rounded-full"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        {onNext && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onNext}
            className="rounded-full"
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        )}
        
        {showVolume && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMute}
            className="rounded-full"
          >
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        )}
      </div>
      
      {showDetails && (
        <div className="text-xs text-center text-muted-foreground">
          {isPlaying ? "En cours de lecture" : "En pause"}
        </div>
      )}
    </div>
  );
};

export default MusicControls;
