
import React from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PlayCircle, PauseCircle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { getTrackTitle, getTrackArtist, getTrackCover } from '@/utils/musicCompatibility';

const MusicPlayer = () => {
  const music = useMusic();
  const { 
    currentTrack,
    isPlaying,
    togglePlay,
    previousTrack,
    nextTrack,
    volume,
    currentTime,
    duration,
    muted,
    seekTo,
    toggleMute,
    setVolume
  } = music;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSeek = (value: number[]) => {
    seekTo(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
  };

  // Return empty div if no track
  if (!currentTrack) return <div className="h-16"></div>;

  return (
    <div className="flex items-center gap-4 py-2 px-4 bg-background border-t">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-muted">
          {getTrackCover(currentTrack) ? (
            <img 
              src={getTrackCover(currentTrack)} 
              alt={getTrackTitle(currentTrack)} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
              ♪
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium truncate">{getTrackTitle(currentTrack)}</p>
          <p className="text-xs text-muted-foreground truncate">{getTrackArtist(currentTrack)}</p>
        </div>
      </div>

      <div className="flex-1 max-w-md">
        <div className="flex items-center justify-center gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8"
            onClick={previousTrack}
          >
            <SkipBack size={16} />
          </Button>
          <Button 
            size="icon" 
            variant="default" 
            className="h-9 w-9 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? <PauseCircle size={18} /> : <PlayCircle size={18} />}
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8"
            onClick={nextTrack}
          >
            <SkipForward size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground w-8 text-right">
            {formatTime(currentTime)}
          </span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8"
          onClick={toggleMute}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
        <Slider
          value={[muted ? 0 : volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="w-20"
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
