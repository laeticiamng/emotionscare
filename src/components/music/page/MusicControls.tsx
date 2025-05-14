
import { useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { MusicTrack } from '@/types/music';
import { formatDuration } from '@/utils/formatters';

interface MusicControlsProps {
  track: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (value: number) => void;
  onProgressChange: (value: number) => void;
  className?: string;
}

export function MusicControls({
  track,
  isPlaying,
  volume,
  progress,
  duration,
  onPlayPause,
  onNext,
  onPrevious,
  onVolumeChange,
  onProgressChange,
  className = '',
}: MusicControlsProps) {
  const progressRef = useRef<number>(progress);

  // When progress prop changes, update the ref
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  // Format time in MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Get cover URL with fallback
  const getCoverUrl = () => {
    return track?.coverUrl || track?.cover_url || track?.cover || '/images/default-album-art.png';
  };

  return (
    <div className={`bg-background border rounded-lg p-3 ${className}`}>
      {track && (
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-muted rounded overflow-hidden">
              <img
                src={getCoverUrl()}
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm truncate">{track.title}</h4>
              <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
            <Slider
              value={[progress]}
              max={duration || 100}
              step={1}
              onValueChange={(values) => onProgressChange(values[0])}
              className="cursor-pointer"
            />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-1 w-24">
              {volume === 0 ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : volume < 0.5 ? (
                <Volume1 className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              )}
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={(values) => onVolumeChange(values[0] / 100)}
                className="cursor-pointer"
              />
            </div>

            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrevious}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button onClick={onPlayPause} variant="secondary" size="icon" className="h-9 w-9">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNext}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="w-24" />
          </div>
        </div>
      )}
    </div>
  );
}

export default MusicControls;
