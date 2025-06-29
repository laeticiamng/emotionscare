
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useEmotionsCareMusicContext } from '@/contexts/EmotionsCareMusicContext';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';

const EmotionsCareMusicPlayer: React.FC = () => {
  const {
    currentPlaylist,
    currentTrack,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    play,
    pause,
    nextTrack,
    previousTrack,
    setVolume,
    clearPlaylist
  } = useEmotionsCareMusicContext();

  if (!currentPlaylist) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="fixed bottom-4 right-4 w-96 z-50 shadow-xl border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            🎵 EmotionsCare Player
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={clearPlaylist}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Track Info */}
        {currentTrack && (
          <div className="text-center">
            <h3 className="font-medium text-sm">{currentTrack.title}</h3>
            <p className="text-xs text-muted-foreground">
              {currentTrack.artist || 'EmotionsCare'}
            </p>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-1" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={previousTrack}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={isPlaying ? pause : play}
            disabled={isLoading}
            className="h-10 w-10"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            disabled={isLoading}
            className="h-8 w-8"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
            onValueChange={(value) => setVolume(value[0] / 100)}
            max={100}
            step={1}
            className="flex-1"
          />
        </div>
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center text-sm text-muted-foreground">
            Chargement de la musique thérapeutique...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmotionsCareMusicPlayer;
