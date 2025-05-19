
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { VolumeControlProps } from '@/types/music';

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  isMuted = false,
  onMuteToggle,
  className = ''
}) => {
  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0]);
  };

  // Determine which volume icon to display
  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.3) return <Volume size={18} />;
    if (volume < 0.7) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
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
        value={[isMuted ? 0 : volume * 100]}
        min={0}
        max={100}
        step={1}
        className="w-24"
        onValueChange={(values) => handleVolumeChange([values[0] / 100])}
      />
    </div>
  );
};

export default VolumeControl;
