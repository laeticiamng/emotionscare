// @ts-nocheck

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  className = '',
  onChange,
  showLabel = false,
  isMuted = false,
  onMuteToggle
}) => {
  // Use the callback provided, or fall back to onVolumeChange
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (onChange) {
      onChange(newVolume);
    } else {
      onVolumeChange(newVolume);
    }
  };

  const VolumeIcon = () => {
    const volumePercent = Math.round(volume * 100);
    const ariaLabel = isMuted || volume === 0 
      ? 'Volume muet' 
      : `Volume à ${volumePercent} pourcent`;
    
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" onClick={onMuteToggle} style={{cursor: onMuteToggle ? 'pointer' : 'default'}} aria-label={ariaLabel} role={onMuteToggle ? 'button' : undefined} />;
    if (volume < 0.33) return <Volume className="h-4 w-4" onClick={onMuteToggle} style={{cursor: onMuteToggle ? 'pointer' : 'default'}} aria-label={ariaLabel} role={onMuteToggle ? 'button' : undefined} />;
    if (volume < 0.66) return <Volume1 className="h-4 w-4" onClick={onMuteToggle} style={{cursor: onMuteToggle ? 'pointer' : 'default'}} aria-label={ariaLabel} role={onMuteToggle ? 'button' : undefined} />;
    return <Volume2 className="h-4 w-4" onClick={onMuteToggle} style={{cursor: onMuteToggle ? 'pointer' : 'default'}} aria-label={ariaLabel} role={onMuteToggle ? 'button' : undefined} />;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <VolumeIcon />
      <Slider 
        value={[volume]}
        onValueChange={handleVolumeChange}
        min={0}
        max={1}
        step={0.01}
        className="w-24"
        aria-label="Contrôle du volume"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(volume * 100)}
        aria-valuetext={`${Math.round(volume * 100)} pourcent`}
      />
      {showLabel && (
        <span className="text-xs text-muted-foreground w-9">
          {Math.round(volume * 100)}%
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
