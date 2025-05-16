
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { VolumeControlProps } from '@/types/music';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume = 0.5,
  onChange,
  onVolumeChange,
  className = "",
  showLabel = false,
  isMuted = false,
  onMuteToggle,
  size = 'md',
  orientation = 'horizontal',
  showIcon = true
}) => {
  // Convert volume to percentage for UI (if it's a decimal)
  const volumePercentage = volume > 1 ? volume : volume * 100;
  
  const getVolumeIcon = () => {
    if (isMuted || volumePercentage === 0) return <VolumeX />;
    if (volumePercentage < 30) return <Volume />;
    if (volumePercentage < 70) return <Volume1 />;
    return <Volume2 />;
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    if (onChange) onChange(newVolume > 1 ? newVolume : newVolume / 100);
    if (onVolumeChange) onVolumeChange(newVolume > 1 ? newVolume : newVolume / 100);
  };

  const handleMuteToggle = () => {
    if (onMuteToggle) onMuteToggle();
  };

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }[size];

  return (
    <div className={`flex items-center gap-2 ${className} ${orientation === 'vertical' ? 'flex-col' : ''}`}>
      {showIcon && (
        <Button
          variant="ghost"
          size="icon"
          className={`${size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8'}`}
          onClick={handleMuteToggle}
        >
          <span className={iconSize}>{getVolumeIcon()}</span>
        </Button>
      )}
      
      <Slider
        value={[volumePercentage]}
        max={100}
        step={1}
        onValueChange={handleVolumeChange}
        className={orientation === 'vertical' ? 'h-24' : 'flex-1'}
        orientation={orientation}
      />
      
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8 text-right">
          {Math.round(volumePercentage)}%
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
