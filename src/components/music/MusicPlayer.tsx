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
  
  const [isMuted, setIsMuted] = React.useState(volume === 0);

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

  const previousVolumeRef = React.useRef(volume);

  // Sync mute state with volume from context
  React.useEffect(() => {
    if (volume === 0 && !isMuted) {
      setIsMuted(true);
    } else if (volume > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    if (isMuted) {
      const restoreVolume = previousVolumeRef.current > 0 ? previousVolumeRef.current : 0.7;
      if (onVolumeChange) {
        onVolumeChange(restoreVolume);
      } else if (musicContext.setVolume) {
        musicContext.setVolume(restoreVolume);
      }
      setIsMuted(false);
    } else {
      previousVolumeRef.current = volume;
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
      <Card className={`fixed bottom-0 left-0 right-0 z-50 rounded-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 ${className}`}>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-center text-muted-foreground gap-2">
            <Music className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
            <span className="text-sm sm:text-base">Aucune musique sélectionnée</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className={`fixed bottom-0 left-0 right-0 z-50 rounded-none border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-bottom ${className}`}>
      <CardContent className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* Mobile layout: Compact horizontal layout */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {/* Track cover - responsive size */}
            {currentTrack.coverUrl && (
              <img 
                src={currentTrack.coverUrl} 
                alt={currentTrack.title}
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-md object-cover shrink-0"
              />
            )}
            
            {/* Track info - flexible width */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm sm:text-base md:text-lg truncate">
                {currentTrack.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {currentTrack.artist}
              </p>
            </div>

            {/* Controls - compact on mobile */}
            {showControls && (
              <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevious}
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
                  aria-label="Piste précédente"
                >
                  <SkipBack className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" aria-hidden="true" />
                </Button>

                <Button
                  size="icon"
                  onClick={handlePlayPause}
                  className="h-9 w-9 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-full"
                  aria-label={isPlaying ? "Mettre en pause" : "Lire"}
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" aria-hidden="true" />
                  ) : (
                    <Play className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ml-0.5" aria-hidden="true" />
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNext}
                  className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10"
                  aria-label="Piste suivante"
                >
                  <SkipForward className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" aria-hidden="true" />
                </Button>
              </div>
            )}

            {/* Volume Control - hidden on mobile, visible on tablet+ */}
            <div className="hidden sm:flex items-center gap-2 w-24 md:w-32 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                className="h-7 w-7 sm:h-8 sm:w-8"
                aria-label={isMuted || volume === 0 ? "Réactiver le son" : "Couper le son"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
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

          {/* Progress Bar - full width below */}
          {showProgress && (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs text-muted-foreground tabular-nums w-8 sm:w-10 text-right shrink-0">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[progress]}
                max={100}
                step={0.1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-[10px] sm:text-xs text-muted-foreground tabular-nums w-8 sm:w-10 shrink-0">
                {formatTime(duration)}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
