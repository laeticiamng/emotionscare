
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioControllerProps {
  minimal?: boolean;
  autoplay?: boolean;
  initialVolume?: number;
  className?: string;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  minimal = false,
  autoplay = false,
  initialVolume = 0.5,
  className = '',
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  
  useEffect(() => {
    // In a real implementation, this would initialize the audio player
    console.log('Audio controller initialized with volume:', volume);
    
    if (autoplay) {
      console.log('Auto-playing ambient music');
      // Here you would start playing the music via Music Generator API
    }
    
    // Save preferences to localStorage
    localStorage.setItem('audioVolume', volume.toString());
    localStorage.setItem('audioMuted', isMuted.toString());
    
    return () => {
      // Cleanup audio resources
      console.log('Audio controller unmounted');
    };
  }, []);
  
  useEffect(() => {
    // Update audio volume when volume state changes
    console.log('Volume changed to:', volume);
    localStorage.setItem('audioVolume', volume.toString());
    
    if (volume === 0 && !isMuted) {
      setIsMuted(true);
    } else if (volume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [volume]);
  
  useEffect(() => {
    // Update mute state
    console.log('Mute state changed to:', isMuted);
    localStorage.setItem('audioMuted', isMuted.toString());
  }, [isMuted]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted && volume === 0) {
      setVolume(0.5);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  // If minimal, just show the mute/unmute button
  if (minimal) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className={className}
        title={isMuted ? "Activer le son" : "Désactiver le son"}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
    );
  }
  
  // Full controller with volume slider
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="flex-shrink-0"
        title={isMuted ? "Activer le son" : "Désactiver le son"}
      >
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      <Slider
        value={[isMuted ? 0 : volume]}
        min={0}
        max={1}
        step={0.01}
        onValueChange={handleVolumeChange}
        className="w-24"
      />
    </div>
  );
};
