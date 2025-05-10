
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { VolumeControlProps } from '@/types';
import { cn } from '@/lib/utils';

const VolumeControl: React.FC<VolumeControlProps> = ({ 
  volume, 
  onVolumeChange,
  showLabel = false,
  className = ''
}) => {
  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.3) return <Volume className="h-4 w-4" />;
    if (volume < 0.7) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <VolumeIcon />
      
      <Slider
        value={[volume * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={(values) => onVolumeChange(values[0] / 100)}
        className="w-24"
        aria-label="Volume"
      />
      
      {showLabel && (
        <span className="text-xs w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
