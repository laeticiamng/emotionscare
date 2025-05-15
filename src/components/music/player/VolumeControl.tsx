
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume1, Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number) => void;
  onChange?: (volume: number) => void;
  showLabel?: boolean;
  className?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  onChange,
  showLabel = false,
  className = ''
}) => {
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    onVolumeChange(newVolume);
    if (onChange) onChange(newVolume);
  };

  const VolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button 
        className="text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => onVolumeChange(volume > 0 ? 0 : 1)}
      >
        <VolumeIcon />
      </button>
      
      <Slider 
        value={[volume]} 
        min={0} 
        max={1} 
        step={0.01} 
        onValueChange={handleVolumeChange}
        className="w-24"
      />
      
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8">
          {Math.round(volume * 100)}%
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
