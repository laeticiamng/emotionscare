
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music, VolumeX } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';
import { useActivityLogging } from '@/hooks/useActivityLogging';
import ProgressBar from './ProgressBar';

const MusicPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack, 
    nextTrack, 
    previousTrack,
    volume,
    setVolume,
    isMuted,
    toggleMute
  } = useMusic();
  
  const { logUserAction } = useActivityLogging('music');
  const [progress, setProgress] = useState(0);
  
  // Simulate track playback for demo purposes
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && currentTrack) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval!);
            return 0;
          }
          return prev + 0.5;
        });
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentTrack]);
  
  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0] / 100;
    setVolume(newVolume);
    
    // If user increases volume while muted, unmute
    if (isMuted && newVolume > 0) {
      toggleMute();
    }
  };
  
  const togglePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
      logUserAction('pause_music');
    } else if (currentTrack) {
      playTrack(currentTrack);
      logUserAction('play_music');
    }
  };

  // Format time helper function
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-muted/20 p-6 flex flex-col justify-center items-center">
        <div className="rounded-full h-32 w-32 bg-primary/10 flex items-center justify-center mb-4">
          {currentTrack?.coverUrl ? (
            <img 
              src={currentTrack.coverUrl} 
              alt={currentTrack.title} 
              className="h-full w-full object-cover rounded-full"
            />
          ) : (
            <Music className="h-12 w-12 text-primary/80" />
          )}
        </div>
        <h2 className="text-xl font-medium text-center">
          {currentTrack?.title || "Aucune piste sélectionnée"}
        </h2>
        <p className="text-muted-foreground text-center">
          {currentTrack?.artist || "Sélectionnez une piste pour commencer"}
        </p>
      </div>
      
      <div className="flex-1 p-6">
        <div className="h-[180px] mb-6">
          <EnhancedMusicVisualizer 
            showControls={false}
            height={180}
          />
        </div>
        
        {/* Progress bar */}
        {currentTrack && (
          <div className="mb-4">
            <ProgressBar
              value={progress}
              max={100}
              currentTime={(progress / 100) * (currentTrack?.duration || 0)}
              duration={currentTrack?.duration || 0}
              formatTime={formatTime}
              handleProgressClick={(e) => {
                const container = e.currentTarget;
                const rect = container.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                setProgress(percent);
              }}
            />
          </div>
        )}
        
        <div className="flex justify-center space-x-2 mb-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10"
            onClick={() => previousTrack()}
            disabled={!currentTrack}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="default" 
            size="icon"
            className="h-12 w-12" 
            onClick={togglePlayPause}
            disabled={!currentTrack}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10"
            onClick={() => nextTrack()}
            disabled={!currentTrack}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Volume2 className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={handleVolumeChange}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
