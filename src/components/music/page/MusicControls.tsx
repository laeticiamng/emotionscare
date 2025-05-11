
import React from 'react';
import { MusicTrack } from '@/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX 
} from 'lucide-react';

interface MusicControlsProps {
  track?: MusicTrack;
  isPlaying: boolean;
  volume: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onVolumeChange: (value: number) => void;
  progress?: number;
  onSeek?: (position: number) => void;
  duration?: number;
  currentTime?: number;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  track,
  isPlaying,
  volume,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onVolumeChange,
  progress = 0,
  onSeek,
  duration = 0,
  currentTime = 0
}) => {
  const getCoverImage = (track?: MusicTrack) => {
    if (!track) return '';
    return track.coverUrl || track.cover || track.cover_url || '';
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="music-controls p-4 bg-card rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        {track && (
          <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-muted">
            {getCoverImage(track) ? (
              <img 
                src={getCoverImage(track)} 
                alt={track.title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                ♪
              </div>
            )}
          </div>
        )}
        
        <div className="flex-grow min-w-0">
          {track && (
            <>
              <div className="font-medium truncate">{track.title}</div>
              <div className="text-sm text-muted-foreground truncate">{track.artist}</div>
            </>
          )}
          
          {onSeek && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[progress]}
                max={100}
                step={1}
                className="flex-grow"
                onValueChange={(values) => onSeek(values[0])}
              />
              <span className="text-xs text-muted-foreground">
                {formatTime(duration)}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onVolumeChange(volume > 0 ? 0 : 100)}
          >
            {volume > 0 ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </Button>
          <Slider
            value={[volume]}
            max={100}
            step={1}
            className="w-24"
            onValueChange={(values) => onVolumeChange(values[0])}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onPrevious}>
            <SkipBack size={18} />
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="h-10 w-10 rounded-full"
            onClick={isPlaying ? onPause : onPlay}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          
          <Button variant="ghost" size="icon" onClick={onNext}>
            <SkipForward size={18} />
          </Button>
        </div>
        
        <div className="w-[100px]" /> {/* Spacer for balance */}
      </div>
    </div>
  );
};

export default MusicControls;
