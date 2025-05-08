
import React from 'react';
import { Volume2, Volume1, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { VolumeControlProps } from '@/types/audio-player';

/**
 * Volume slider with icon that changes based on volume level
 */
const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange
}) => {
  // Choose volume icon based on level
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  
  return (
    <div className="flex items-center gap-2 w-28">
      <VolumeIcon size={18} className="text-muted-foreground" />
      <Slider
        value={[volume * 100]}
        max={100}
        step={1}
        onValueChange={onVolumeChange}
        className="flex-1"
      />
    </div>
  );
};

export default VolumeControl;
