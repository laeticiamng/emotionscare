
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Headphones } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { TimeOfDay, determineTimeOfDay } from '@/constants/defaults';

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(initialVolume);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(determineTimeOfDay());
  const { toast } = useToast();

  useEffect(() => {
    // Initialize audio context on first user interaction
    const handleFirstInteraction = () => {
      if (audioContext) return;
      
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(context);
        
        if (autoplay) {
          setIsPlaying(true);
        }
        
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      } catch (error) {
        console.error("Error initializing audio context:", error);
      }
    };
    
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);
    
    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, [audioContext, autoplay]);

  useEffect(() => {
    // Update music based on time of day
    setTimeOfDay(determineTimeOfDay());
  }, []);

  const togglePlayback = () => {
    // In a real implementation, this would control the Music Generator API
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      // Starting music
      toast({
        title: "Ambiance musicale",
        description: "Votre musique personnalisée est en cours de lecture.",
      });
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    // In a real implementation, adjust the volume of the Music Generator API
  };

  if (minimal) {
    return (
      <Button 
        onClick={togglePlayback}
        variant="ghost" 
        size="icon"
        className={className}
      >
        {isPlaying ? (
          <Headphones className="h-5 w-5 text-primary" />
        ) : (
          <Headphones className="h-5 w-5 text-muted-foreground" />
        )}
      </Button>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button 
        onClick={togglePlayback}
        variant="outline" 
        size="icon" 
        className="rounded-full h-8 w-8"
      >
        {isPlaying ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </Button>

      {isPlaying && (
        <Slider
          defaultValue={[volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-24 h-2"
        />
      )}
    </div>
  );
};

export default AudioController;
