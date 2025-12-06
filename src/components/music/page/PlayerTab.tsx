// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { useMusic } from '@/hooks/useMusic';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Heart, Volume, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { getTrackCover, getTrackTitle, getTrackArtist } from '@/utils/musicCompatibility';
import { MusicContextType } from '@/types/music';
import { logger } from '@/lib/logger';

interface PlayerTabProps {
  className?: string;
}

const PlayerTab: React.FC<PlayerTabProps> = ({ className = '' }) => {
  const [showVolume, setShowVolume] = useState(false);
  const [localVolume, setLocalVolume] = useState(80);
  const [localMute, setLocalMute] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const music = useMusic() as MusicContextType;
  const { 
    currentTrack, 
    isPlaying,
    togglePlay,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    playlist,
  } = music;
  
  // Fallback values if they don't exist in the context
  const previousTrack = music.previousTrack || (() => logger.info('Previous track not available'));
  const setCurrentTrack = music.setCurrentTrack || ((track) => logger.info('Set current track not available', { track }));
  const currentTime = music.currentTime || 0;
  const duration = music.duration || 0;
  const seekTo = music.seekTo || ((time: number) => logger.info('Seek not available', { time }));

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  useEffect(() => {
    if (duration > 0) {
      setProgress((currentTime / duration) * 100);
    }
  }, [currentTime, duration]);
  
  const handleVolumeChange = (values: number[]) => {
    setLocalVolume(values[0]);
    music.setVolume && music.setVolume(values[0] / 100);
  };
  
  const handleToggleMute = () => {
    setLocalMute(!localMute);
    music.toggleMute && music.toggleMute();
  };
  
  const handleProgressChange = (values: number[]) => {
    const newPosition = (values[0] / 100) * (duration || 0);
    seekTo(newPosition);
  };
  
  if (!currentTrack) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">Aucune piste en cours de lecture</p>
        <Button onClick={() => playlist && playlist.tracks.length > 0 ? 
          playTrack(playlist.tracks[0]) : null} className="mt-4">
          Démarrer la lecture
        </Button>
      </div>
    );
  }
  
  const trackTitle = getTrackTitle(currentTrack);
  const trackArtist = getTrackArtist(currentTrack);
  const coverImage = getTrackCover(currentTrack);
  
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="w-64 h-64 mb-6 rounded-lg overflow-hidden shadow-lg">
          {coverImage ? (
            <img 
              src={coverImage}
              alt={trackTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
              <Play className="h-16 w-16 text-primary/50" />
            </div>
          )}
        </div>
        
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold">{trackTitle}</h3>
          <p className="text-muted-foreground">{trackArtist}</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        
        <Slider
          value={[progress]}
          max={100}
          step={0.1}
          onValueChange={handleProgressChange}
          className="w-full"
        />
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousTrack}
          className="h-12 w-12 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
          aria-label="Piste précédente"
        >
          <SkipBack className="h-6 w-6" />
        </Button>
        
        <Button
          variant="default"
          size="icon"
          onClick={togglePlay}
          className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
          aria-label={isPlaying ? "Mettre en pause" : "Lire"}
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-primary-foreground" />
          ) : (
            <Play className="h-8 w-8 ml-1 text-primary-foreground" />
          )}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={nextTrack}
          className="h-12 w-12 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
          aria-label="Piste suivante"
        >
          <SkipForward className="h-6 w-6" />
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          aria-label="Ajouter aux favoris"
        >
          <Heart className="h-6 w-6" />
        </Button>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowVolume(!showVolume)}
            onMouseEnter={() => setShowVolume(true)}
            className="text-muted-foreground hover:text-primary"
            aria-label={localMute ? "Réactiver le son" : "Régler le volume"}
          >
            {localMute ? <VolumeX className="h-6 w-6" /> : <Volume className="h-6 w-6" />}
          </Button>
          
          {showVolume && (
            <Card className="absolute bottom-full mb-2 p-2 min-w-[150px]"
                 onMouseLeave={() => setShowVolume(false)}>
              <CardContent className="p-2">
                <Slider
                  value={[localMute ? 0 : localVolume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-full"
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {playlist && (
        <div className="space-y-2 mt-8">
          <h4 className="text-lg font-medium">Playlist: {playlist.title || playlist.name}</h4>
          <div className="space-y-1">
            {playlist.tracks.map((track) => (
              <Button
                key={track.id}
                variant="ghost"
                className={`w-full justify-start ${
                  currentTrack.id === track.id ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => setCurrentTrack(track)}
              >
                {getTrackTitle(track)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerTab;
