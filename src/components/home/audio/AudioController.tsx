
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Volume2, 
  VolumeX, 
  Volume1, 
  Music, 
  Play, 
  Pause 
} from 'lucide-react';
import { useMusic } from '@/contexts/music/MusicContext';

interface AudioControllerProps {
  minimal?: boolean;
  className?: string;
}

export const AudioController: React.FC<AudioControllerProps> = ({
  minimal = false,
  className = ""
}) => {
  const { 
    isPlaying, 
    currentTrack, 
    volume, 
    setVolume,
    togglePlay 
  } = useMusic();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Close controls when clicking outside
  useEffect(() => {
    if (isOpen) {
      const handleClickOutside = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest('.audio-controller')) {
          setIsOpen(false);
        }
      };
      
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };
  
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX className="h-4 w-4" />;
    if (volume < 0.5) return <Volume1 className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };
  
  if (minimal) {
    return (
      <div className={`audio-controller relative ${className}`}>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsOpen(!isOpen)}
          className="text-muted-foreground hover:text-foreground"
        >
          <Music className="h-4 w-4" />
        </Button>
        
        {isOpen && (
          <div className="absolute bottom-full right-0 mb-2 bg-background border rounded-lg shadow-lg p-3 min-w-[200px] z-50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Musique ambiante</span>
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-7 w-7"
                onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
              >
                {getVolumeIcon()}
              </Button>
              <Slider
                defaultValue={[volume]}
                max={1}
                step={0.01}
                value={[volume]}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
            
            {currentTrack && (
              <div className="text-xs text-muted-foreground mt-2 truncate">
                {currentTrack.title}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className={`audio-controller flex items-center gap-2 ${className}`}>
      <Button 
        size="icon" 
        variant="ghost"
        onClick={togglePlay}
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      
      <div className="flex items-center gap-2">
        <Button 
          size="icon" 
          variant="ghost"
          onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
        >
          {getVolumeIcon()}
        </Button>
        <Slider
          defaultValue={[volume]}
          max={1}
          step={0.01}
          value={[volume]}
          onValueChange={handleVolumeChange}
          className="w-24"
        />
      </div>
      
      {currentTrack && (
        <div className="text-sm ml-2 truncate max-w-[150px]">
          {currentTrack.title}
        </div>
      )}
    </div>
  );
};

export default AudioController;
