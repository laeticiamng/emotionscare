
import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface AudioControllerProps {
  minimal?: boolean;
  className?: string;
}

export const AudioController: React.FC<AudioControllerProps> = ({ 
  minimal = false,
  className = ''
}) => {
  const { volume, isPlaying, toggle, adjustVolume } = useAudioPlayer();
  const [showControls, setShowControls] = useState(false);

  return (
    <div className={className}>
      {minimal ? (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setShowControls(true)}
            >
              {isPlaying ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="flex flex-col space-y-4 p-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Musique d'ambiance</h4>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggle()}
                >
                  {isPlaying ? 'Désactiver' : 'Activer'}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <VolumeX className="h-4 w-4" />
                <Slider
                  value={[volume * 100]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(values) => adjustVolume(values[0] / 100)}
                  className="flex-1"
                />
                <Volume2 className="h-4 w-4" />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => toggle()}
            className="flex items-center space-x-2"
          >
            {isPlaying ? (
              <>
                <Volume2 className="h-4 w-4" />
                <span>Musique activée</span>
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4" />
                <span>Musique désactivée</span>
              </>
            )}
          </Button>
          <Slider
            value={[volume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => adjustVolume(values[0] / 100)}
            className="w-24"
          />
        </div>
      )}
    </div>
  );
};
