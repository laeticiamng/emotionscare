
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VolumeControlProps } from '@/types/music';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  muted,
  onChange,
  onMuteToggle,
  className = '',
  onVolumeChange = onChange,
  isMuted = muted,
  showLabel = false
}) => {
  const handleVolumeChange = (value: number[]) => {
    if (onVolumeChange) {
      onVolumeChange(value[0]);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={onMuteToggle}
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume className="h-4 w-4" />
        )}
        <span className="sr-only">{isMuted ? 'Unmute' : 'Mute'}</span>
      </Button>
      
      <Slider 
        defaultValue={[isMuted ? 0 : volume]} 
        value={[isMuted ? 0 : volume]} 
        max={1} 
        step={0.01} 
        className="w-20"
        onValueChange={(value) => handleVolumeChange(value)}
      />
      
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8 text-right">
          {Math.round(volume * 100)}%
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
