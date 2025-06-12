import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Track {
  id: string;
  title: string;
  url: string;
  artist?: string;
  duration?: number;
  emotion?: string;
}

interface MusicState {
  playlist: Track[];
  currentIndex: number;
  playing: boolean;
  volume: number;
}

export interface MusicContextValue extends MusicState {
  currentTrack: Track | null;
  play: (track: Track) => void;
  pause: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  setPlaylist: (tracks: Track[]) => void;
  loadPlaylistForEmotion: (opts: { emotion: string; intensity?: number }) => Promise<MusicPlaylist | null>;
  loadRecommendations: (opts: { emotion: string; autoActivate?: boolean }) => Promise<void>;
  playRecommendedTrack: (track: Track) => void;
}

export interface MusicPlaylist {
  id: string;
  name: string;
  tracks: Track[];
}

const MusicContext = createContext<MusicContextValue | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  if (!audioRef.current) audioRef.current = new Audio();

  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolumeState] = useState(() => audioRef.current!.volume ?? 1);

  const currentTrack = playlist[currentIndex] ?? null;

  const play = useCallback((track: Track) => {
    const index = playlist.findIndex(t => t.id === track.id);
    if (index !== -1) {
      setCurrentIndex(index);
    }
    audioRef.current!.src = track.url;
    audioRef.current!.volume = volume;
    audioRef.current!.play();
    setPlaying(true);
  }, [playlist, volume]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setPlaying(false);
  }, []);

  const next = useCallback(() => {
    if (!playlist.length) return;
    setCurrentIndex(i => (i + 1) % playlist.length);
  }, [playlist.length]);

  const prev = useCallback(() => {
    if (!playlist.length) return;
    setCurrentIndex(i => (i - 1 + playlist.length) % playlist.length);
  }, [playlist.length]);

  const setVolume = useCallback((v: number) => {
    const vol = Math.max(0, Math.min(1, v));
    setVolumeState(vol);
    if (audioRef.current) audioRef.current.volume = vol;
  }, []);

  const loadPlaylistForEmotion = async (opts: { emotion: string; intensity?: number }): Promise<MusicPlaylist | null> => {
    const res = await fetch(`/api/music?emotion=${opts.emotion}`);
    if (!res.ok) return null;
    const data = await res.json();
    setPlaylist(data.tracks ?? []);
    setCurrentIndex(0);
    return data;
  };

  const loadRecommendations = async (opts: { emotion: string; autoActivate?: boolean }) => {
    const playlist = await loadPlaylistForEmotion({ emotion: opts.emotion });
    if (opts.autoActivate && playlist && playlist.tracks.length) {
      play(playlist.tracks[0]);
    }
  };

  const playRecommendedTrack = (track: Track) => {
    play(track);
  };

  React.useEffect(() => {
    if (playing && currentTrack) {
      play(currentTrack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const value: MusicContextValue = {
    playlist,
    currentIndex,
    playing,
    volume,
    currentTrack,
    play,
    pause,
    next,
    prev,
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

export default MusicContext;
