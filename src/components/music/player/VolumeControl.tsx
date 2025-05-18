
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { VolumeControlProps } from '@/types/music';

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  muted,
  onVolumeChange,
  onMuteToggle
}) => {
  // Déterminer quelle icône de volume afficher
  const VolumeIcon = () => {
    if (muted || volume === 0) return <VolumeX size={18} />;
    if (volume < 0.3) return <Volume size={18} />;
    if (volume < 0.7) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1"
        onClick={onMuteToggle}
      >
        <VolumeIcon />
      </Button>
      <Slider
        value={[muted ? 0 : volume * 100]}
        min={0}
        max={100}
        onValueChange={(value) => onVolumeChange(value[0] / 100)}
        className="w-full max-w-40"
      />
      <span className="text-xs text-muted-foreground w-9">
        {Math.round((muted ? 0 : volume) * 100)}%
      </span>
    </div>
  );
};
