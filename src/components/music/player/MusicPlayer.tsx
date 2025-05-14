
import React, { useState, useRef, useEffect } from 'react';
import { MusicTrack } from '@/types/music';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';

interface MusicPlayerProps {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  togglePlay: () => void;
  nextTrack?: () => void;
  prevTrack?: () => void;
  onVolumeChange?: (volume: number) => void;
  onProgressChange?: (progress: number) => void;
  minimized?: boolean;
  onMaximize?: () => void;
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  currentTrack,
  isPlaying,
  togglePlay,
  nextTrack,
  prevTrack,
  onVolumeChange,
  onProgressChange,
  minimized = false,
  onMaximize,
  className = '',
}) => {
  const [volume, setVolume] = useState<number>(0.7);
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();
  
  // Format time helper function
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (onVolumeChange) onVolumeChange(volume);
    }
  }, [volume, onVolumeChange]);
  
  // Set up audio progress tracking
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const currentProgress = audioRef.current.currentTime;
          setProgress(currentProgress);
          if (onProgressChange) onProgressChange(currentProgress);
        }
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, onProgressChange]);
  
  // Reset progress when track changes
  useEffect(() => {
    setProgress(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [currentTrack]);
  
  // Toggle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  const handleProgressChange = (values: number[]) => {
    const newProgress = values[0];
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress;
      setProgress(newProgress);
      if (onProgressChange) onProgressChange(newProgress);
    }
  };
  
  const handleVolumeChange = (values: number[]) => {
    const newVolume = values[0];
    setVolume(newVolume);
  };
  
  // Get cover URL with fallback
  const getCoverUrl = () => {
    return currentTrack?.coverUrl || currentTrack?.cover_url || currentTrack?.cover || '/images/default-album-art.png';
  };
  
  if (minimized) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-3">
          <div className="flex items-center">
            <div className="w-10 h-10 mr-3 bg-muted rounded overflow-hidden">
              {currentTrack ? (
                <img 
                  src={getCoverUrl()} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              {currentTrack ? (
                <>
                  <p className="font-medium text-sm truncate">{currentTrack.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Aucune piste sélectionnée</p>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              disabled={!currentTrack}
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            {onMaximize && (
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onMaximize}>
                <Music className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        {/* Audio Element */}
        <audio 
          ref={audioRef} 
          src={currentTrack?.url || currentTrack?.audioUrl} 
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            if (nextTrack) nextTrack();
          }}
        />
        
        <div className="space-y-4">
          {/* Album Art and Track Info */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 bg-muted rounded-md overflow-hidden mb-4">
              {currentTrack ? (
                <img 
                  src={getCoverUrl()} 
                  alt={currentTrack.title} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="font-medium text-lg">
                {currentTrack?.title || 'Aucune piste sélectionnée'}
              </h3>
              <p className="text-muted-foreground">
                {currentTrack?.artist || 'Artiste inconnu'}
              </p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-1">
            <Slider 
              value={[progress]} 
              max={duration || 100} 
              step={1} 
              onValueChange={handleProgressChange} 
              disabled={!currentTrack}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex justify-center items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              disabled={!currentTrack || !prevTrack}
              onClick={prevTrack}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-12 w-12"
              disabled={!currentTrack}
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10"
              disabled={!currentTrack || !nextTrack}
              onClick={nextTrack}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
            >
              {volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider 
              value={[volume]} 
              max={1} 
              step={0.01} 
              onValueChange={handleVolumeChange} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
