
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export interface AudioControllerProps {
  audioUrl?: string;
  autoPlay?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  className?: string;
  showControls?: boolean;
  loop?: boolean;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  audioUrl,
  autoPlay = false,
  onPlay,
  onPause,
  onEnded,
  className = '',
  showControls = true,
  loop = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        onPause?.();
      } else {
        audioRef.current.play()
          .then(() => {
            onPlay?.();
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
          });
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

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    onEnded?.();
  };

  React.useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          onPlay?.();
        })
        .catch((error) => {
          console.error('Auto-play error:', error);
        });
    }
  }, [autoPlay, onPlay]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <audio 
        ref={audioRef} 
        src={audioUrl} 
        loop={loop}
        onEnded={handleEnded}
      />

      {showControls && (
        <div className="flex items-center gap-4">
          <Button
            size="sm"
            variant="outline"
            className="w-10 h-10 rounded-full"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </Button>

          <div className="flex items-center gap-2 flex-1">
            <Button
              size="sm"
              variant="ghost"
              className="w-8 h-8 p-0"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            <Slider 
              className="flex-1" 
              defaultValue={[volume]} 
              max={1} 
              step={0.01}
              onValueChange={handleVolumeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioController;
