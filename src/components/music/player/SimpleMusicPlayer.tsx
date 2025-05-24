
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useMusic } from '@/contexts/MusicContext';
import { demoTracks } from '@/services/music/demo-tracks';

const SimpleMusicPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    currentTime, 
    duration,
    isLoading,
    play, 
    pause, 
    next, 
    previous, 
    setVolume,
    setPlaylist,
    playlist
  } = useMusic();

  // Charger la playlist de démo si elle est vide
  React.useEffect(() => {
    if (playlist.length === 0) {
      console.log('🎵 Chargement de la playlist de démonstration');
      setPlaylist(demoTracks);
    }
  }, [playlist, setPlaylist]);

  const handlePlayPause = () => {
    if (!currentTrack && demoTracks.length > 0) {
      // Si aucun track n'est sélectionné, jouer le premier de la liste
      play(demoTracks[0]);
    } else if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="text-center">
        <h3 className="font-medium text-sm">
          {currentTrack ? currentTrack.title : 'Aucun titre sélectionné'}
        </h3>
        <p className="text-xs text-muted-foreground">
          {currentTrack ? currentTrack.artist : 'Cliquez sur lecture pour commencer'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={1}
          className="w-full"
          disabled={!currentTrack}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={previous}
          disabled={isLoading || playlist.length === 0}
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button 
          onClick={handlePlayPause}
          disabled={isLoading}
          className="h-10 w-10"
        >
          {isLoading ? (
            <div className="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
          ) : isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={next}
          disabled={isLoading || playlist.length === 0}
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <Volume2 className="h-4 w-4" />
        <Slider
          value={[volume * 100]}
          max={100}
          step={1}
          onValueChange={(values) => setVolume(values[0] / 100)}
          className="flex-1"
        />
      </div>

      {/* Debug Info */}
      {playlist.length > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          Playlist: {playlist.length} morceaux
        </div>
      )}
    </div>
  );
};

export default SimpleMusicPlayer;
