import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { useMusic } from '@/hooks/useMusic';
import { MusicTrack } from '@/types/music';

interface MusicPlayerProps {
  track?: MusicTrack;
  isPlaying?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onSeek?: (time: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onVolumeChange?: (volume: number) => void;
  volume?: number;
  currentTime?: number;
  showControls?: boolean;
  showProgress?: boolean;
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  track: propTrack,
  isPlaying: propIsPlaying,
  onPlay,
  onPause,
  onSeek,
  onNext,
  onPrevious,
  onVolumeChange,
  volume: propVolume,
  currentTime: propCurrentTime,
  showControls = true,
  showProgress = true,
  className = ''
}) => {
  const musicContext = useMusic();
  
  // Use props if provided, otherwise fall back to context
  const currentTrack = propTrack || musicContext.state.currentTrack;
  const isPlaying = propIsPlaying !== undefined ? propIsPlaying : musicContext.state.isPlaying;
  const volume = propVolume !== undefined ? propVolume : musicContext.state.volume || 0.7;
  const currentTime = propCurrentTime !== undefined ? propCurrentTime : musicContext.state.currentTime || 0;
  const duration = musicContext.state.duration || 0;
  
  const [isMuted, setIsMuted] = React.useState(false);

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      if (onPause) {
        onPause();
      } else if (musicContext.pause) {
        musicContext.pause();
      }
    } else {
      if (onPlay) {
        onPlay();
      } else if (musicContext.play && currentTrack) {
        musicContext.play(currentTrack);
      }
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = (value[0] / 100) * duration;
    if (onSeek) {
      onSeek(newTime);
    } else if (musicContext.seek) {
      musicContext.seek(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    } else if (musicContext.setVolume) {
      musicContext.setVolume(newVolume);
    }
    setIsMuted(newVolume === 0);
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (musicContext.next) {
      musicContext.next();
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (musicContext.previous) {
      musicContext.previous();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      const newVolume = 0.7;
      if (onVolumeChange) {
        onVolumeChange(newVolume);
      } else if (musicContext.setVolume) {
        musicContext.setVolume(newVolume);
      }
      setIsMuted(false);
    } else {
      if (onVolumeChange) {
        onVolumeChange(0);
      } else if (musicContext.setVolume) {
        musicContext.setVolume(0);
      }
      setIsMuted(true);
    }
  };

  if (!currentTrack) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center text-muted-foreground">
            <Music className="h-8 w-8 mr-3" />
            <span>Aucune musique sélectionnée</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Track Info */}
          <div className="text-center">
            {currentTrack.coverUrl && (
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title}
                className="w-32 h-32 mx-auto rounded-lg object-cover mb-4"
              />
            )}
            <h3 className="font-semibold text-lg">{currentTrack.title}</h3>
            <p className="text-muted-foreground">{currentTrack.artist}</p>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="space-y-2">
              <Slider
                value={[progress]}
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
          )}

          {/* Controls */}
          {showControls && (
            <div className="flex items-center justify-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevious}
                className="h-10 w-10"
              >
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                onClick={handlePlayPause}
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
                onClick={handleNext}
                className="h-10 w-10"
              >
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>
          )}

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
