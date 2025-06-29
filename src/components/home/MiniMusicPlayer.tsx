
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const MiniMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Liste simple de fichiers audio de test
  const testTracks = [
    '/sounds/ambient-calm.mp3',
    '/sounds/welcome.mp3',
    '/sounds/notification.mp3'
  ];

  // Fonction de play/pause simple et directe
  const handlePlayPause = async () => {
    console.log('🎵 Bouton play/pause cliqué');
    
    if (!audioRef.current) {
      console.error('❌ Référence audio manquante');
      return;
    }

    try {
      if (isPlaying) {
        console.log('⏸️ Pause de la musique');
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        console.log('▶️ Lecture de la musique');
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          console.log('✅ Lecture démarrée avec succès');
        }
      }
    } catch (error) {
      console.error('❌ Erreur lors de la lecture:', error);
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    console.log('⏭️ Piste suivante');
    const nextTrack = (currentTrack + 1) % testTracks.length;
    setCurrentTrack(nextTrack);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handlePrevious = () => {
    console.log('⏮️ Piste précédente');
    const prevTrack = currentTrack === 0 ? testTracks.length - 1 : currentTrack - 1;
    setCurrentTrack(prevTrack);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    const vol = newVolume[0] / 100;
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const handleProgressChange = (newProgress: number[]) => {
    const time = (newProgress[0] / 100) * duration;
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  // Gestionnaires d'événements audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      handleNext();
    };

    const handleError = (e: Event) => {
      console.error('❌ Erreur audio:', e);
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Configuration initiale
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [volume]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const trackName = `Piste ${currentTrack + 1}`;

  return (
    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-lg text-white space-y-3">
      {/* Élément audio */}
      <audio
        ref={audioRef}
        src={testTracks[currentTrack]}
        preload="metadata"
      />
      
      {/* Info piste */}
      <div className="text-center">
        <div className="font-medium">{trackName}</div>
        <div className="text-xs opacity-75">Musicothérapie adaptative</div>
      </div>

      {/* Barre de progression */}
      <div className="space-y-1">
        <Slider
          value={[progress]}
          onValueChange={handleProgressChange}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs opacity-75">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex items-center justify-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handlePrevious}
          className="text-white hover:bg-white/20"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handlePlayPause}
          className="text-white hover:bg-white/20 p-2"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm"
          onClick={handleNext}
          className="text-white hover:bg-white/20"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Contrôle volume */}
      <div className="flex items-center space-x-2">
        <Volume2 className="h-4 w-4" />
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
