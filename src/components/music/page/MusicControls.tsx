
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { MusicTrack } from '@/types';
import MusicProgressBar from '../MusicProgressBar';
import VolumeControl from '../VolumeControl';

interface MusicControlsProps {
  isPlaying: boolean;
  currentTrack: MusicTrack | null;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
  volume: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onVolumeChange: (value: number) => void;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  isPlaying,
  currentTrack,
  onTogglePlay,
  onPrevious,
  onNext,
  currentTime,
  duration,
  onSeek,
  volume,
  isMuted,
  onToggleMute,
  onVolumeChange
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <Card className="sticky bottom-4 w-full max-w-4xl mx-auto border shadow-lg p-3">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-md overflow-hidden flex-shrink-0">
          {/* If either coverUrl or cover is available, use it */}
          {(currentTrack.cover_url || currentTrack.cover) && (
            <img 
              src={currentTrack.cover_url || currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        <div className="flex-grow min-w-0 mr-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 mb-1 sm:mb-0">
              <p className="font-medium truncate">{currentTrack.title}</p>
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={onPrevious}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="default" 
                size="icon" 
                className="h-9 w-9" 
                onClick={onTogglePlay}
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 ml-0.5" />
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={onNext}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="mt-2 flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {formatTime(currentTime)}
            </span>
            
            <MusicProgressBar 
              progress={currentTime}
              max={duration}
              onChange={onSeek}
              className="flex-grow"
            />
            
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {formatTime(duration)}
            </span>
            
            <div className="flex items-center gap-2 ml-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6" 
                onClick={onToggleMute}
              >
                {isMuted ? (
                  <VolumeX className="h-3.5 w-3.5" />
                ) : (
                  <Volume2 className="h-3.5 w-3.5" />
                )}
              </Button>
              
              <div className="w-16 hidden sm:block">
                <VolumeControl 
                  volume={isMuted ? 0 : volume} 
                  onChange={onVolumeChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MusicControls;
