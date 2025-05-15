
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { MusicTrack } from '@/types';
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface MusicControlsProps {
  track: MusicTrack | null;
  isPlaying: boolean;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  volume: number;
  onVolumeChange: (value: number) => void;
  position: number;
  duration: number;
  seekTo: (position: number) => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  track,
  isPlaying,
  togglePlay,
  nextTrack,
  previousTrack,
  volume,
  onVolumeChange,
  position,
  duration,
  seekTo
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (duration > 0) {
      setProgress((position / duration) * 100);
    } else {
      setProgress(0);
    }
  }, [position, duration]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - bounds.left) / bounds.width;
    seekTo(percent * duration);
  };

  // Get cover URL, handle different property names
  const getCoverUrl = () => {
    if (!track) return null;
    return track.coverUrl || track.cover || track.cover_url || '/images/music-placeholder.jpg';
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow-sm">
      {track && (
        <>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-md overflow-hidden">
              <img 
                src={getCoverUrl() || '/images/music-placeholder.jpg'} 
                alt={track.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{track.title}</h3>
              <p className="text-sm text-muted-foreground">{track.artist}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div 
              className="h-1.5 bg-primary-foreground/20 rounded-full cursor-pointer"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-primary rounded-full transition-all" 
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(position)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </>
      )}

      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center">
          <Volume2 className="h-4 w-4 mr-2 text-muted-foreground" />
          <Slider
            className="w-20"
            value={[volume * 100]}
            min={0}
            max={100}
            step={1}
            onValueChange={(values) => onVolumeChange(values[0] / 100)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost" onClick={previousTrack}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
          </Button>
          <Button size="sm" variant="ghost" onClick={nextTrack}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MusicControls;
