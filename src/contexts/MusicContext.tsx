
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, MusicPreferences } from '@/types';
import { playlistData } from '@/data/playlists';

interface MusicContextType {
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  repeat: 'none' | 'all' | 'one';
  shuffle: boolean;
  playTrack: (track: MusicTrack) => void;
  pauseTrack: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setRepeat: (mode: 'none' | 'all' | 'one') => void;
  setShuffle: (shuffle: boolean) => void;
  seekTo: (time: number) => void;
  playlists: MusicPlaylist[];
  currentPlaylist: MusicPlaylist | null;
  setCurrentPlaylist: (playlist: MusicPlaylist) => void;
  loadPlaylistForEmotion: (emotion: string) => MusicPlaylist | null;
  initializeMusicSystem: () => void;
  openDrawer: boolean;
  setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  error: Error | string | null;
}

const defaultContext: MusicContextType = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.5,
  muted: false,
  repeat: 'none',
  shuffle: false,
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  setVolume: () => {},
  setMuted: () => {},
  setRepeat: () => {},
  setShuffle: () => {},
  seekTo: () => {},
  playlists: [],
  currentPlaylist: null,
  setCurrentPlaylist: () => {},
  loadPlaylistForEmotion: () => null,
  initializeMusicSystem: () => {},
  openDrawer: false,
  setOpenDrawer: () => {},
  error: null
};

const MusicContext = createContext<MusicContextType>(defaultContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [audio] = useState(new Audio());
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'all' | 'one'>('none');
  const [shuffle, setShuffle] = useState(false);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [error, setError] = useState<Error | string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initializeMusicSystem = useCallback(() => {
    if (isInitialized) return;
    
    try {
      // Load playlists
      setPlaylists(playlistData);
      
      // Configure audio element
      audio.volume = volume;
      audio.muted = muted;
      
      setIsInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err : String(err));
    }
  }, [audio, isInitialized, muted, volume]);

  useEffect(() => {
    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else if (repeat === 'all') {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('ended', handleEnded);
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    const handleError = (e: Event) => {
      console.error('Audio playback error:', e);
      setError(new Error('Failed to play audio. Please try again.'));
      setIsPlaying(false);
    };
    
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, [audio, nextTrack, repeat]);

  useEffect(() => {
    audio.volume = volume;
  }, [audio, volume]);

  useEffect(() => {
    audio.muted = muted;
  }, [audio, muted]);

  const playTrack = useCallback((track: MusicTrack) => {
    if (!track || !track.url) {
      setError(new Error('Invalid track or missing URL'));
      return;
    }
    
    try {
      if (currentTrack && currentTrack.id === track.id) {
        // Toggle play/pause if same track
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          audio.play().catch(err => {
            setError(err);
          });
          setIsPlaying(true);
        }
      } else {
        // Play new track
        audio.src = track.url;
        audio.load();
        audio.play().catch(err => {
          setError(err);
        });
        setCurrentTrack(track);
        setIsPlaying(true);
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to play track'));
    }
  }, [audio, currentTrack, isPlaying]);

  const pauseTrack = useCallback(() => {
    audio.pause();
    setIsPlaying(false);
  }, [audio]);

  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    let nextIndex = currentIndex + 1;
    if (nextIndex >= currentPlaylist.tracks.length) {
      nextIndex = 0;
    }
    
    playTrack(currentPlaylist.tracks[nextIndex]);
  }, [currentPlaylist, currentTrack, playTrack]);

  const prevTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1) return;
    
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = currentPlaylist.tracks.length - 1;
    }
    
    playTrack(currentPlaylist.tracks[prevIndex]);
  }, [currentPlaylist, currentTrack, playTrack]);

  const seekTo = useCallback((time: number) => {
    if (time >= 0 && time <= duration) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  }, [audio, duration]);

  const loadPlaylistForEmotion = useCallback((emotion: string): MusicPlaylist | null => {
    const normalizedEmotion = emotion.toLowerCase();
    
    // Find playlist by emotion
    const playlist = playlists.find(p => 
      p.emotion && p.emotion.toLowerCase() === normalizedEmotion
    );
    
    if (playlist) {
      setCurrentPlaylist(playlist);
      return playlist;
    }
    
    // Fallback to neutral if specific emotion not found
    const neutralPlaylist = playlists.find(p => 
      p.emotion && p.emotion.toLowerCase() === 'neutral'
    );
    
    if (neutralPlaylist) {
      setCurrentPlaylist(neutralPlaylist);
      return neutralPlaylist;
    }
    
    // Ultimate fallback to first playlist
    if (playlists.length > 0) {
      setCurrentPlaylist(playlists[0]);
      return playlists[0];
    }
    
    return null;
  }, [playlists]);

  return (
    <MusicContext.Provider value={{
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      muted,
      repeat,
      shuffle,
      playTrack,
      pauseTrack,
      nextTrack,
      prevTrack,
      setVolume,
      setMuted,
      setRepeat,
      setShuffle,
      seekTo,
      playlists,
      currentPlaylist,
      setCurrentPlaylist,
      loadPlaylistForEmotion,
      initializeMusicSystem,
      openDrawer,
      setOpenDrawer,
      error
    }}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
