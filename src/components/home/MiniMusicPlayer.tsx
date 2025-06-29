
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

// Pistes de test avec des URLs audio réelles
const testTracks: Track[] = [
  {
    id: '1',
    title: 'Relaxation Nature',
    artist: 'EmotionsCare',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '2',
    title: 'Méditation Calme',
    artist: 'Wellness',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    id: '3',
    title: 'Focus Énergie',
    artist: 'Productivity',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  }
];

const MiniMusicPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([80]);

  const currentTrack = testTracks[currentTrackIndex];

  // Mettre à jour le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  // Mettre à jour la progression
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrackIndex]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log('Erreur de lecture audio:', error);
      // Fallback: générer un bip sonore avec Web Audio API
      generateTestSound();
      setIsPlaying(!isPlaying);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % testTracks.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? testTracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(false);
  };

  const handleProgressChange = (value: number[]) => {
    const audio = audioRef.current;
    if (audio && duration) {
      const newTime = (value[0] / 100) * duration;
      audio.currentTime = newTime;
      setProgress(value[0]);
    }
  };

  // Générer un son de test avec Web Audio API
  const generateTestSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Note A4
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5); // 0.5 seconde
    } catch (error) {
      console.log('Web Audio API non supporté');
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-3">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        preload="metadata"
      />
      
      {/* Info de la piste */}
      <div className="text-center">
        <p className="font-medium text-sm text-white truncate">{currentTrack.title}</p>
        <p className="text-xs text-white/80 truncate">{currentTrack.artist}</p>
      </div>

      {/* Barre de progression */}
      <div className="flex items-center gap-2 text-xs text-white/70">
        <span>{formatTime((progress / 100) * duration)}</span>
        <Slider
          value={[progress]}
          max={100}
          step={1}
          onValueChange={handleProgressChange}
          className="flex-1"
        />
        <span>{formatTime(duration)}</span>
      </div>

      {/* Contrôles de lecture */}
      <div className="flex items-center justify-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={handlePrevious}
          className="h-8 w-8 text-white hover:bg-white/20"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          size="icon"
          onClick={togglePlay}
          className="h-10 w-10 bg-white/20 hover:bg-white/30 text-white"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={handleNext}
          className="h-8 w-8 text-white hover:bg-white/20"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {/* Contrôle du volume */}
      <div className="flex items-center gap-2">
        <Volume2 className="h-4 w-4 text-white/70" />
        <Slider
          value={volume}
          max={100}
          step={1}
          onValueChange={setVolume}
          className="flex-1"
        />
        <span className="text-xs text-white/70 w-8">{volume[0]}%</span>
      </div>
    </div>
  );
};

export default MiniMusicPlayer;
