
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume, Volume1, Volume2, VolumeX } from 'lucide-react';
import { MusicTrack, MusicPlayerProps } from '@/types/music';
import { getTrackAudioUrl, getTrackCover, getTrackTitle, getTrackArtist } from '@/utils/musicCompatibility';

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  track,
  autoPlay = false,
  onPlay,
  onPause,
  onNext,
  onPrevious,
  onEnded,
  volume = 0.5,
  onVolumeChange,
  currentTime = 0,
  duration = 0,
  onSeek,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(false);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Format time (seconds) to MM:SS format
  const formatTime = (seconds: number): string => {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  };

  // Handle play/pause toggle
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      if (onPause) onPause();
    } else {
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            if (onPlay) onPlay();
          })
          .catch(error => {
            console.error('Error playing audio:', error);
          });
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setCurrentVolume(volumeValue);
    if (audioRef.current) {
      audioRef.current.volume = volumeValue;
    }
    if (onVolumeChange) {
      onVolumeChange(volumeValue);
    }
  };

  // Handle volume mute toggle
  const handleVolumeToggle = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
    }
  };

  // Determine which volume icon to display
  const VolumeIcon = () => {
    if (isMuted || currentVolume === 0) return <VolumeX size={20} />;
    if (currentVolume < 0.3) return <Volume size={20} />;
    if (currentVolume < 0.7) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  // Handle seek
  const handleSeek = (value: number[]) => {
    const seekTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
    if (onSeek) {
      onSeek(seekTime);
    }
  };

  // Update audio element when track changes
  useEffect(() => {
    if (track && audioRef.current) {
      const audioUrl = getTrackAudioUrl(track);
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        if (autoPlay) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setIsPlaying(true);
                if (onPlay) onPlay();
              })
              .catch(error => {
                console.error('Error playing audio:', error);
              });
          }
        }
      }
    }
  }, [track, autoPlay, onPlay]);

  // Update volume when prop changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      setCurrentVolume(volume);
    }
  }, [volume]);

  if (!track) {
    return (
      <Card className={`${className}`}>
        <CardContent className="p-4 flex items-center justify-center min-h-[120px]">
          <div className="text-center text-muted-foreground">
            No track selected
          </div>
        </CardContent>
      </Card>
    );
  }

  const coverUrl = getTrackCover(track);
  const title = getTrackTitle(track);
  const artist = getTrackArtist(track);
  const audioUrl = getTrackAudioUrl(track);

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4 space-y-4">
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => {
            setIsPlaying(false);
            if (onEnded) onEnded();
          }} 
        />
        
        <div className="flex items-center space-x-4">
          {coverUrl && (
            <img 
              src={coverUrl} 
              alt={title} 
              className="h-16 w-16 object-cover rounded-md"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium truncate">{title}</h3>
            <p className="text-sm text-muted-foreground truncate">{artist}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <Slider 
            value={[currentTime]} 
            max={duration || 100} 
            step={0.1}
            onValueChange={handleSeek}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleVolumeToggle}>
              <VolumeIcon />
            </Button>
            <Slider 
              className="w-24" 
              value={[isMuted ? 0 : currentVolume]} 
              max={1}
              step={0.01}
              onValueChange={handleVolumeChange}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={onPrevious}>
              <SkipBack size={20} />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              onClick={handlePlayPause}
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
