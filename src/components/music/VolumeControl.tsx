
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { VolumeControlProps } from '@/types';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume = 0.5,
  onChange,
  onVolumeChange,
  className = '',
  showLabel = false,
  isMuted = false,
  onMuteToggle
}) => {
  const handleVolumeChange = (value: number[]) => {
    const vol = value[0];
    if (onChange) onChange(vol);
    if (onVolumeChange) onVolumeChange(vol);
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={16} />;
    if (volume < 0.3) return <Volume size={16} />;
    if (volume < 0.7) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <button 
          className="text-muted-foreground hover:text-foreground cursor-pointer"
          onClick={onMuteToggle}
        >
          <VolumeIcon />
        </button>
      )}
      
      <Slider
        value={[isMuted ? 0 : volume]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
        className="cursor-pointer"
      />
    </div>
  );
};

export default VolumeControl;
