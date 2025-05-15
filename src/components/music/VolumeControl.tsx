
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Volume, VolumeX } from 'lucide-react';
import { VolumeControlProps } from '@/types';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume = 0.5,
  onVolumeChange,
  onChange,
  className = '',
  showLabel = false,
  isMuted = false,
  onMuteToggle
}) => {
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    if (onVolumeChange) onVolumeChange(newVolume);
    if (onChange) onChange(newVolume);
  };

  const handleMuteToggle = () => {
    if (onMuteToggle) onMuteToggle();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={handleMuteToggle}
        className="text-muted-foreground hover:text-foreground transition"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <VolumeX size={18} />
        ) : (
          <Volume size={18} />
        )}
      </button>
      
      <Slider
        value={[isMuted ? 0 : volume * 100]}
        min={0}
        max={100}
        step={1}
        onValueChange={handleVolumeChange}
        className="w-24"
      />
      
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8">
          {Math.round(isMuted ? 0 : volume * 100)}%
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
