
import React, { useState, useEffect } from 'react';
import { MusicTrack } from '@/types/music';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeX } from 'lucide-react';

interface MusicPlayerProps {
  track: MusicTrack | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  track,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  volume,
  onVolumeChange,
  currentTime,
  duration,
  onSeek,
  className = ''
}) => {
  const [isMuted, setIsMuted] = useState(false);
  
  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      onVolumeChange(volume > 0 ? volume : 0.5);
    } else {
      onVolumeChange(0);
    }
  };
  
  const VolumeIcon = () => {
    if (volume === 0 || isMuted) return <VolumeX size={20} />;
    if (volume < 0.3) return <Volume size={20} />;
    if (volume < 0.7) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };
  
  // Progress bar component
  const ProgressBar = () => (
    <div className="mt-4 space-y-1">
      <Slider 
        value={[currentTime]} 
        max={duration} 
        step={0.1}
        onValueChange={(value) => onSeek(value[0])}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
  
  if (!track) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground py-4">
            No track selected
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={`${className}`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center space-x-4">
          {track.coverUrl && (
            <img 
              src={track.coverUrl} 
              alt={track.title} 
              className="h-16 w-16 object-cover rounded-md"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium truncate">{track.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{track.artist}</p>
          </div>
        </div>
        
        <ProgressBar />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleVolumeToggle}>
              <VolumeIcon />
            </Button>
            <Slider 
              className="w-24" 
              value={[isMuted ? 0 : volume * 100]} 
              max={100}
              onValueChange={(value) => {
                setIsMuted(value[0] === 0);
                onVolumeChange(value[0] / 100);
              }}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={onPrevious}>
              <SkipBack size={20} />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              onClick={() => isPlaying ? onPause() : onPlay()}
              className="h-10 w-10 rounded-full"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </Button>
            <Button variant="ghost" size="icon" onClick={onNext}>
              <SkipForward size={20} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
