
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  className?: string;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  className = '',
  onChange,
  showLabel = false
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
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.33) return <Volume className="h-4 w-4" />;
    if (volume < 0.66) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
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
