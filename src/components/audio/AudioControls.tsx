
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface AudioControlsProps {
  minimal?: boolean;
  className?: string;
}

const AudioControls: React.FC<AudioControlsProps> = ({ minimal = false, className = '' }) => {
  const { preferences, updatePreferences } = useTheme();
  const soundEnabled = preferences?.soundEnabled !== undefined ? preferences.soundEnabled : true;
  const [volume, setVolume] = React.useState(0.5);

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  const toggleMute = () => {
    updatePreferences({
      soundEnabled: !soundEnabled
    });
  };

  if (minimal) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-full bg-background/80 backdrop-blur-sm ${className}`}
        onClick={toggleMute}
      >
        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>
    );
  }

  return (
    <div className={`flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-2 rounded-full ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={toggleMute}
      >
        {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      </Button>
      
      {soundEnabled && (
        <Slider
          className="w-24"
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
        />
      )}
    </div>
  );
};

export default AudioControls;
