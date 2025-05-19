
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface VolumeControlProps {
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onMuteToggle: () => void;
  className?: string;
}

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  isMuted,
  onMuteToggle,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={onMuteToggle}
        className="h-8 w-8"
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume className="h-4 w-4" />
        )}
      </Button>
      <Slider
        className="w-24"
        value={[isMuted ? 0 : volume * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={(value) => {
          onVolumeChange(value[0] / 100);
        }}
      />
    </div>
  );
};

export default VolumeControl;
