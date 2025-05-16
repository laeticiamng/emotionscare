
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react';

interface AudioControllerProps {
  autoplay?: boolean;
  initialVolume?: number;
  minimal?: boolean;
  className?: string;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  autoplay = false,
  initialVolume = 0.5,
  minimal = false,
  className = ''
}) => {
  const [volume, setVolume] = useState<number>(initialVolume);
  const [isMuted, setIsMuted] = useState<boolean>(!autoplay);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoplay);
  const [audioSrc, setAudioSrc] = useState<string>('/audio/ambient-calm.mp3'); // Placeholder for generated audio

  // This would connect to Music Generator API in production
  useEffect(() => {
    // Simulate loading different audio based on time of day
    const hour = new Date().getHours();
    let audioPath = '/audio/ambient-calm.mp3';
    
    if (hour >= 5 && hour < 12) {
      audioPath = '/audio/ambient-morning.mp3';
    } else if (hour >= 12 && hour < 18) {
      audioPath = '/audio/ambient-afternoon.mp3';
    } else if (hour >= 18 && hour < 22) {
      audioPath = '/audio/ambient-evening.mp3';
    } else {
      audioPath = '/audio/ambient-night.mp3';
    }
    
    setAudioSrc(audioPath);
    
    // Create audio element
    const audioElement = new Audio(audioPath);
    audioElement.loop = true;
    audioElement.volume = isMuted ? 0 : volume;
    
    if (autoplay && !isMuted) {
      audioElement.play().catch(error => {
        console.error('Auto-play prevented:', error);
        setIsPlaying(false);
      });
    }
    
    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, [autoplay, isMuted, volume]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.muted = !isMuted;
    });
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0] || 0;
    setVolume(volumeValue);
    
    if (volumeValue === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
    
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => {
      audio.volume = volumeValue;
    });
  };

  const VolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX size={minimal ? 16 : 20} />;
    if (volume < 0.3) return <Volume size={minimal ? 16 : 20} />;
    if (volume < 0.7) return <Volume1 size={minimal ? 16 : 20} />;
    return <Volume2 size={minimal ? 16 : 20} />;
  };

  if (minimal) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className={`rounded-full ${className}`}
        title={isMuted ? "Activer le son" : "Désactiver le son"}
      >
        <VolumeIcon />
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border shadow-sm ${className}`}>
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={toggleMute}
        title={isMuted ? "Activer le son" : "Désactiver le son"}
      >
        <VolumeIcon />
      </Button>
      
      <div className="w-24">
        <Slider
          value={[isMuted ? 0 : volume]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default AudioController;
