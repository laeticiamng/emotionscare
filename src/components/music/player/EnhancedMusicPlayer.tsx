
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Heart,
  Share2,
  MoreHorizontal,
  Shuffle,
  Repeat
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';
import WaveformVisualizer from './WaveformVisualizer';
import TrackDetails from './TrackDetails';

interface EnhancedMusicPlayerProps {
  className?: string;
  showVisualizer?: boolean;
  compact?: boolean;
}

const EnhancedMusicPlayer: React.FC<EnhancedMusicPlayerProps> = ({
  className,
  showVisualizer = true,
  compact = false
}) => {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    play,
    pause,
    next,
    previous,
    setVolume,
    seek
  } = useMusic();

  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'one' | 'all'>('off');

  // Format time helper
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }, []);

  // Progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          isPlaying ? pause() : play();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previous();
          break;
        case 'ArrowRight':
          e.preventDefault();
          next();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 0.1));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, volume, play, pause, next, previous, setVolume]);

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seek(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(0.7);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const toggleRepeat = () => {
    const modes: Array<'off' | 'one' | 'all'> = ['off', 'one', 'all'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
  };

  if (!currentTrack) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
              <Play className="h-8 w-8" />
            </div>
            <p>Aucune musique sélectionnée</p>
            <p className="text-sm mt-1">Choisissez un morceau pour commencer</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={cn("w-full max-w-sm", className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-lg flex items-center justify-center">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{currentTrack.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={isPlaying ? pause : play}
              className="h-8 w-8 flex-shrink-0"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full bg-gradient-to-b from-card to-card/50 backdrop-blur-sm", className)}>
      <CardContent className="p-6 space-y-6">
        {/* Track Info & Cover */}
        <TrackDetails track={currentTrack} />

        {/* Waveform Visualizer */}
        {showVisualizer && (
          <div className="h-20">
            <WaveformVisualizer 
              isPlaying={isPlaying}
              progress={progress}
              onSeek={handleSeek}
            />
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            onValueChange={handleSeek}
            className="w-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-between">
          {/* Left Side - Additional Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShuffled(!isShuffled)}
              className={cn("h-8 w-8", isShuffled && "text-primary")}
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={cn("h-8 w-8", isLiked && "text-red-500")}
            >
              <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
            </Button>
          </div>

          {/* Center - Playback Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={previous}
              className="h-10 w-10"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={isPlaying ? pause : play}
              className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 shadow-lg transition-all duration-200 hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6 text-primary-foreground" />
              ) : (
                <Play className="h-6 w-6 text-primary-foreground ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={next}
              className="h-10 w-10"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Right Side - Volume & More */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRepeat}
              className={cn("h-8 w-8", repeatMode !== 'off' && "text-primary")}
            >
              <Repeat className="h-4 w-4" />
              {repeatMode === 'one' && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                  1
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            onMouseEnter={() => setShowVolumeSlider(true)}
            className="h-8 w-8"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <div 
            className={cn(
              "flex-1 transition-all duration-200",
              showVolumeSlider ? "opacity-100" : "opacity-60"
            )}
            onMouseEnter={() => setShowVolumeSlider(true)}
            onMouseLeave={() => setShowVolumeSlider(false)}
          >
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-full"
            />
          </div>
          
          <span className="text-xs text-muted-foreground w-8 text-right">
            {Math.round((isMuted ? 0 : volume) * 100)}%
          </span>
        </div>

        {/* Track Metadata */}
        {currentTrack.emotion && (
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-xs">
              {currentTrack.emotion}
            </Badge>
            {currentTrack.mood && (
              <Badge variant="outline" className="text-xs">
                {currentTrack.mood}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMusicPlayer;
