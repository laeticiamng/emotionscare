
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Music, Music2, Check } from 'lucide-react';

interface VRSessionControlsProps {
  isPaused: boolean;
  isAudioOnly: boolean;
  isMusicPlaying: boolean;
  onTogglePause: () => void;
  onToggleMusic: () => void;
  onComplete: () => void;
}

const VRSessionControls: React.FC<VRSessionControlsProps> = ({
  isPaused,
  isAudioOnly,
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
          className="flex items-center"
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
        className="flex items-center"
      >
        {isMusicPlaying ? (
          <>
            <Music className="h-4 w-4 mr-2" />
            Désactiver musique
          </>
        ) : (
          <>
            <Music2 className="h-4 w-4 mr-2" />
            Ajouter musique d'ambiance
          </>
        )}
      </Button>
      
      <Button 
        onClick={onComplete}
        variant="default"
        className="flex items-center"
      >
        <Check className="h-4 w-4 mr-2" />
        Terminer la session
      </Button>
    </div>
  );
};

export default VRSessionControls;
