
import React from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music } from 'lucide-react';
import { useMusic } from '@/contexts/MusicContext';
import EnhancedMusicVisualizer from '@/components/music/EnhancedMusicVisualizer';
import { useActivityLogging } from '@/hooks/useActivityLogging';

const MusicPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack, 
    nextTrack, 
    previousTrack,
    volume,
    setVolume
  } = useMusic();
  const { logUserAction } = useActivityLogging('music');
  
  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
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
  
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/3 bg-muted/20 p-6 flex flex-col justify-center items-center">
        <div className="rounded-full h-32 w-32 bg-primary/10 flex items-center justify-center mb-4">
          <Music className="h-12 w-12 text-primary/80" />
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
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            defaultValue={[volume * 100]}
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
