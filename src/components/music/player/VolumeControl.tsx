
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { VolumeControlProps } from '@/types/music';

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  muted,
  onVolumeChange,
  onMuteToggle
}) => {
  const handleVolumeChange = (values: number[]) => {
    onVolumeChange(values[0]);
  };
  
  // Determine which icon to display based on volume level and mute state
  const VolumeIcon = () => {
    if (muted) return <VolumeX className="h-4 w-4" />;
    if (volume > 0.7) return <Volume2 className="h-4 w-4" />;
    if (volume > 0.2) return <Volume1 className="h-4 w-4" />;
    return <Volume className="h-4 w-4" />;
  };
  
  return (
    <div className="flex items-center space-x-4">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={onMuteToggle}
      >
        <VolumeIcon />
      </Button>
      
      <Slider
        value={[muted ? 0 : volume * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={(values) => handleVolumeChange([values[0] / 100])}
        className="w-full"
      />
    </div>
  );
};

export default VolumeControl;
