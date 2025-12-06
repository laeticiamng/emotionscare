// @ts-nocheck

import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Repeat, Shuffle } from 'lucide-react';

interface MusicControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  progress?: number;
  duration?: number;
  onProgressChange?: (value: number) => void;
  showShuffle?: boolean;
  showRepeat?: boolean;
  isMuted?: boolean;
  onToggleMute?: () => void;
  className?: string;
}

const MusicControls: React.FC<MusicControlsProps> = ({ 
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
  volume = 50,
  progress = 0,
  duration = 0,
  onProgressChange,
  showShuffle = false,
  showRepeat = false,
  isMuted = false,
  onToggleMute,
  className = ''
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle volume changes with mute consideration
  const handleVolumeChange = (values: number[]) => {
    if (onVolumeChange) {
      onVolumeChange(values[0]);
      
      // If volume is increased and audio is muted, unmute it
      if (isMuted && values[0] > 0 && onToggleMute) {
        onToggleMute();
      }
    }
  };
  
  return (
    <div className={`flex flex-col w-full gap-2 ${className}`}>
      {/* Slider de progression */}
      {onProgressChange && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatTime(progress)}
          </span>
          <Slider
            value={[progress]}
            max={duration}
            step={1}
            className="flex-grow"
            onValueChange={(values) => onProgressChange(values[0])}
            disabled={!duration}
            aria-label="Progression de la lecture"
          />
          <span className="text-xs text-muted-foreground">
            {formatTime(duration)}
          </span>
        </div>
      )}

      {/* Contrôles principaux */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {onVolumeChange && (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={onToggleMute || (() => onVolumeChange(isMuted ? 50 : 0))}
                aria-label={isMuted ? "Activer le son" : "Couper le son"}
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                className="w-24"
                onValueChange={handleVolumeChange}
                aria-label="Volume"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {showShuffle && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              aria-label="Mode aléatoire"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
          )}

          {onPrevious && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onPrevious}
              aria-label="Piste précédente"
            >
              <SkipBack className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="default" 
            size="icon"
            onClick={isPlaying ? onPause : onPlay}
            className="h-10 w-10 rounded-full"
            aria-label={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          {onNext && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={onNext}
              aria-label="Piste suivante"
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          )}

          {showRepeat && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              aria-label="Répéter"
            >
              <Repeat className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Espace équilibré */}
        <div className="w-24" />
      </div>
    </div>
  );
};

export default MusicControls;
