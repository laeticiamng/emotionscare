import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { MusicTrack, MusicPlaylist } from '@/types/music';

interface MusicContextProps {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentPlaylist: MusicPlaylist | null;
  currentEmotion: string | null;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  loadPlaylistForEmotion: (emotionType: string) => MusicPlaylist;
  createUserPlaylist: (name: string) => MusicPlaylist;
  savePlaylist: (name: string, tracks: MusicTrack[]) => MusicPlaylist;
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
}

const MusicContext = createContext<MusicContextProps>({
  currentTrack: null,
  isPlaying: false,
  currentPlaylist: null,
  currentEmotion: null,
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  loadPlaylistForEmotion: () => ({} as MusicPlaylist),
  createUserPlaylist: () => ({} as MusicPlaylist),
  savePlaylist: () => ({} as MusicPlaylist),
  openDrawer: false,
  setOpenDrawer: () => {},
});

export const useMusic = () => useContext(MusicContext);

const initialEmotionPlaylists: Record<string, MusicTrack[]> = {
  happy: [
    { id: '1', title: 'Happy Song 1', artist: 'Artist 1', duration: 180, url: '/music/happy1.mp3' },
    { id: '2', title: 'Happy Song 2', artist: 'Artist 2', duration: 200, url: '/music/happy2.mp3' },
  ],
  calm: [
    { id: '3', title: 'Calm Song 1', artist: 'Artist 3', duration: 220, url: '/music/calm1.mp3' },
    { id: '4', title: 'Calm Song 2', artist: 'Artist 4', duration: 240, url: '/music/calm2.mp3' },
  ],
  focused: [
    { id: '5', title: 'Focused Song 1', artist: 'Artist 5', duration: 260, url: '/music/focused1.mp3' },
    { id: '6', title: 'Focused Song 2', artist: 'Artist 6', duration: 280, url: '/music/focused2.mp3' },
  ],
  energetic: [
    { id: '7', title: 'Energetic Song 1', artist: 'Artist 7', duration: 300, url: '/music/energetic1.mp3' },
    { id: '8', title: 'Energetic Song 2', artist: 'Artist 8', duration: 320, url: '/music/energetic2.mp3' },
  ],
  melancholic: [
    { id: '9', title: 'Melancholic Song 1', artist: 'Artist 9', duration: 340, url: '/music/melancholic1.mp3' },
    { id: '10', title: 'Melancholic Song 2', artist: 'Artist 10', duration: 360, url: '/music/melancholic2.mp3' },
  ],
};

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const emotionPlaylists = useMemo(() => initialEmotionPlaylists, []);

  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    setCurrentTrack(currentPlaylist.tracks[nextIndex]);
  }, [currentTrack, currentPlaylist]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    const previousIndex = (currentIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    setCurrentTrack(currentPlaylist.tracks[previousIndex]);
  }, [currentTrack, currentPlaylist]);

  const loadPlaylistForEmotion = useCallback((emotionType: string) => {
    const emotionPlaylist: MusicPlaylist = {
      id: `emotion-${emotionType}`,
      title: `${emotionType.charAt(0).toUpperCase() + emotionType.slice(1)} Music`,
      name: `${emotionType.charAt(0).toUpperCase() + emotionType.slice(1)} Music`,
      tracks: emotionPlaylists[emotionType] || [],
      emotion: emotionType,
    };
    
    setCurrentPlaylist(emotionPlaylist);
    setCurrentEmotion(emotionType);
    
    if (emotionPlaylists[emotionType] && emotionPlaylists[emotionType].length > 0) {
      setCurrentTrack(emotionPlaylists[emotionType][0]);
    } else {
      setCurrentTrack(null);
    }

    return emotionPlaylist;
  }, [emotionPlaylists]);

  const createUserPlaylist = useCallback((name: string) => {
    const newPlaylist: MusicPlaylist = {
      id: `user-${Date.now()}`,
      title: name,
      name: name,
      description: "User created playlist",
      tracks: [],
      created_at: new Date().toISOString(),
    };
    
    setCurrentPlaylist(newPlaylist);
    return newPlaylist;
  }, []);

  const savePlaylist = useCallback((name: string, tracks: MusicTrack[]) => {
    const newPlaylist: MusicPlaylist = {
      id: `saved-${Date.now()}`,
      title: name,
      name: name,
      description: "Saved playlist",
      tracks: tracks,
      created_at: new Date().toISOString(),
    };
    
    setCurrentPlaylist(newPlaylist);
    return newPlaylist;
  }, []);

  const contextValue: MusicContextProps = {
    currentTrack,
    isPlaying,
    currentPlaylist,
    currentEmotion,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    loadPlaylistForEmotion,
    createUserPlaylist,
    savePlaylist,
    openDrawer,
    setOpenDrawer,
  };

  return (
    <MusicContext.Provider
      value={contextValue}
    >
      {children}
    </MusicContext.Provider>
  );
};
