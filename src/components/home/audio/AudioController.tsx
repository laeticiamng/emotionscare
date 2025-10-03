import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Play, Pause, Volume1, Volume2, VolumeX } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';

const AudioController: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const { toast } = useToast();
  const { isPlaying, volume, setVolume, play, pause, currentTrack } = useMusic();

  const togglePlayback = () => {
    if (isPlaying) {
      pause();
    } else if (currentTrack) {
      play(currentTrack);
    }
    toast({
      title: isPlaying ? 'Audio en pause' : 'Lecture audio',
      description: isPlaying ? 'La lecture audio a été mise en pause' : 'La lecture audio a commencé',
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      setVolume(0);
    } else {
      setVolume(0.5);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume1 />;
    return <Volume2 />;
  };

  return (
    <div className="flex flex-col space-y-4 w-full max-w-md mx-auto p-4 bg-card rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={togglePlayback}>
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
        <div className="flex items-center gap-2 flex-1 ml-4">
          <Button variant="ghost" size="icon" onClick={toggleMute} className="p-1">
            <VolumeIcon />
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default AudioController;
