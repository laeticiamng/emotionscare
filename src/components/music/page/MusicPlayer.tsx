
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { MusicTrack } from '@/types/music';
import { ProgressBar } from '../player/ProgressBar';
import { VolumeControl } from '../player/VolumeControl';

interface MusicPlayerProps {
  track: MusicTrack;
  onEnded?: () => void;
  autoPlay?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({ track, onEnded, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Create audio element when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio();
      
      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }
      };
    }
  }, []);
  
  // Update audio when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Get the URL from any available property
    const audioUrl = track.audioUrl || track.src || track.url;
    
    if (audioUrl) {
      audio.src = audioUrl;
      audio.load();
      
      if (autoPlay) {
        audio.play().catch(err => console.error('Failed to play audio:', err));
      }
      
      audio.volume = volume;
      audio.muted = muted;
      
      // Set up event listeners
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);
      const handleEnded = () => {
        setIsPlaying(false);
        setCurrentTime(0);
        if (onEnded) onEnded();
      };
      
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('durationchange', handleDurationChange);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [track, autoPlay, volume, muted, onEnded]);
  
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(err => console.error('Failed to play audio:', err));
    }
    
    setIsPlaying(!isPlaying);
  };
  
  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.currentTime = time;
    setCurrentTime(time);
  };
  
  const handleVolumeChange = (newVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.volume = newVolume;
    setVolume(newVolume);
    
    if (muted && newVolume > 0) {
      audio.muted = false;
      setMuted(false);
    }
  };
  
  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.muted = !audio.muted;
    setMuted(!muted);
  };
  
  return (
    <Card className="shadow-md">
      <CardContent className="p-6">
        {/* Track info */}
        <div className="flex items-center space-x-4 mb-6">
          {track.cover && (
            <img 
              src={track.cover} 
              alt={track.name || track.title || "Album cover"} 
              className="w-16 h-16 rounded-md object-cover"
            />
          )}
          
          <div>
            <h3 className="font-bold text-lg">
              {track.name || track.title || "Unknown track"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {track.artist || "Unknown artist"}
            </p>
          </div>
        </div>
        
        {/* Progress bar */}
        <ProgressBar 
          currentTime={currentTime} 
          duration={duration} 
          onSeek={seekTo} 
        />
        
        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 my-6">
          <Button 
            variant="outline" 
            size="icon" 
            disabled
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-0.5" />
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            disabled
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Volume control */}
        <VolumeControl 
          volume={volume} 
          muted={muted}
          onVolumeChange={handleVolumeChange}
          onMuteToggle={toggleMute}
        />
      </CardContent>
    </Card>
  );
};

export default MusicPlayer;
