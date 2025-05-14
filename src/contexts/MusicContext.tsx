import React, { createContext, useState, useEffect, useContext } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types/types';
import { getPlaylists, getTracksForPlaylist } from '@/lib/musicService';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  useEffect(() => {
    if (!isInitialized) {
      initializeMusicSystem();
    }
  }, [isInitialized]);

  const initializeMusicSystem = async () => {
    try {
      const initialPlaylists = await getPlaylists();
      setPlaylists(initialPlaylists);
      setIsInitialized(true);
    } catch (err: any) {
      setError(err.message || 'Failed to initialize music system.');
    }
  };

  const loadPlaylistById = async (id: string) => {
    try {
      const loadedTracks = await getTracksForPlaylist(id);
      setTracks(loadedTracks);
    } catch (err: any) {
      setError(err.message || 'Failed to load playlist.');
    }
  };

  const loadPlaylistForEmotion = async (emotion: string): Promise<MusicPlaylist | null> => {
    try {
      const foundPlaylist = playlists.find(playlist => playlist.emotion === emotion);
      if (foundPlaylist) {
        await loadPlaylistById(foundPlaylist.id);
        return foundPlaylist;
      } else {
        setError(`No playlist found for emotion: ${emotion}`);
        return null;
      }
    } catch (err: any) {
      setError(err.message || `Failed to load playlist for emotion: ${emotion}`);
      return null;
    }
  };

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;
    const currentIndex = currentTrack ? tracks.findIndex(track => track.id === currentTrack.id) : -1;
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const previousTrack = () => {
    if (tracks.length === 0) return;
    const currentIndex = currentTrack ? tracks.findIndex(track => track.id === currentTrack.id) : -1;
    const previousIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[previousIndex]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const adjustVolume = (value: number) => {
    setVolume(value);
  };

  const setEmotion = (emotion: string) => {
    setCurrentEmotion(emotion);
  };

  const value: MusicContextType = {
    tracks,
    currentTrack,
    playlists,
    currentEmotion,
    isPlaying,
    isMuted,
    volume,
    isInitialized,
    error,
    openDrawer,
    playTrack,
    pauseTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    toggleMute,
    adjustVolume,
    setEmotion,
    initializeMusicSystem,
    loadPlaylistById,
    loadPlaylistForEmotion,
    setOpenDrawer
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
