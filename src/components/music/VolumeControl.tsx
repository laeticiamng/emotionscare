
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { VolumeControlProps } from '@/types/music';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  onChange, // This is now properly defined in VolumeControlProps
  className = ""
}) => {
  const handleVolumeChange = (value: number[]) => {
    if (onVolumeChange) {
      onVolumeChange(value[0]);
    }
    if (onChange) {
      onChange(value[0]);
    }
  };

  return (
    <Slider
      defaultValue={[0.7]}
      value={[volume]}
      max={1}
      step={0.01}
      onValueChange={handleVolumeChange}
      className={className}
    />
  );
};

export default VolumeControl;
