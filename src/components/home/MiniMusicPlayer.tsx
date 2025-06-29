
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const MiniMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Utiliser des sons de test réels et accessibles
  const tracks = [
    {
      title: "Méditation Matinale",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwSBY1IYmF2" // Son de test court
    },
    {
      title: "Relaxation Océan",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwSBY1IYmF2"
    },
    {
      title: "Zen Garden",
      url: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTmb1vPMeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwSBY1IYmF2"
    }
  ];

  useEffect(() => {
    // Créer l'élément audio programmatiquement
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.volume = volume;
    
    // Événements audio
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      console.log('Audio loaded, duration:', audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      console.log('Audio ended');
    };

    const handleError = (e: Event) => {
      console.error('Audio error:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    // Charger la première piste
    audio.src = tracks[currentTrack].url;

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [currentTrack]);

  const handlePlayPause = async () => {
    if (!audioRef.current) return;

    console.log('Play/Pause clicked, current state:', isPlaying);

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log('⏸️ Audio paused');
      } else {
        // Assurer que l'audio est chargé
        if (audioRef.current.readyState === 0) {
          audioRef.current.src = tracks[currentTrack].url;
          await audioRef.current.load();
        }
        
        await audioRef.current.play();
        setIsPlaying(true);
        console.log('▶️ Audio playing');
      }
    } catch (error) {
      console.error('Erreur lors de la lecture:', error);
      setIsPlaying(false);
    }
  };

  const handlePrevious = () => {
    const newTrack = currentTrack > 0 ? currentTrack - 1 : tracks.length - 1;
    setCurrentTrack(newTrack);
    setIsPlaying(false);
    setCurrentTime(0);
    console.log('⏮️ Piste précédente:', tracks[newTrack].title);
  };

  const handleNext = () => {
    const newTrack = currentTrack < tracks.length - 1 ? currentTrack + 1 : 0;
    setCurrentTrack(newTrack);
    setIsPlaying(false);
    setCurrentTime(0);
    console.log('⏭️ Piste suivante:', tracks[newTrack].title);
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
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
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-3">
      {/* Info piste */}
      <div className="text-center">
        <h4 className="text-sm font-medium text-white">{tracks[currentTrack].title}</h4>
      </div>

      {/* Contrôles principaux */}
      <div className="flex items-center justify-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="h-8 w-8 text-white hover:bg-white/20"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayPause}
          className="h-10 w-10 text-white hover:bg-white/20 bg-white/10"
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
          onClick={handleNext}
          className="h-8 w-8 text-white hover:bg-white/20"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Barre de progression */}
      <div className="space-y-1">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={handleProgressChange}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-white/70">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Contrôle volume */}
      <div className="flex items-center space-x-2">
        <Volume2 className="h-4 w-4 text-white/70" />
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={handleVolumeChange}
          className="flex-1 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default MiniMusicPlayer;
