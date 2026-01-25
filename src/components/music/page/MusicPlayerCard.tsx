import React, { SyntheticEvent, useRef, useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { getTrackTitle, getTrackCover, getTrackArtist, getTrackUrl } from '@/utils/musicCompatibility';
import { logger } from '@/lib/logger';

interface MusicPlayerCardProps {
  track: MusicTrack;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
  autoPlay?: boolean;
  onEnd?: () => void;
}

const MusicPlayerCard: React.FC<MusicPlayerCardProps> = ({
  track,
  onNext,
  onPrevious,
  className = '',
  autoPlay = false,
  onEnd
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.75);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      if (autoPlay) {
        audioRef.current.play().catch(err => {
          logger.error("Autoplay prevented:", err);
        });
      }
    }
  }, [track, autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => {
          logger.error("Play prevented:", err);
        });
      }
    }
  };

  const handleTimeUpdate = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    setCurrentTime(e.currentTarget.currentTime);
  };

  const handleLoadedMetadata = (e: SyntheticEvent<HTMLAudioElement, Event>) => {
    setDuration(e.currentTarget.duration);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
    if (audioRef.current) {
      audioRef.current.muted = !muted;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleEnd = () => {
    setIsPlaying(false);
    if (onEnd) onEnd();
    if (onNext) onNext();
  };

  const coverUrl = getTrackCover(track);
  const title = getTrackTitle(track);
  const artist = getTrackArtist(track);
  const audioUrl = getTrackUrl(track);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-0">
        <div className="aspect-square w-full bg-slate-200 dark:bg-slate-800 relative">
          {coverUrl ? (
            <img 
              src={coverUrl} 
              alt={title} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <span className="text-6xl text-muted-foreground">♪</span>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-lg truncate">{title}</h3>
          <p className="text-muted-foreground truncate mb-4">{artist}</p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-8">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                min={0}
                max={duration || 100}
                step={1}
                onValueChange={handleSeek}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-8">
                {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onPrevious}
                disabled={!onPrevious}
              >
                <SkipBack size={20} />
              </Button>
              
              <Button 
                variant="default" 
                size="icon" 
                className="h-10 w-10 rounded-full"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onNext}
                disabled={!onNext}
              >
                <SkipForward size={20} />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMute}
                className="w-8"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </Button>
              <Slider
                value={[muted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
            </div>
          </div>
        </div>
        
        <audio 
          ref={audioRef}
          src={audioUrl}
          autoPlay={autoPlay}
          loop={false}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnd}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onVolumeChange={(_e) => {
            if (audioRef.current) {
              setVolume(audioRef.current.volume);
              setMuted(audioRef.current.muted);
            }
          }}
          muted={muted}
          // Setting volume via ref instead of attribute
        />
      </CardContent>
    </Card>
  );
};

export default MusicPlayerCard;
