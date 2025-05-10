
import React, { createContext, useContext, useState, useCallback } from 'react';
import { mockPlaylists } from '@/data/mockMusic';
import { MusicTrack, MusicPlaylist, MusicContextType } from '@/types/music';

// Create the context with default values
const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  currentPlaylist: null,
  isPlaying: false,
  volume: 0.7,
  openDrawer: false,
  setOpenDrawer: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  setVolume: () => {},
  loadPlaylistForEmotion: async () => null,
  getTracksForEmotion: () => [],
  currentEmotion: '',
  toggleRepeat: () => {},
  toggleShuffle: () => {},
  initializeMusicSystem: async () => {},
  error: null,
  playlists: [],
  loadPlaylistById: async () => null,
});

// Create a provider component
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState('');
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize music system
  const initializeMusicSystem = useCallback(async () => {
    try {
      // In a real app, fetch from API
      setPlaylists(mockPlaylists);
      return true;
    } catch (err) {
      setError('Failed to initialize music system');
      console.error(err);
      return false;
    }
  }, []);

  // Track control functions
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Open drawer automatically when playing
    setOpenDrawer(true);
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex >= 0 && currentIndex < currentPlaylist.tracks.length - 1) {
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    } else if (currentIndex === currentPlaylist.tracks.length - 1 && repeat) {
      // When repeat is on, go back to the first track
      playTrack(currentPlaylist.tracks[0]);
    }
  }, [currentPlaylist, currentTrack, playTrack, repeat]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    } else if (currentIndex === 0 && repeat) {
      // When repeat is on, go to the last track
      playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
    }
  }, [currentPlaylist, currentTrack, playTrack, repeat]);

  // Toggle functions
  const toggleRepeat = useCallback(() => {
    setRepeat(prev => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle(prev => !prev);
  }, []);

  // Load playlist for a specific emotion
  const loadPlaylistForEmotion = useCallback(async (emotion: string) => {
    try {
      // In a real app, fetch from API based on emotion
      const playlist = mockPlaylists.find(
        p => p.emotion?.toLowerCase() === emotion.toLowerCase()
      );
      
      if (playlist) {
        setCurrentPlaylist(playlist);
        setCurrentEmotion(emotion);
        
        // Auto play the first track
        if (playlist.tracks.length > 0) {
          playTrack(playlist.tracks[0]);
        }
        
        return playlist;
      }
      
      // Default playlist if no match
      const defaultPlaylist = mockPlaylists[0];
      setCurrentPlaylist(defaultPlaylist);
      
      if (defaultPlaylist?.tracks.length > 0) {
        playTrack(defaultPlaylist.tracks[0]);
      }
      
      return defaultPlaylist;
    } catch (err) {
      setError('Failed to load playlist for emotion: ' + emotion);
      console.error(err);
      return null;
    }
  }, [playTrack]);

  // Load playlist by ID
  const loadPlaylistById = useCallback(async (id: string) => {
    try {
      // In a real app, fetch from API based on ID
      const playlist = mockPlaylists.find(p => p.id === id);
      
      if (playlist) {
        setCurrentPlaylist(playlist);
        if (playlist.emotion) {
          setCurrentEmotion(playlist.emotion);
        }
        return playlist;
      }
      
      setError('Playlist not found');
      return null;
    } catch (err) {
      setError('Failed to load playlist by ID');
      console.error(err);
      return null;
    }
  }, []);

  // Get tracks for a specific emotion
  const getTracksForEmotion = useCallback((emotion: string) => {
    const matchingPlaylist = mockPlaylists.find(
      p => p.emotion?.toLowerCase() === emotion.toLowerCase()
    );
    
    return matchingPlaylist?.tracks || [];
  }, []);

  // Provide the context value
  const contextValue: MusicContextType = {
    currentTrack,
    currentPlaylist,
    isPlaying,
    volume,
    openDrawer,
    setOpenDrawer,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    setVolume,
    loadPlaylistForEmotion,
    getTracksForEmotion,
    currentEmotion,
    toggleRepeat,
    toggleShuffle,
    initializeMusicSystem,
    error,
    playlists,
    loadPlaylistById,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook to use the music context
export const useMusic = () => useContext(MusicContext);

// Make the provider available via named export
export default MusicProvider;
