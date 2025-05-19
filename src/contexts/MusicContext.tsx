
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, MusicQueueItem, EmotionMusicParams } from '@/types/music';
import { getPlaylistByEmotion } from '@/data/emotionPlaylists';
import { mapAudioUrlToUrl } from '@/utils/musicCompatibility';

// Default state for the context
const defaultMusicState: MusicContextType = {
  currentTrack: null,
  currentPlaylist: null,
  playlist: null,
  queue: [],
  history: [],
  isPlaying: false,
  volume: 0.75,
  muted: false,
  currentTime: 0,
  duration: 0,
  repeat: 'off',
  shuffle: false,
  openDrawer: false,
  isInitialized: false,
  error: null,
  
  // Placeholder functions
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  previousTrack: () => {},
  nextTrack: () => {},
  addToQueue: () => {},
  removeFromQueue: () => {},
  clearQueue: () => {},
};

// Create context
export const MusicContext = createContext<MusicContextType>(defaultMusicState);

// Provider component
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [history, setHistory] = useState<MusicTrack[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [repeat, setRepeat] = useState<'off' | 'track' | 'playlist'>('off');
  const [shuffle, setShuffle] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [emotion, setEmotion] = useState<string>('calm');

  // Functions to control playback
  const playTrack = useCallback((track: MusicTrack) => {
    const processedTrack = mapAudioUrlToUrl(track);
    setCurrentTrack(processedTrack);
    setIsPlaying(true);
    setHistory(h => [
      ...h,
      {
        ...processedTrack,
        playlistId: currentPlaylist ? currentPlaylist.id : undefined,
      },
    ]);
  }, [currentPlaylist]);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const resumeTrack = useCallback(() => {
    if (currentTrack) {
      setIsPlaying(true);
    }
  }, [currentTrack]);

  const previousTrack = useCallback(() => {
    // Find the index of the current track in the queue
    if (!currentTrack || !currentPlaylist || !currentPlaylist.tracks.length) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // If at the start or not found, play the last track
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    } else {
      // Play the previous track
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);

  const nextTrack = useCallback(() => {
    // Find the index of the current track in the queue
    if (!currentTrack || !currentPlaylist || !currentPlaylist.tracks.length) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === currentPlaylist.tracks.length - 1) {
      // If at the end or not found, play the first track
      playTrack(currentPlaylist.tracks[0]);
    } else {
      // Play the next track
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);

  const loadPlaylistForEmotion = useCallback(async (params: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      let emotion: string;
      
      if (typeof params === 'string') {
        emotion = params;
      } else {
        emotion = params.emotion;
        setEmotion(emotion);
      }
      
      // Get the playlist for this emotion
      const playlist = getPlaylistByEmotion(emotion);
      
      if (playlist) {
        setCurrentPlaylist(playlist);
        
        // If we have tracks, set the first one as current
        if (playlist.tracks && playlist.tracks.length > 0) {
          setCurrentTrack(mapAudioUrlToUrl(playlist.tracks[0]));
        }
        
        return playlist;
      }
      
      return null;
    } catch (error) {
      console.error("Error loading playlist for emotion:", error);
      setError(error instanceof Error ? error : new Error('Failed to load playlist'));
      return null;
    }
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  const toggleRepeat = useCallback(() => {
    setRepeat(current => {
      if (current === 'off') return 'track';
      if (current === 'track') return 'playlist';
      return 'off';
    });
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  }, [isPlaying, pauseTrack, resumeTrack]);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  const toggleDrawer = useCallback(() => {
    setOpenDrawer(prev => !prev);
  }, []);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const addToQueue = useCallback(
    (track: MusicTrack) => {
      setQueue(q => [
        ...q,
        { ...track, playlistId: currentPlaylist ? currentPlaylist.id : undefined }
      ]);
    },
    [currentPlaylist]
  );

  const removeFromQueue = useCallback((index: number) => {
    setQueue(q => q.filter((_, i) => i !== index));
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Value object to be passed to consumers
  const value: MusicContextType = {
    currentTrack,
    currentPlaylist,
    playlist: currentPlaylist,
    queue,
    history,
    isPlaying,
    volume,
    muted,
    currentTime,
    duration,
    repeat,
    shuffle,
    openDrawer,
    isInitialized,
    error,
    
    // Actions
    playTrack,
    pauseTrack,
    resumeTrack,
    previousTrack,
    nextTrack,
    setTrack: setCurrentTrack,
    setPlaylist: setCurrentPlaylist,
    setVolume,
    setMuted,
    seekTo,
    addToQueue,
    removeFromQueue,
    clearQueue,
    setRepeat,
    toggleShuffle,
    toggleRepeat,
    togglePlay,
    toggleMute,
    toggleDrawer,
    setOpenDrawer,
    loadPlaylistForEmotion,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    setIsInitialized,
    setCurrentTrack,
    setHistory,
    setEmotion,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook for using the music context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
