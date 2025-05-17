
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AudioContextValue, AudioPlayerState, AudioTrack } from '@/types/audio';

// Contexte d'audio par défaut
const defaultAudioState: AudioPlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  isMuted: false,
  progress: 0,
  duration: 0,
  playlist: [],
  repeatMode: 'off',
  shuffleMode: false,
};

// Création du contexte
export const AudioContext = createContext<AudioContextValue>({
  audioState: defaultAudioState,
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

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audioState, setAudioState] = useState<AudioPlayerState>(defaultAudioState);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Initialiser l'élément audio
  useEffect(() => {
    const audio = new Audio();
    setAudioElement(audio);
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Mettre à jour la progression de la lecture
  useEffect(() => {
    if (!audioElement) return;

    const updateProgress = () => {
      setAudioState(state => ({
        ...state,
        progress: audioElement.currentTime,
        duration: audioElement.duration || 0
      }));
    };

    const handleEnded = () => {
      switch (audioState.repeatMode) {
        case 'one':
          audioElement.currentTime = 0;
          audioElement.play().catch(console.error);
          break;
        case 'all':
          next();
          break;
        default:
          // Si on n'est pas à la fin de la playlist, passer à la piste suivante
          if (getNextTrackIndex() !== null) {
            next();
          } else {
            setAudioState(state => ({ ...state, isPlaying: false }));
          }
      }
    };

    audioElement.addEventListener('timeupdate', updateProgress);
    audioElement.addEventListener('ended', handleEnded);
    
    return () => {
      audioElement.removeEventListener('timeupdate', updateProgress);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioElement, audioState.repeatMode]);

  // Contrôle du volume et du mute
  useEffect(() => {
    if (!audioElement) return;
    
    audioElement.volume = audioState.isMuted ? 0 : audioState.volume;
  }, [audioElement, audioState.volume, audioState.isMuted]);

  // Charger et jouer une piste
  const playTrack = useCallback((track: AudioTrack) => {
    if (!audioElement) return;
    
    audioElement.src = track.url;
    audioElement.play().catch(e => console.error("Erreur lors de la lecture:", e));
    
    setAudioState(state => ({
      ...state,
      currentTrack: track,
      isPlaying: true,
      progress: 0
    }));
  }, [audioElement]);

  // Jouer/reprendre la lecture
  const play = useCallback(() => {
    if (!audioElement || !audioState.currentTrack) return;
    
    audioElement.play().catch(console.error);
    setAudioState(state => ({ ...state, isPlaying: true }));
  }, [audioElement, audioState.currentTrack]);

  // Mettre en pause
  const pause = useCallback(() => {
    if (!audioElement) return;
    
    audioElement.pause();
    setAudioState(state => ({ ...state, isPlaying: false }));
  }, [audioElement]);

  // Arrêter la lecture
  const stop = useCallback(() => {
    if (!audioElement) return;
    
    audioElement.pause();
    audioElement.currentTime = 0;
    setAudioState(state => ({ ...state, isPlaying: false, progress: 0 }));
  }, [audioElement]);

  // Obtenir l'index de la piste suivante
  const getNextTrackIndex = useCallback((): number | null => {
    if (!audioState.currentTrack || audioState.playlist.length === 0) {
      return null;
    }
    
    const currentIndex = audioState.playlist.findIndex(
      track => track.id === audioState.currentTrack?.id
    );
    
    if (currentIndex === -1 || currentIndex === audioState.playlist.length - 1) {
      return audioState.repeatMode === 'all' ? 0 : null;
    }
    
    return currentIndex + 1;
  }, [audioState.currentTrack, audioState.playlist, audioState.repeatMode]);

  // Obtenir l'index de la piste précédente
  const getPrevTrackIndex = useCallback((): number | null => {
    if (!audioState.currentTrack || audioState.playlist.length === 0) {
      return null;
    }
    
    const currentIndex = audioState.playlist.findIndex(
      track => track.id === audioState.currentTrack?.id
    );
    
    if (currentIndex === -1 || currentIndex === 0) {
      return audioState.repeatMode === 'all' ? audioState.playlist.length - 1 : null;
    }
    
    return currentIndex - 1;
  }, [audioState.currentTrack, audioState.playlist, audioState.repeatMode]);

  // Passer à la piste suivante
  const next = useCallback(() => {
    const nextIndex = getNextTrackIndex();
    
    if (nextIndex !== null) {
      const nextTrack = audioState.playlist[nextIndex];
      playTrack(nextTrack);
    }
  }, [getNextTrackIndex, audioState.playlist, playTrack]);

  // Passer à la piste précédente
  const previous = useCallback(() => {
    const prevIndex = getPrevTrackIndex();
    
    if (prevIndex !== null) {
      const prevTrack = audioState.playlist[prevIndex];
      playTrack(prevTrack);
    }
  }, [getPrevTrackIndex, audioState.playlist, playTrack]);

  // Régler le volume
  const setVolume = useCallback((volume: number) => {
    setAudioState(state => ({ ...state, volume, isMuted: volume === 0 }));
  }, []);

  // Activer/désactiver le son
  const toggleMute = useCallback(() => {
    setAudioState(state => ({ ...state, isMuted: !state.isMuted }));
  }, []);

  // Se positionner à un moment précis
  const seekTo = useCallback((position: number) => {
    if (!audioElement) return;
    
    audioElement.currentTime = position;
    setAudioState(state => ({ ...state, progress: position }));
  }, [audioElement]);

  // Activer/désactiver la lecture aléatoire
  const toggleShuffle = useCallback(() => {
    setAudioState(state => ({ ...state, shuffleMode: !state.shuffleMode }));
  }, []);

  // Changer le mode de répétition
  const changeRepeatMode = useCallback(() => {
    setAudioState(state => {
      const modes: ('off' | 'one' | 'all')[] = ['off', 'one', 'all'];
      const currentIndex = modes.indexOf(state.repeatMode);
      const nextIndex = (currentIndex + 1) % modes.length;
      return { ...state, repeatMode: modes[nextIndex] };
    });
  }, []);

  return (
    <AudioContext.Provider
      value={{
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
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
export const useMusic = useAudio; // Alias pour clarté contextuelle dans certains composants
