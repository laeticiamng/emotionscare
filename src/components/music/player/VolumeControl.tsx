
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VolumeControlProps } from '@/types/music';

const VolumeControl: React.FC<VolumeControlProps> = ({ 
  volume = 0.5, 
  isMuted = false,
  onVolumeChange = () => {},
  onMuteToggle = () => {},
  className = "",
}) => {
  // Determine which volume icon to show
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={16} />;
    if (volume < 0.3) return <Volume size={16} />;
    if (volume < 0.7) return <Volume1 size={16} />;
    return <Volume2 size={16} />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={onMuteToggle}
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {getVolumeIcon()}
      </Button>
      
      <Slider 
        value={[isMuted ? 0 : volume * 100]}
        min={0}
        max={100}
        step={1}
        className="w-24"
        onValueChange={(values) => onVolumeChange(values[0] / 100)}
        aria-label="Volume"
      />
    </div>
  );
};

export default VolumeControl;
