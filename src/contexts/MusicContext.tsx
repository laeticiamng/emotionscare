import React, { createContext, useContext, useState, useCallback } from 'react';

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

  const setPlaylist = useCallback((pl: Track[]) => {
    setState(s => ({ ...s, playlist: pl, currentTrack: pl[0] ?? null }));
  }, []);

  const play = useCallback(() => setState(s => ({ ...s, isPlaying: true })), []);
  const pause = useCallback(() => setState(s => ({ ...s, isPlaying: false })), []);
  const toggle = useCallback(() => setState(s => ({ ...s, isPlaying: !s.isPlaying })), []);
  const nextTrack = useCallback(
    () =>
      setState(s => {
        if (!s.currentTrack) return s;
        const idx = s.playlist.findIndex(t => t.id === s.currentTrack!.id);
        const next = s.playlist[(idx + 1) % s.playlist.length];
        return { ...s, currentTrack: next };
      }),
    [],
  );
  const prevTrack = useCallback(
    () =>
      setState(s => {
        if (!s.currentTrack) return s;
        const idx = s.playlist.findIndex(t => t.id === s.currentTrack!.id);
        const prev = s.playlist[(idx - 1 + s.playlist.length) % s.playlist.length];
        return { ...s, currentTrack: prev };
      }),
    [],
  );
  const setVolume = useCallback((v: number) => setState(s => ({ ...s, volume: v })), []);

  const loadPlaylistForEmotion = async (emotion: string) => {
    setPlaylist([{ id: 'mock', url: '/mock.mp3', title: emotion, artist: 'Mock' }]);
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
