
import React from 'react';
import { useAmbientSound } from './useAmbientSound';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Music, HeadphonesIcon } from 'lucide-react';

interface AudioControllerProps {
  autoplay?: boolean;
  initialVolume?: number;
  className?: string;
  minimal?: boolean;
}

export function AudioController({ 
  autoplay = false, 
  initialVolume = 0.3,
  className = '',
  minimal = false
}: AudioControllerProps) {
  const { 
    isPlaying, 
    toggle, 
    volume, 
    adjustVolume, 
    mood 
  } = useAmbientSound({
    autoplay,
    volume: initialVolume,
    fadeIn: true
  });
  
  const handleVolumeChange = (value: number[]) => {
    adjustVolume(value[0]);
  };
  
  if (minimal) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 h-9 w-9 rounded-full ${className}`}
        onClick={toggle}
        title={isPlaying ? "Désactiver l'ambiance sonore" : "Activer l'ambiance sonore"}
      >
        <HeadphonesIcon className="h-4 w-4" />
      </Button>
    );
  }
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        className="p-2 h-9 w-9 rounded-full"
        onClick={toggle}
      >
        <Music className="h-4 w-4" />
      </Button>
      
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">
            {isPlaying ? 'Ambiance sonore active' : 'Ambiance sonore'}
          </span>
          <span className="text-xs capitalize">{mood}</span>
        </div>
        
        <Slider
          defaultValue={[initialVolume]}
          max={1}
          step={0.01}
          value={[volume]}
          onValueChange={handleVolumeChange}
          className="w-32"
        />
      </div>
    </div>
  );
}
