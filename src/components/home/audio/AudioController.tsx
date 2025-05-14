
import React from 'react';
import useAmbientSound from './useAmbientSound';
import { Button } from '@/components/ui/button';
import { Volume, VolumeX, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface AudioControllerProps {
  className?: string;
}

const AudioController: React.FC<AudioControllerProps> = ({ className }) => {
  const ambientSound = useAmbientSound();
  
  const { 
    isPlaying, 
    toggle, 
    volume, 
    changeVolume, 
    currentMood, 
    changeMood 
  } = ambientSound;

  const handleVolumeChange = (values: number[]) => {
    changeVolume(values[0]);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggle}
        title={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
      >
        {isPlaying ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </Button>
      
      {isPlaying && (
        <Slider 
          className="w-24" 
          value={[volume]} 
          min={0} 
          max={1} 
          step={0.01} 
          onValueChange={handleVolumeChange} 
        />
      )}
    </div>
  );
};

export default AudioController;
