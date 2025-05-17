
import React, { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';
import { AudioTrack } from '@/types/audio';

interface AudioPlayerState {
  currentTrack: AudioTrack | null;
  isPlaying: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  playlist: AudioTrack[];
  repeatMode: 'off' | 'all' | 'one';
  shuffleMode: boolean;
}

type AudioAction =
  | { type: 'PLAY_TRACK'; payload: AudioTrack }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'SET_CURRENT_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREV_TRACK' }
  | { type: 'SET_PLAYLIST'; payload: AudioTrack[] }
  | { type: 'TOGGLE_REPEAT' }
  | { type: 'TOGGLE_SHUFFLE' };

const initialState: AudioPlayerState = {
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  muted: false,
  currentTime: 0,
  duration: 0,
  playlist: [],
  repeatMode: 'off',
  shuffleMode: false,
};

const audioReducer = (state: AudioPlayerState, action: AudioAction): AudioPlayerState => {
  switch (action.type) {
    case 'PLAY_TRACK':
      return { ...state, currentTrack: action.payload, isPlaying: true, currentTime: 0 };
    case 'PAUSE':
      return { ...state, isPlaying: false };
    case 'RESUME':
      return { ...state, isPlaying: true };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload };
    case 'TOGGLE_MUTE':
      return { ...state, muted: !state.muted };
    case 'SET_CURRENT_TIME':
      return { ...state, currentTime: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_PLAYLIST':
      return { ...state, playlist: action.payload };
    case 'TOGGLE_REPEAT':
      return { 
        ...state, 
        repeatMode: state.repeatMode === 'off' 
          ? 'all' 
          : state.repeatMode === 'all' 
            ? 'one' 
            : 'off' 
      };
    case 'TOGGLE_SHUFFLE':
      return { ...state, shuffleMode: !state.shuffleMode };
    case 'NEXT_TRACK':
      if (!state.currentTrack || state.playlist.length === 0) return state;
      
      const currentIndex = state.playlist.findIndex(
        track => track.id === state.currentTrack?.id
      );
      
      if (currentIndex === -1) return state;
      
      if (state.shuffleMode) {
        // Random track excluding current
        const availableTracks = state.playlist.filter((_, index) => index !== currentIndex);
        if (availableTracks.length === 0) return state;
        
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        return { ...state, currentTrack: availableTracks[randomIndex], isPlaying: true, currentTime: 0 };
      } else {
        // Next track in order
        if (currentIndex === state.playlist.length - 1) {
          // Last track
          if (state.repeatMode === 'all') {
            // Loop to first track
            return { ...state, currentTrack: state.playlist[0], isPlaying: true, currentTime: 0 };
          } else if (state.repeatMode === 'one') {
            // Repeat current track
            return { ...state, currentTime: 0, isPlaying: true };
          } else {
            // End of playlist
            return { ...state, isPlaying: false };
          }
        } else {
          // Not last track, go to next
          return { 
            ...state, 
            currentTrack: state.playlist[currentIndex + 1], 
            isPlaying: true, 
            currentTime: 0 
          };
        }
      }
    case 'PREV_TRACK':
      if (!state.currentTrack || state.playlist.length === 0) return state;
      
      const currentIdx = state.playlist.findIndex(
        track => track.id === state.currentTrack?.id
      );
      
      if (currentIdx === -1) return state;
      
      if (state.shuffleMode) {
        // Random track excluding current
        const availableTracks = state.playlist.filter((_, index) => index !== currentIdx);
        if (availableTracks.length === 0) return state;
        
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        return { ...state, currentTrack: availableTracks[randomIndex], isPlaying: true, currentTime: 0 };
      } else {
        // Previous track in order
        if (currentIdx === 0) {
          // First track
          if (state.repeatMode === 'all') {
            // Loop to last track
            return { 
              ...state, 
              currentTrack: state.playlist[state.playlist.length - 1], 
              isPlaying: true, 
              currentTime: 0 
            };
          } else if (state.repeatMode === 'one') {
            // Repeat current track
            return { ...state, currentTime: 0, isPlaying: true };
          } else {
            // Stay on first track but restart
            return { ...state, currentTime: 0, isPlaying: true };
          }
        } else {
          // Not first track, go to previous
          return { 
            ...state, 
            currentTrack: state.playlist[currentIdx - 1], 
            isPlaying: true, 
            currentTime: 0 
          };
        }
      }
    default:
      return state;
  }
};

// Context definition
interface AudioContextValue {
  state: AudioPlayerState;
  playTrack: (track: AudioTrack) => void;
  pauseTrack: () => void;
  resumeTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  setPlaylist: (tracks: AudioTrack[]) => void;
  toggleRepeatMode: () => void;
  toggleShuffleMode: () => void;
}

const AudioContext = createContext<AudioContextValue | undefined>(undefined);

export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Handle audio events
  useEffect(() => {
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_CURRENT_TIME', payload: audioElement.currentTime });
    };

    const handleLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', payload: audioElement.duration });
    };

    const handleEnded = () => {
      dispatch({ type: 'NEXT_TRACK' });
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioElement]);

  // Update audio element when track changes
  useEffect(() => {
    if (audioElement && state.currentTrack) {
      const source = state.currentTrack.url;
      audioElement.src = source;
      audioElement.load();
      if (state.isPlaying) {
        audioElement.play().catch(error => {
          console.error('Audio playback error:', error);
        });
      }
    }
  }, [state.currentTrack, audioElement]);

  // Update playing state
  useEffect(() => {
    if (!audioElement) return;

    if (state.isPlaying) {
      audioElement.play().catch(error => {
        console.error('Audio playback error:', error);
        dispatch({ type: 'PAUSE' });
      });
    } else {
      audioElement.pause();
    }
  }, [state.isPlaying, audioElement]);

  // Update volume and mute state
  useEffect(() => {
    if (!audioElement) return;

    audioElement.volume = state.muted ? 0 : state.volume;
  }, [state.volume, state.muted, audioElement]);

  // Audio control functions
  const playTrack = (track: AudioTrack) => {
    dispatch({ type: 'PLAY_TRACK', payload: track });
  };

  const pauseTrack = () => {
    dispatch({ type: 'PAUSE' });
  };

  const resumeTrack = () => {
    dispatch({ type: 'RESUME' });
  };

  const nextTrack = () => {
    dispatch({ type: 'NEXT_TRACK' });
  };

  const prevTrack = () => {
    dispatch({ type: 'PREV_TRACK' });
  };

  const setVolume = (volume: number) => {
    dispatch({ type: 'SET_VOLUME', payload: Math.min(1, Math.max(0, volume)) });
  };

  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_MUTE' });
  };

  const seekTo = (time: number) => {
    if (audioElement) {
      audioElement.currentTime = time;
      dispatch({ type: 'SET_CURRENT_TIME', payload: time });
    }
  };

  const setPlaylist = (tracks: AudioTrack[]) => {
    dispatch({ type: 'SET_PLAYLIST', payload: tracks });
  };

  const toggleRepeatMode = () => {
    dispatch({ type: 'TOGGLE_REPEAT' });
  };

  const toggleShuffleMode = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const value = {
    state,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    setVolume,
    toggleMute,
    seekTo,
    setPlaylist,
    toggleRepeatMode,
    toggleShuffleMode
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
};

export default AudioProvider;
