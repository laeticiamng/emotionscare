
import React from 'react';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { VolumeControlProps } from '@/types';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onChange,
  onVolumeChange,
  showLabel = false,
  className = ''
}) => {
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    onChange(newVolume);
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 0.33) return <Volume size={18} />;
    if (volume < 0.66) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={() => onChange(volume > 0 ? 0 : 1)}
        className="text-muted-foreground hover:text-foreground focus:outline-none"
        aria-label={volume > 0 ? "Mute" : "Unmute"}
      >
        <VolumeIcon />
      </button>
      
      <Slider
        value={[volume * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={(value) => handleVolumeChange([value[0] / 100])}
        className="w-24"
      />
      
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
