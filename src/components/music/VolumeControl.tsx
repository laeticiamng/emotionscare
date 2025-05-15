
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VolumeControlProps {
  volume?: number;
  onChange?: (value: number) => void;
  onVolumeChange?: (value: number) => void;
  className?: string;
  showLabel?: boolean;
  isMuted?: boolean;
  onMuteToggle?: () => void;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume = 50,
  onChange,
  onVolumeChange,
  className = '',
  showLabel = false,
  isMuted = false,
  onMuteToggle,
}) => {
  const handleValueChange = (values: number[]) => {
    const newVolume = values[0];
    if (onChange) {
      onChange(newVolume);
    }
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) {
      return <VolumeX size={16} />;
    }
    if (volume < 33) {
      return <Volume size={16} />;
    }
    if (volume < 66) {
      return <Volume1 size={16} />;
    }
    return <Volume2 size={16} />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="ghost" 
        size="sm"
        className="p-1 rounded-full h-7 w-7"
        onClick={onMuteToggle}
      >
        <VolumeIcon />
      </Button>
      
      <Slider
        value={[isMuted ? 0 : volume]}
        max={100}
        step={1}
        onValueChange={handleValueChange}
        className="w-24"
      />
      
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8">
          {isMuted ? '0%' : `${Math.round(volume)}%`}
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
