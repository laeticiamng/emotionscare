
import React, { createContext, useState, useContext, useRef, useCallback, useEffect } from 'react';
import { AudioTrack, AudioPlayerState, AudioContextValue } from '@/types/audio';

const defaultState: AudioPlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  progress: 0,
  duration: 0,
  playlist: [],
  repeatMode: 'off',
  shuffleMode: false
};

const AudioContext = createContext<AudioContextValue>({
  audioState: defaultState,
  play: () => {},
  pause: () => {},
  stop: () => {},
  next: () => {},
  previous: () => {},
  setVolume: () => {},
  toggleMute: () => {},
  seekTo: () => {},
  playTrack: () => {},
  toggleShuffle: () => {},
  changeRepeatMode: () => {},
});

export const useAudio = () => useContext(AudioContext);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>(defaultState);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Initialise l'élément audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = audioState.volume;

    // Nettoyage
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Met à jour la progression de la lecture
  const startProgressTimer = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      if (audioRef.current && audioRef.current.currentTime && audioRef.current.duration) {
        setAudioState(prev => ({
          ...prev,
          progress: audioRef.current?.currentTime || 0,
          duration: audioRef.current?.duration || 0,
        }));
      }
    }, 1000);
  }, []);

  // Fonctions de contrôle audio
  const play = useCallback(() => {
    if (!audioRef.current || !audioState.currentTrack) return;
    
    audioRef.current.play()
      .then(() => {
        setAudioState(prev => ({ ...prev, isPlaying: true }));
        startProgressTimer();
      })
      .catch(error => {
        console.error('Error playing audio:', error);
      });
  }, [audioState.currentTrack, startProgressTimer]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setAudioState(prev => ({ ...prev, isPlaying: false }));
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioState(prev => ({
        ...prev,
        isPlaying: false,
        progress: 0
      }));
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, []);

  // Fonction pour obtenir le prochain morceau
  const getNextTrackIndex = useCallback(() => {
    if (!audioState.currentTrack || audioState.playlist.length === 0) return null;
    
    const currentIndex = audioState.playlist.findIndex(t => t.id === audioState.currentTrack?.id);
    if (currentIndex === -1) return null;
    
    if (audioState.shuffleMode) {
      // Mode aléatoire
      const randomIndex = Math.floor(Math.random() * audioState.playlist.length);
      return randomIndex !== currentIndex ? randomIndex : (randomIndex + 1) % audioState.playlist.length;
    } else {
      // Mode normal
      return (currentIndex + 1) % audioState.playlist.length;
    }
  }, [audioState.currentTrack, audioState.playlist, audioState.shuffleMode]);

  // Fonction pour obtenir le morceau précédent
  const getPreviousTrackIndex = useCallback(() => {
    if (!audioState.currentTrack || audioState.playlist.length === 0) return null;
    
    const currentIndex = audioState.playlist.findIndex(t => t.id === audioState.currentTrack?.id);
    if (currentIndex === -1) return null;
    
    if (audioState.shuffleMode) {
      // Mode aléatoire
      const randomIndex = Math.floor(Math.random() * audioState.playlist.length);
      return randomIndex !== currentIndex ? randomIndex : (randomIndex - 1 + audioState.playlist.length) % audioState.playlist.length;
    } else {
      // Mode normal
      return (currentIndex - 1 + audioState.playlist.length) % audioState.playlist.length;
    }
  }, [audioState.currentTrack, audioState.playlist, audioState.shuffleMode]);

  // Gestionnaire de fin de morceau
  useEffect(() => {
    const handleTrackEnd = () => {
      if (audioState.repeatMode === 'one') {
        // Répéter le morceau actuel
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play()
            .catch(err => console.error('Error replaying track:', err));
        }
      } else {
        // Passer au morceau suivant
        const nextIndex = getNextTrackIndex();
        if (nextIndex !== null) {
          playTrack(audioState.playlist[nextIndex]);
        } else if (audioState.repeatMode === 'all') {
          // Recommencer la playlist
          playTrack(audioState.playlist[0]);
        } else {
          // Arrêter la lecture
          stop();
        }
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleTrackEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleTrackEnd);
      }
    };
  }, [audioState.playlist, audioState.repeatMode, stop, getNextTrackIndex]);

  // Navigation dans la playlist
  const next = useCallback(() => {
    const nextIndex = getNextTrackIndex();
    if (nextIndex !== null) {
      playTrack(audioState.playlist[nextIndex]);
    } else if (audioState.repeatMode === 'all' && audioState.playlist.length > 0) {
      playTrack(audioState.playlist[0]);
    }
  }, [audioState.playlist, audioState.repeatMode, getNextTrackIndex]);

  const previous = useCallback(() => {
    const prevIndex = getPreviousTrackIndex();
    if (prevIndex !== null) {
      playTrack(audioState.playlist[prevIndex]);
    }
  }, [audioState.playlist, getPreviousTrackIndex]);

  // Jouer un morceau spécifique
  const playTrack = useCallback((track: AudioTrack) => {
    if (!track || !track.url) {
      console.error('Invalid track or missing URL');
      return;
    }
    
    if (audioRef.current) {
      const newUrl = track.audioUrl || track.url;
      
      // Si c'est un nouveau morceau
      if (audioRef.current.src !== newUrl) {
        audioRef.current.src = newUrl;
        audioRef.current.load();
      }
      
      setAudioState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: true,
        progress: 0,
        duration: prev.duration
      }));
      
      audioRef.current.play()
        .then(() => {
          startProgressTimer();
        })
        .catch(err => {
          console.error('Error playing track:', err);
          setAudioState(prev => ({ ...prev, isPlaying: false }));
        });
    }
  }, [startProgressTimer]);

  // Contrôles de volume et de recherche
  const setVolume = useCallback((volume: number) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setAudioState(prev => ({ ...prev, volume: newVolume }));
  }, []);

  const toggleMute = useCallback(() => {
    setAudioState(prev => {
      const newMuted = !prev.isMuted;
      if (audioRef.current) {
        audioRef.current.muted = newMuted;
      }
      return { ...prev, isMuted: newMuted };
    });
  }, []);

  const seekTo = useCallback((position: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = position;
      setAudioState(prev => ({ ...prev, progress: position }));
    }
  }, []);

  // Contrôles de mode de lecture
  const toggleShuffle = useCallback(() => {
    setAudioState(prev => ({ 
      ...prev, 
      shuffleMode: !prev.shuffleMode 
    }));
  }, []);

  const changeRepeatMode = useCallback(() => {
    setAudioState(prev => {
      const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all'];
      const currentIndex = modes.indexOf(prev.repeatMode);
      const nextMode = modes[(currentIndex + 1) % modes.length];
      return { ...prev, repeatMode: nextMode };
    });
  }, []);

  const contextValue: AudioContextValue = {
    audioState,
    play,
    pause,
    stop,
    next,
    previous,
    setVolume,
    toggleMute,
    seekTo,
    playTrack,
    toggleShuffle,
    changeRepeatMode
  };

  return (
    <AudioContext.Provider value={contextValue}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioContext;
