
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle,
  Heart,
  MoreHorizontal
} from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { cn } from '@/lib/utils';
import TrackDetails from './TrackDetails';
import WaveformVisualizer from './WaveformVisualizer';
import PlayerKeyboardShortcuts from './PlayerKeyboardShortcuts';
import { MusicTrack } from '@/types/music';

interface EnhancedMusicPlayerProps {
  track?: MusicTrack | null;
  className?: string;
  size?: 'compact' | 'normal' | 'expanded';
  showWaveform?: boolean;
  showKeyboardShortcuts?: boolean;
}

const EnhancedMusicPlayer: React.FC<EnhancedMusicPlayerProps> = ({
  track,
  className,
  size = 'normal',
  showWaveform = true,
  showKeyboardShortcuts = true
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
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const activeTrack = track || currentTrack;

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVolumeToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setVolume(newMuted ? 0 : 0.7);
  };

  const handleSeek = (values: number[]) => {
    const time = (values[0] / 100) * (duration || 0);
    seek(time);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  if (!activeTrack) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Play className="h-8 w-8" />
            </div>
            <p>Aucune musique sélectionnée</p>
            <p className="text-sm mt-1">Choisissez un morceau pour commencer</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sizeClasses = {
    compact: 'p-4 space-y-3',
    normal: 'p-6 space-y-4',
    expanded: 'p-8 space-y-6'
  };

  return (
    <>
      {showKeyboardShortcuts && (
        <PlayerKeyboardShortcuts enabled={true} showTooltips={false} />
      )}
      
      <Card className={cn("w-full bg-gradient-to-br from-background to-muted/20", className)}>
        <CardContent className={sizeClasses[size]}>
          {/* Track Details */}
          <TrackDetails 
            track={activeTrack} 
            size={size === 'compact' ? 'sm' : size === 'expanded' ? 'lg' : 'md'}
            className="mb-4"
          />

          {/* Waveform Visualizer */}
          {showWaveform && size !== 'compact' && (
            <div className="h-16 mb-4">
              <WaveformVisualizer
                isPlaying={isPlaying || false}
                progress={progress}
                onSeek={handleSeek}
                className="h-full"
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
              className="cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime || 0)}</span>
              <span>{formatTime(duration || 0)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsShuffle(!isShuffle)}
              className={cn(
                "h-8 w-8",
                isShuffle && "text-primary"
              )}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

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
              className="h-12 w-12 rounded-full"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
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

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRepeat(!isRepeat)}
              className={cn(
                "h-8 w-8",
                isRepeat && "text-primary"
              )}
            >
              <Repeat className="h-4 w-4" />
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between">
            {/* Volume Control */}
            <div className="flex items-center gap-2 flex-1 max-w-32">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleVolumeToggle}
                className="h-8 w-8 flex-shrink-0"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[isMuted ? 0 : (volume || 0) * 100]}
                max={100}
                step={1}
                onValueChange={(values) => {
                  const newVolume = values[0] / 100;
                  setVolume(newVolume);
                  setIsMuted(newVolume === 0);
                }}
                className="flex-1"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={cn(
                  "h-8 w-8",
                  isLiked && "text-red-500"
                )}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
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
        </CardContent>
      </Card>
    </>
  );
};

export default EnhancedMusicPlayer;
