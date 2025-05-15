
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControllerProps {
  minimal?: boolean;
  className?: string;
  autoplay?: boolean;
  initialVolume?: number;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  minimal = false,
  className = '',
  autoplay = false,
  initialVolume = 0.5
}) => {
  const [volume, setVolume] = useState(initialVolume);
  const [muted, setMuted] = useState(false);
  const [audio] = useState<HTMLAudioElement | null>(typeof Audio !== 'undefined' ? new Audio('/audio/ambient-calm.mp3') : null);

  // Setup audio when component mounts
  useEffect(() => {
    if (audio) {
      audio.volume = volume;
      audio.loop = true;
      
      if (autoplay) {
        // We need to handle autoplay restrictions
        const playPromise = audio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Auto-play was prevented, inform user
            console.log("Autoplay prevented by browser policy");
          });
        }
      }
    }
    
    return () => {
      // Cleanup when component unmounts
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio, autoplay]);

  // Update volume when it changes
  useEffect(() => {
    if (audio) {
      audio.volume = muted ? 0 : volume;
    }
  }, [audio, volume, muted]);

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setMuted(value[0] === 0);
  };

  if (minimal) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMute}
        className={className}
      >
        {muted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMute}
      >
        {muted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </Button>
      <Slider
        value={[muted ? 0 : volume]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
        className="w-24"
      />
    </div>
  );
};
