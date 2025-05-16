
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Music, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AudioControllerProps {
  initialVolume?: number;
  autoplay?: boolean;
  minimal?: boolean;
  className?: string;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  initialVolume = 0.5,
  autoplay = false,
  minimal = false,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  
  // Demo audio URLs - in production would be from a proper audio service
  const ambientTracks = [
    'https://cdn.pixabay.com/download/audio/2022/03/15/audio_8cb749d484.mp3?filename=peaceful-garden-healing-light-piano-for-meditation-yoga-spa-zen-32999.mp3',
    'https://cdn.pixabay.com/download/audio/2022/07/18/audio_62e918df4c.mp3?filename=emotional-piano-141356.mp3',
    'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d16737dc28.mp3?filename=relaxing-mountains-rivers-meditation-music-22530.mp3'
  ];
  
  // Select a track based on the time of day
  const getTimeBasedTrack = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return ambientTracks[0]; // Morning
    if (hour >= 12 && hour < 17) return ambientTracks[1]; // Afternoon
    return ambientTracks[2]; // Evening/Night
  };

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio(getTimeBasedTrack());
      audio.volume = initialVolume;
      audio.loop = true;
      audioRef.current = audio;
      
      // Handle autoplay
      if (autoplay) {
        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch(() => {
            // Autoplay was prevented, update state
            setIsPlaying(false);
          });
        }
      }
    }
    
    return () => {
      // Clean up on component unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [autoplay, initialVolume]);
  
  useEffect(() => {
    // Update audio volume when volume state changes
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  const togglePlayback = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise) {
          playPromise.catch((error) => {
            console.error("Playback error:", error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (isMuted && value[0] > 0) {
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.muted = false;
      }
    }
  };
  
  if (minimal) {
    return (
      <div 
        className={cn("relative", className)}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayback}
          className={`${isPlaying ? 'text-primary' : 'text-muted-foreground'}`}
        >
          <Music className="h-4 w-4" />
          <span className="sr-only">{isPlaying ? 'Pause' : 'Play'} ambiance</span>
        </Button>
        
        {expanded && (
          <div className="absolute right-0 top-10 z-50 bg-background/80 backdrop-blur-md border rounded-lg p-3 shadow-lg flex flex-col items-center gap-2 w-48">
            <Button
              variant={isPlaying ? "default" : "outline"}
              size="sm"
              onClick={togglePlayback}
              className="w-full"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <div className="flex items-center gap-2 w-full">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="flex-shrink-0"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        variant={isPlaying ? "default" : "outline"}
        onClick={togglePlayback}
        size="sm"
        className="flex-shrink-0"
      >
        <Music className="mr-2 h-4 w-4" />
        {isPlaying ? 'Pause' : 'Play'}
      </Button>
      
      <div className="flex items-center gap-2 min-w-[150px]">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="flex-shrink-0"
        >
          {isMuted || volume === 0 ? (
            <VolumeX className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default AudioController;
