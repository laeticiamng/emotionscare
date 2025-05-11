
import React from 'react';
// Fix: Import from contexts instead of providers
import { useMusic } from '@/contexts/MusicContext';
import { Button } from '@/components/ui/button';
import VolumeControl from '@/components/music/player/VolumeControl';
import TrackInfo from '@/components/music/player/TrackInfo';
import ProgressBar from '@/components/music/player/ProgressBar';
import { 
  Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, 
  Volume2, VolumeX 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface MusicControlsProps {
  className?: string;
  showProgress?: boolean;
  showTrackInfo?: boolean;
  showVolumeControl?: boolean;
  compact?: boolean;
}

const MusicControls: React.FC<MusicControlsProps> = ({
  className = '',
  showProgress = true,
  showTrackInfo = true,
  showVolumeControl = true,
  compact = false
}) => {
  const { 
    isPlaying, 
    currentTrack, 
    pauseTrack, 
    togglePlay, 
    nextTrack,
    previousTrack,
    seek, 
    seekTo,
    currentTime,
    duration,
    volume,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    shuffle,
    repeat
  } = useMusic();

  // Format time in MM:SS format
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Use seekTo if seek is not available
  const handleSeek = (time: number) => {
    if (seek) {
      seek(time);
    } else if (seekTo) {
      seekTo(time);
    }
  };

  return (
    <div className={`${className}`}>
      {showTrackInfo && currentTrack && (
        <div className="mb-4">
          <TrackInfo
            track={currentTrack}
            coverUrl={currentTrack?.coverUrl || currentTrack?.coverImage} 
          />
        </div>
      )}
      
      {showProgress && currentTrack && (
        <div className="mb-4">
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            formatTime={formatTime}
          />
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {!compact && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleShuffle}
                className={shuffle ? "text-primary" : ""}
              >
                <Shuffle size={compact ? 16 : 18} />
              </Button>
            </>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={previousTrack}
            disabled={!currentTrack}
          >
            <SkipBack size={compact ? 18 : 20} />
          </Button>
          
          <Button
            variant={compact ? "ghost" : "outline"}
            size={compact ? "icon" : "default"}
            className={compact ? "" : "h-10 w-10 rounded-full"}
            onClick={togglePlay}
            disabled={!currentTrack}
          >
            {isPlaying ? (
              <Pause size={compact ? 18 : 20} />
            ) : (
              <Play size={compact ? 18 : 20} />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextTrack}
            disabled={!currentTrack}
          >
            <SkipForward size={compact ? 18 : 20} />
          </Button>
          
          {!compact && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRepeat}
                className={repeat ? "text-primary" : ""}
              >
                <Repeat size={compact ? 16 : 18} />
              </Button>
            </>
          )}
        </div>
        
        {showVolumeControl && (
          <div className={`flex items-center ${compact ? 'hidden sm:flex' : ''}`}>
            <VolumeControl
              volume={volume}
              onChange={setVolume}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicControls;
