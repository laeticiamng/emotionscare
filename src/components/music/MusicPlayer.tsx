
import React, { useState, useEffect, useRef } from 'react';
import { Music2, Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useMusic } from '@/contexts/MusicContext';
import { Progress } from '@/components/ui/progress';

const MusicPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    playTrack, 
    pauseTrack, 
    nextTrack, 
    previousTrack, 
    setVolume,
    playlist
  } = useMusic();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      audioRef.current = new Audio();
      
      // Add event listeners
      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('loadeddata', setAudioData);
      audioRef.current.addEventListener('ended', handleTrackEnd);
    }
    
    // Update audio source when track changes
    if (currentTrack) {
      audioRef.current.src = currentTrack.url;
      audioRef.current.volume = volume;
      
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Error playing track:", err));
      }
    }
    
    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', updateProgress);
        audioRef.current.removeEventListener('loadeddata', setAudioData);
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.pause();
      }
    };
  }, [currentTrack]);
  
  // Handle play/pause changes
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(err => console.error("Error playing track:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);
  
  // Handle volume changes
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
  }, [volume]);
  
  const updateProgress = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
  };
  
  const setAudioData = () => {
    if (!audioRef.current) return;
    setDuration(audioRef.current.duration);
  };
  
  const handleTrackEnd = () => {
    nextTrack();
  };
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !currentTrack) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const formatTime = (time: number) => {
    if (!time) return "0:00";
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0]);
  };
  
  // Volume icon based on current volume
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  
  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed">
        <Music2 className="h-12 w-12 mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">Aucune musique sélectionnée</h3>
        <p className="text-muted-foreground">
          Sélectionnez un morceau de musique dans les recommandations ou créez votre propre musique
        </p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border p-4 bg-background">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
          {currentTrack.cover ? (
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="h-full w-full object-cover" 
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary/10">
              <Music2 className="h-8 w-8 text-primary/70" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium leading-none truncate">{currentTrack.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 truncate">{currentTrack.artist}</p>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="space-y-1 mb-4">
        <div 
          className="relative h-1.5 bg-secondary/50 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute left-0 top-0 h-full bg-primary"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={previousTrack}
          >
            <SkipBack size={18} />
          </Button>
          
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full h-9 w-9" 
            onClick={isPlaying ? pauseTrack : () => playTrack(currentTrack)}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full" 
            onClick={nextTrack}
          >
            <SkipForward size={18} />
          </Button>
        </div>
        
        {/* Volume control */}
        <div className="flex items-center gap-2 w-28">
          <VolumeIcon size={18} className="text-muted-foreground" />
          <Slider
            value={[volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
