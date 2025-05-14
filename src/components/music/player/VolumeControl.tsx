
import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Volume, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VolumeControlProps } from '@/types/music';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onChange,
  onVolumeChange, // Add onVolumeChange prop
  showLabel = true,
  className = ''
}) => {
  const handleVolumeChange = (values: number[]) => {
    onChange(values[0]);
    if (onVolumeChange) {
      onVolumeChange(values[0]);
    }
  };

  const isMuted = volume === 0;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="ghost" 
        size="icon"
        className="h-8 w-8 p-0"
        onClick={() => handleVolumeChange([isMuted ? 50 : 0])}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Volume className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>
      
      <Slider
        value={[volume]}
        max={100}
        step={1}
        className="w-24"
        onValueChange={handleVolumeChange}
      />
      
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8">
          {Math.round(volume)}%
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
