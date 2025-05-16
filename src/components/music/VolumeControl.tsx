
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { VolumeControlProps } from '@/types/music';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onChange,
  onVolumeChange,
  isMuted = false,
  onMuteToggle,
  className = '',
  showLabel = false
}) => {
  // Handle volume change - use both onChange and onVolumeChange for backward compatibility
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    if (onChange) {
      onChange(newVolume);
    }
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
  };

  // Get appropriate volume icon based on level or mute status
  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.3) return <Volume className="h-4 w-4" />;
    if (volume < 0.7) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={onMuteToggle}
      >
        <VolumeIcon />
      </Button>
      <Slider
        value={[isMuted ? 0 : volume]}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
        className="flex-1"
      />
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8 text-right">
          {Math.round((isMuted ? 0 : volume) * 100)}%
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
