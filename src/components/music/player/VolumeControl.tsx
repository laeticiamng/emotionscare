// @ts-nocheck

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  className?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
  className = ""
}) => {
  const handleVolumeChange = (values: number[]) => {
    onVolumeChange(values[0]);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onMuteToggle}
        className="h-8 w-8"
        aria-label={isMuted || volume === 0 ? "Réactiver le son" : "Couper le son"}
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      
      <div className="w-20">
        <Slider
          value={[isMuted ? 0 : volume]}
          max={1}
          step={0.1}
          onValueChange={handleVolumeChange}
          className="w-full"
          aria-label="Contrôle du volume"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((isMuted ? 0 : volume) * 100)}
        />
      </div>
    </div>
  );
};

export default VolumeControl;
