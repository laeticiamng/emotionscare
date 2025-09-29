
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Shuffle, Repeat, Heart, Share2, MoreHorizontal 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  cover?: string;
}

interface AudioPlayerAdvancedProps {
  tracks: Track[];
  currentTrack?: Track;
  className?: string;
  variant?: 'full' | 'mini' | 'popup';
  showPlaylist?: boolean;
}

const AudioPlayerAdvanced: React.FC<AudioPlayerAdvancedProps> = ({
  tracks,
  currentTrack,
  className,
  variant = 'full',
  showPlaylist = true
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeTrack, setActiveTrack] = useState<Track | null>(currentTrack || tracks[0] || null);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume / 100;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  if (variant === 'mini') {
    return (
      <Card className={cn("w-80", className)}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            {activeTrack?.cover && (
              <img 
                src={activeTrack.cover} 
                alt={activeTrack.title}
                className="w-12 h-12 rounded object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{activeTrack?.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activeTrack?.artist}</p>
            </div>
            <Button size="sm" variant="ghost" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="mt-2"
          />
          {activeTrack && (
            <audio ref={audioRef} src={activeTrack.url} />
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("w-full max-w-md", className)}>
      <CardContent className="p-6">
        {/* Cover et informations */}
        <div className="text-center mb-6">
          {activeTrack?.cover ? (
            <motion.img
              src={activeTrack.cover}
              alt={activeTrack.title}
              className="w-48 h-48 mx-auto rounded-lg shadow-lg mb-4"
              animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            />
          ) : (
            <div className="w-48 h-48 mx-auto bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg shadow-lg mb-4 flex items-center justify-center">
              <Volume2 className="h-16 w-16 text-white" />
            </div>
          )}
          
          <h3 className="font-semibold text-lg truncate">{activeTrack?.title}</h3>
          <p className="text-muted-foreground">{activeTrack?.artist}</p>
        </div>

        {/* Barre de progression */}
        <div className="mb-4">
          <Slider
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSeek}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Contrôles principaux */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsShuffled(!isShuffled)}
            className={isShuffled ? 'text-primary' : ''}
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            size="lg"
            onClick={togglePlay}
            className="rounded-full w-12 h-12"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </Button>
          
          <Button variant="ghost" size="sm">
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsRepeating(!isRepeating)}
            className={isRepeating ? 'text-primary' : ''}
          >
            <Repeat className="h-4 w-4" />
          </Button>
        </div>

        {/* Contrôles secondaires */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsLiked(!isLiked)}
            className={isLiked ? 'text-red-500' : ''}
          >
            <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          </Button>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Slider
              value={[isMuted ? 0 : volume]}
              max={100}
              step={1}
              onValueChange={handleVolumeChange}
              className="w-20"
            />
          </div>
          
          <div className="flex gap-1">
            <Button variant="ghost" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {activeTrack && (
          <audio ref={audioRef} src={activeTrack.url} />
        )}
      </CardContent>
    </Card>
  );
};

export default AudioPlayerAdvanced;
