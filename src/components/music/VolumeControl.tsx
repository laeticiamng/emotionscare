
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { VolumeControlProps } from '@/types/music';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  onChange,
  className = "",
  showLabel = false
}) => {
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
    
    if (onChange) {
      onChange(newVolume);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8 text-right">{Math.round(volume * 100)}%</span>
      )}
      <Slider
        defaultValue={[volume]}
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
        className="flex-1"
      />
    </div>
  );
};

export default VolumeControl;
