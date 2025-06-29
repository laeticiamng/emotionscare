
import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

export type Track = { id: string; url: string; title: string; artist: string };

export interface MusicState {
  isPlaying: boolean;
  volume: number;
  playlist: Track[];
  currentTrack: Track | null;
  play(): void;
  pause(): void;
  toggle(): void;
  nextTrack(): void;
  prevTrack(): void;
  setVolume(v: number): void;
  setPlaylist(pl: Track[]): void;
  loadPlaylistForEmotion(emotion: string): Promise<void>;
  loadRecommendations(opts: { emotion?: string; autoActivate?: boolean }): Promise<void>;
  playRecommendedTrack(): void;
}

const defaultState: MusicState = {
  isPlaying: false,
  volume: 0.5,
  playlist: [],
  currentTrack: null,
  /* eslint-disable @typescript-eslint/no-empty-function */
  play() {},
  pause() {},
  toggle() {},
  nextTrack() {},
  prevTrack() {},
  setVolume() {},
  setPlaylist() {},
  async loadPlaylistForEmotion() {},
  async loadRecommendations() {},
  playRecommendedTrack() {},
  /* eslint-enable */
};

export const MusicContext = createContext<MusicState | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  type BasicState = Pick<MusicState, 'isPlaying' | 'volume' | 'playlist' | 'currentTrack'>;
  const [state, setState] = useState<BasicState>({
    isPlaying: false,
    volume: 0.5,
    playlist: [],
    currentTrack: null,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialiser l'audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume;
    
    const audio = audioRef.current;
    
    const handleEnded = () => {
      setState(s => ({ ...s, isPlaying: false }));
      nextTrack();
    };
    
    const handleError = (e: any) => {
      console.error('Erreur audio:', e);
      setState(s => ({ ...s, isPlaying: false }));
    };
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, []);

  // Mettre à jour le volume quand il change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  // Mettre à jour la source audio quand la track change
  useEffect(() => {
    if (audioRef.current && state.currentTrack) {
      console.log('🎵 Chargement de la piste:', state.currentTrack.url);
      audioRef.current.src = state.currentTrack.url;
      audioRef.current.load();
      
      if (state.isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('Erreur lors de la lecture:', error);
          setState(s => ({ ...s, isPlaying: false }));
        });
      }
    }
  }, [state.currentTrack]);

  const setPlaylist = useCallback((pl: Track[]) => {
    console.log('🎵 Playlist mise à jour:', pl);
    setState(s => ({ ...s, playlist: pl, currentTrack: pl[0] ?? null }));
  }, []);

  const play = useCallback(() => {
    if (audioRef.current && state.currentTrack) {
      console.log('▶️ Lecture de:', state.currentTrack.title);
      audioRef.current.play().then(() => {
        setState(s => ({ ...s, isPlaying: true }));
      }).catch(error => {
        console.error('Erreur lors de la lecture:', error);
      });
    }
  }, [state.currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      console.log('⏸️ Pause');
      audioRef.current.pause();
      setState(s => ({ ...s, isPlaying: false }));
    }
  }, []);

  const toggle = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, play, pause]);

  const nextTrack = useCallback(() => {
    setState(s => {
      if (!s.currentTrack || s.playlist.length === 0) return s;
      const idx = s.playlist.findIndex(t => t.id === s.currentTrack!.id);
      const next = s.playlist[(idx + 1) % s.playlist.length];
      console.log('⏭️ Piste suivante:', next?.title);
      return { ...s, currentTrack: next };
    });
  }, []);

  const prevTrack = useCallback(() => {
    setState(s => {
      if (!s.currentTrack || s.playlist.length === 0) return s;
      const idx = s.playlist.findIndex(t => t.id === s.currentTrack!.id);
      const prev = s.playlist[(idx - 1 + s.playlist.length) % s.playlist.length];
      console.log('⏮️ Piste précédente:', prev?.title);
      return { ...s, currentTrack: prev };
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    console.log('🔊 Volume:', Math.round(v * 100) + '%');
    setState(s => ({ ...s, volume: v }));
  }, []);

  const loadPlaylistForEmotion = async (emotion: string) => {
    // Utiliser des fichiers audio réels selon l'émotion
    const emotionTracks = {
      calm: [
        { id: 'calm-1', url: '/sounds/nature-calm.mp3', title: 'Nature Calme', artist: 'Ambient Sounds' },
        { id: 'calm-2', url: '/sounds/ambient-calm.mp3', title: 'Ambiance Relaxante', artist: 'Meditation Music' }
      ],
      energetic: [
        { id: 'energy-1', url: '/sounds/upbeat-energy.mp3', title: 'Énergie Positive', artist: 'Upbeat Vibes' },
        { id: 'energy-2', url: '/sounds/ambient-calm.mp3', title: 'Motivation', artist: 'Energy Music' }
      ],
      focused: [
        { id: 'focus-1', url: '/sounds/focus-ambient.mp3', title: 'Focus Deep', artist: 'Concentration' },
        { id: 'focus-2', url: '/sounds/ambient-calm.mp3', title: 'Travail Profond', artist: 'Deep Work' }
      ]
    };

    const tracks = emotionTracks[emotion as keyof typeof emotionTracks] || emotionTracks.calm;
    setPlaylist(tracks);
  };

  const loadRecommendations = async () => undefined;
  const playRecommendedTrack = () => play();

  const value: MusicState = {
    ...defaultState,
    ...state,
    play,
    pause,
    toggle,
    nextTrack,
    prevTrack,
    setVolume,
    setPlaylist,
    loadPlaylistForEmotion,
    loadRecommendations,
    playRecommendedTrack,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error('useMusic must be used within a MusicProvider');
  return ctx;
};

export default MusicProvider;
