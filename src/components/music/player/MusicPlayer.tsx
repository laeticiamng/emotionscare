
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useMusic } from '@/contexts/MusicContext';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

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
  
  const handleVolumeChange = (values: number[]) => {
    setVolume(values[0] / 100);
  };
  
  const handleTogglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      playTrack(currentTrack);
    }
  };

  return (
    <div className="space-y-6">
      {/* Track information */}
      <div className="bg-muted/40 p-4 rounded-lg">
        {currentTrack ? (
          <>
            <h3 className="font-medium text-lg">{currentTrack.title}</h3>
            <p className="text-muted-foreground">{currentTrack.artist}</p>
            <div className="text-sm text-muted-foreground mt-2">
              Durée: {Math.floor(currentTrack.duration / 60)}:{String(currentTrack.duration % 60).padStart(2, '0')}
            </div>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Aucune piste sélectionnée</p>
            <p className="text-xs mt-2">Choisissez une playlist dans le menu Musique</p>
          </div>
        )}
      </div>
      
      {/* Playback controls */}
      <div className="flex flex-col gap-6">
        {/* Progress bar (static placeholder for now) */}
        <div className="space-y-2">
          <Slider 
            value={[isPlaying ? 30 : 0]} 
            max={100}
            disabled={!currentTrack}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0:00</span>
            <span>{currentTrack ? `${Math.floor(currentTrack.duration / 60)}:${String(currentTrack.duration % 60).padStart(2, '0')}` : '0:00'}</span>
          </div>
        </div>
        
        {/* Controls */}
        <div className="flex justify-center items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={previousTrack}
            disabled={!currentTrack}
          >
            <SkipBack className="h-5 w-5" />
          </Button>
          
          <Button 
            variant={isPlaying ? "secondary" : "default"}
            size="icon"
            className="h-12 w-12 rounded-full"
            onClick={handleTogglePlay}
            disabled={!currentTrack}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextTrack}
            disabled={!currentTrack}
          >
            <SkipForward className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Volume control */}
        <div className="flex items-center gap-2">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <Slider
            value={[volume * 100]}
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
