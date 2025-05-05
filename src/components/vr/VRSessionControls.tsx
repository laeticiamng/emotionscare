
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, Headphones } from 'lucide-react';

interface VRSessionControlsProps {
  isAudioOnly: boolean;
  isPaused: boolean;
  isMusicPlaying: boolean;
  onTogglePause: () => void;
  onToggleMusic: () => void;
  onComplete: () => void;
}

const VRSessionControls: React.FC<VRSessionControlsProps> = ({
  isAudioOnly,
  isPaused,
  isMusicPlaying,
  onTogglePause,
  onToggleMusic,
  onComplete
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
      {isAudioOnly && (
        <Button 
          onClick={onTogglePause}
          variant="outline"
        >
          {isPaused ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Reprendre
            </>
          ) : (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          )}
        </Button>
      )}
      
      <Button 
        onClick={onToggleMusic}
        variant="outline"
        className={isMusicPlaying ? "bg-primary/10" : ""}
      >
        {isMusicPlaying ? (
          <>
            <Music className="h-4 w-4 mr-2" />
            Arrêter la musique
          </>
        ) : (
          <>
            <Headphones className="h-4 w-4 mr-2" />
            Ajouter musique
          </>
        )}
      </Button>
      
      <Button 
        onClick={onComplete}
        variant={isAudioOnly ? "outline" : "default"}
      >
        Terminer la session
      </Button>
    </div>
  );
};

export default VRSessionControls;
