
import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume, Volume2, VolumeX } from 'lucide-react';
import { VolumeControlProps } from '@/types/audio-player';

const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  onVolumeChange,
  showLabel = false,
  className = ''
}) => {
  const [isMuted, setIsMuted] = React.useState(volume === 0);
  const [prevVolume, setPrevVolume] = React.useState(volume > 0 ? volume : 0.5);

  const handleToggleMute = () => {
    if (isMuted) {
      // Unmute
      setIsMuted(false);
      onVolumeChange(prevVolume);
    } else {
      // Mute
      setIsMuted(true);
      setPrevVolume(volume);
      onVolumeChange(0);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    onVolumeChange(newVolume);
    setIsMuted(newVolume === 0);
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume />;
    return <Volume2 />;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        variant="ghost" 
        size="sm" 
        className="p-1 h-8 w-8" 
        onClick={handleToggleMute}
      >
        {getVolumeIcon()}
      </Button>
      
      <Slider
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
        className="w-24"
      />
      
      {showLabel && (
        <span className="text-xs text-muted-foreground w-8">
          {Math.round(volume * 100)}%
        </span>
      )}
    </div>
  );
};

export default VolumeControl;
