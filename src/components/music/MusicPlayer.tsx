
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';

const MusicPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    duration,
    currentTime,
    progress,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    seekTo,
    setVolume,
    togglePlay
  } = useMusic();

  const [isMuted, setIsMuted] = React.useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    seekTo(newTime);
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

  if (!currentTrack) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-muted-foreground">
            <Music className="h-8 w-8 mr-3" />
            <span>Aucune musique sélectionnée</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Track Info */}
          <div className="text-center">
            <h3 className="font-semibold text-lg">{currentTrack.title}</h3>
            <p className="text-muted-foreground">{currentTrack.artist}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[progress || 0]}
              max={100}
              step={1}
              onValueChange={handleSeek}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevTrack}
              className="h-10 w-10"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              size="icon"
              onClick={togglePlay}
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
              onClick={nextTrack}
              className="h-10 w-10"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume * 100]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="flex-1"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
