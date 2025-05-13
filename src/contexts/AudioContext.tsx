
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AudioTrack, AudioPlayerContextType } from '@/types/audio';
import { useToast } from '@/hooks/use-toast';

// Création du contexte
export const AudioContext = createContext<AudioPlayerContextType | undefined>(undefined);

// Données exemples
const SAMPLE_TRACKS: AudioTrack[] = [
  {
    id: 'relaxation-1',
    title: 'Sons relaxants de la nature',
    artist: 'Nature Sounds',
    duration: 296,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    type: 'relaxation',
    description: 'Écoutez les sons apaisants de la forêt tropicale pour réduire votre stress.'
  },
  {
    id: 'meditation-1',
    title: 'Méditation pleine conscience',
    artist: 'Mindfulness Masters',
    duration: 630,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5',
    type: 'meditation',
    description: 'Une séance guidée pour se recentrer sur le moment présent.'
  },
  {
    id: 'sleep-1',
    title: 'Berceuse pour sommeil profond',
    artist: 'Deep Sleep',
    duration: 945,
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://images.unsplash.com/photo-1531353826977-0941b4779a1c',
    type: 'sleep',
    description: 'Sons blancs et berceuses pour un sommeil réparateur.'
  }
];

interface AudioProviderProps {
  children: React.ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(
    typeof Audio !== 'undefined' ? new Audio() : null
  );
  const { toast } = useToast();
  
  // État du lecteur
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formater le temps en MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Mettre à jour le temps de lecture
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setProgress(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };
    
    const handleError = () => {
      setError('Erreur lors de la lecture audio');
      setLoading(false);
      setIsPlaying(false);
      toast({
        title: "Erreur audio",
        description: "Impossible de lire le fichier audio",
        variant: "destructive"
      });
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [toast]);
  
  // Jouer une piste
  const playTrack = (track: AudioTrack) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    // Réinitialiser l'état
    setError(null);
    setLoading(true);
    
    // Configurer la nouvelle piste
    audio.src = track.url;
    audio.volume = isMuted ? 0 : volume;
    
    // Charger et jouer
    audio.load();
    audio.play()
      .then(() => {
        setCurrentTrack(track);
        setIsPlaying(true);
      })
      .catch(err => {
        console.error('Erreur de lecture:', err);
        setError('Impossible de lire cette piste audio');
        setLoading(false);
        toast({
          title: "Erreur de lecture",
          description: err.message || "Impossible de lire cette piste",
          variant: "destructive"
        });
      });
  };
  
  // Mettre en pause
  const pauseTrack = () => {
    const audio = audioRef.current;
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    }
  };
  
  // Reprendre la lecture
  const resumeTrack = () => {
    const audio = audioRef.current;
    if (audio && currentTrack && !isPlaying) {
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          setError(err.message);
          toast({
            title: "Erreur",
            description: "Impossible de reprendre la lecture",
            variant: "destructive"
          });
        });
    }
  };
  
  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resumeTrack();
    } else if (SAMPLE_TRACKS.length > 0) {
      // Si aucune piste n'est sélectionnée, jouer la première disponible
      playTrack(SAMPLE_TRACKS[0]);
    }
  };
  
  // Régler le volume
  const setVolume = (newVolume: number) => {
    const audio = audioRef.current;
    const clampedVolume = Math.min(1, Math.max(0, newVolume));
    
    setVolumeState(clampedVolume);
    
    if (audio) {
      audio.volume = isMuted ? 0 : clampedVolume;
    }
    
    // Si le volume est augmenté à partir de 0, désactiver le mode muet
    if (isMuted && clampedVolume > 0) {
      setIsMuted(false);
    }
  };
  
  // Toggle mute
  const toggleMute = () => {
    const audio = audioRef.current;
    const newMuteState = !isMuted;
    
    setIsMuted(newMuteState);
    
    if (audio) {
      audio.volume = newMuteState ? 0 : volume;
    }
  };
  
  // Chercher une position dans la piste
  const seekTo = (time: number) => {
    const audio = audioRef.current;
    if (audio && !isNaN(time)) {
      audio.currentTime = Math.min(Math.max(0, time), audio.duration || 0);
      setProgress(audio.currentTime);
    }
  };
  
  // Mettre à jour le volume quand isMuted change
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);
  
  // Nettoyer lors du démontage du composant
  useEffect(() => {
    return () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, []);
  
  // Valeur du contexte
  const value = {
    currentTrack,
    isPlaying,
    volume,
    isMuted,
    progress,
    duration,
    loading,
    error,
    playTrack,
    pauseTrack,
    resumeTrack,
    togglePlay,
    setVolume,
    toggleMute,
    seekTo,
    formatTime
  };
  
  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
};

// Hook pour utiliser le contexte audio
export const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
