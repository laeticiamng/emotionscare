
import React, { useState, useEffect } from 'react';
import { Play, Pause, VolumeX, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface AudioControlsProps {
  className?: string;
  minimal?: boolean;
}

const AudioControls: React.FC<AudioControlsProps> = ({ className, minimal = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);

  // Toggle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would trigger actual audio playback
  };

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real app, this would mute/unmute actual audio
  };

  // Handle volume change
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  if (minimal) {
    return (
      <div className={cn("flex items-center space-x-1", className)}>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={togglePlayback}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 rounded-full"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full"
        onClick={togglePlayback}
      >
        {isPlaying ? <Pause size={18} /> : <Play size={18} />}
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon"
        onClick={toggleMute}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </Button>
      
      <Slider
        min={0}
        max={100}
        step={1}
        value={[isMuted ? 0 : volume]}
        onValueChange={handleVolumeChange}
        className="w-24"
      />
    </div>
  );
};

export default AudioControls;
