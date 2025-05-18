
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { VolumeControlProps } from '@/types/music';

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  muted,
  onVolumeChange,
  onMuteToggle
}) => {
  // Helper to determine volume icon
  const VolumeIcon = () => {
    if (muted || volume === 0) return <VolumeX />;
    if (volume < 0.3) return <Volume />;
    if (volume < 0.7) return <Volume1 />;
    return <Volume2 />;
  };

  // Handle volume slider change
  const handleVolumeChange = (value: number[]) => {
    onVolumeChange(value[0]);
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-full" 
        onClick={onMuteToggle}
      >
        <VolumeIcon />
      </Button>
      
      <Slider
        className="w-24"
        value={[muted ? 0 : volume]}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
      />
    </div>
  );
};
