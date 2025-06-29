
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

const MiniMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Pistes de test avec des sons générés programmatiquement
  const tracks: Track[] = [
    {
      id: '1',
      title: 'Méditation Calme',
      artist: 'Nature Sounds',
      url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DvullFCh9+vd3yvnU1+hJ5xNm2bAcfNJ3C6dJQCg0LYLjL6edUCQ1Hp+DwrV8bBjab2PG9aDcHLYPU7d2EVQoQdLrq6qJgDzFfvuPqVlAJF1K55PlPLiFGn9TzNmDv4NqYaP0Nd2WqgIZFRZI4d+lS8u7fHQs/aqL0yfueCNYflr7uxLl4dLCWJoW3x7jEZEPLdG5jJNfF5uHvLMKhNDFjhLBfU4wBBAAIZGF0YeYBAABBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUF'
    },
    {
      id: '2', 
      title: 'Focus Intense',
      artist: 'Deep Work',
      url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DvullFCh9+vd3yvnU1+hJ5xNm2bAcfNJ3C6dJQCg0LYLjL6edUCQ1Hp+DwrV8bBjab2PG9aDcHLYPU7d2EVQoQdLrq6qJgDzFfvuPqVlAJF1K55PlPLiFGn9TzNmDv4NqYaP0Nd2WqgIZFRZI4d+lS8u7fHQs/aqL0yfueCNYflr7uxLl4dLCWJoW3x7jEZEPLdG5jJNfF5uHvLMKhNDFjhLBfU4wBBAAIZGF0YeYBAABBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUF'
    }
  ];

  const currentTrack = tracks[currentTrackIndex];

  // Gestionnaires d'événements audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Contrôle du volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Fonctions de contrôle
  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        await audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Erreur lors de la lecture audio:', error);
      // Générer un son de test programmatiquement si l'audio échoue
      generateTestSound();
    }
  };

  const generateTestSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Note A4
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
    
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(false);
  };

  const previousTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(false);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && duration) {
      const newTime = (value[0] / 100) * duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-sm mx-auto">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="metadata"
      />
      
      {/* Info de la piste */}
      <div className="text-center mb-4">
        <h3 className="text-sm font-medium text-white truncate">
          {currentTrack.title}
        </h3>
        <p className="text-xs text-white/70 truncate">
          {currentTrack.artist}
        </p>
      </div>

      {/* Barre de progression */}
      <div className="mb-4">
        <Slider
          value={[progressPercentage]}
          onValueChange={handleProgressChange}
          max={100}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-white/70 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Contrôles de lecture */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button
          onClick={previousTrack}
          size="sm"
          variant="ghost"
          className="text-white hover:text-white/80"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          onClick={togglePlayPause}
          size="lg"
          className="bg-white/20 hover:bg-white/30 text-white border-0 rounded-full w-12 h-12"
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6 ml-0.5" />
          )}
        </Button>

        <Button
          onClick={nextTrack}
          size="sm"
          variant="ghost"
          className="text-white hover:text-white/80"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Contrôle du volume */}
      <div className="flex items-center space-x-2">
        <Volume2 className="h-4 w-4 text-white/70" />
        <Slider
          value={[volume * 100]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default MiniMusicPlayer;
