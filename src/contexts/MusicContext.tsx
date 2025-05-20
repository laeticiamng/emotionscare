
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { mockTracks, mockPlaylists } from './music/mockMusicData';
import { useToast } from '@/hooks/use-toast';

// Initial context value with all required methods
const initialContext: MusicContextType = {
  currentTrack: null,
  currentPlaylist: null,
  playlists: [],
  isPlaying: false,
  volume: 0.5,
  duration: 0,
  muted: false,
  currentTime: 0,
  isLoading: false,
  error: '',
  
  togglePlay: () => {},
  toggleMute: () => {},
  setVolume: () => {},
  playTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  addToPlaylist: () => {},
  removeFromPlaylist: () => {},
  createPlaylist: () => {},
  playEmotion: () => {},
};

export const MusicContext = createContext<MusicContextType>(initialContext);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  
  const { toast } = useToast();

  // Load playlists on mount
  useEffect(() => {
    // Load mock playlists for development
    setPlaylists(mockPlaylists);
    setIsInitialized(true);
  }, []);

  // Player controls
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  const handleSetVolume = useCallback((value: number) => {
    setVolume(value);
    if (value > 0 && muted) {
      setMuted(false);
    }
  }, [muted]);

  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // Additional logic for playing the actual audio would be here
  }, []);

  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
    // Additional logic for pausing the actual audio would be here
  }, []);

  const resumeTrack = useCallback(() => {
    setIsPlaying(true);
    // Additional logic for resuming the actual audio would be here
  }, []);

  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === currentPlaylist.tracks.length - 1) {
      // Either track not found or it's the last track
      return;
    }
    
    const nextTrack = currentPlaylist.tracks[currentIndex + 1];
    playTrack(nextTrack);
  }, [currentPlaylist, currentTrack, playTrack]);

  const previousTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex <= 0) {
      // Either track not found or it's the first track
      return;
    }
    
    const prevTrack = currentPlaylist.tracks[currentIndex - 1];
    playTrack(prevTrack);
  }, [currentPlaylist, currentTrack, playTrack]);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
    // Additional logic for seeking in the actual audio would be here
  }, []);

  const toggleDrawer = useCallback(() => {
    setOpenDrawer(prev => !prev);
  }, []);

  // Playlist management
  const setPlaylist = useCallback((playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
  }, []);

  const playPlaylist = useCallback((playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
    if (playlist.tracks && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  }, [playTrack]);

  // Emotion-based music
  const loadPlaylistForEmotion = useCallback(async (params: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    setIsLoading(true);
    try {
      const emotion = typeof params === 'string' ? params : params.emotion;
      
      // Find a playlist that matches the emotion
      const emotionPlaylist = playlists.find(p => 
        p.emotion === emotion || 
        p.category === emotion
      );
      
      if (emotionPlaylist) {
        setCurrentPlaylist(emotionPlaylist);
        setIsLoading(false);
        return emotionPlaylist;
      }
      
      // If no specific playlist found, create a new one with tracks matching the emotion
      const emotionTracks = mockTracks.filter(track => 
        track.emotion === emotion || 
        (typeof track.category === 'string' && track.category === emotion) ||
        (Array.isArray(track.category) && track.category.includes(emotion))
      );
      
      if (emotionTracks.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `emotion-${emotion}-${Date.now()}`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
          description: `Music for ${emotion} mood`,
          tracks: emotionTracks,
          emotion: emotion,
          category: 'mood'
        };
        
        setCurrentPlaylist(newPlaylist);
        setIsLoading(false);
        return newPlaylist;
      }
      
      setIsLoading(false);
      return null;
    } catch (error) {
      console.error('Error loading playlist for emotion:', error);
      setError('Failed to load playlist for this emotion');
      setIsLoading(false);
      return null;
    }
  }, [playlists]);

  const getRecommendationByEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    // This is similar to loadPlaylistForEmotion but might include different logic
    const emotionTracks = mockTracks.filter(track => 
      track.emotion === emotion || 
      (typeof track.category === 'string' && track.category === emotion) ||
      (Array.isArray(track.category) && track.category.includes(emotion))
    );
    
    if (emotionTracks.length > 0) {
      return {
        id: `recommendation-${emotion}-${Date.now()}`,
        title: `Recommended for ${emotion}`,
        description: `Tracks recommended for ${emotion} mood`,
        tracks: emotionTracks,
        emotion: emotion,
        category: 'recommendation'
      };
    }
    
    return null;
  }, []);

  const generateMusic = useCallback(async (params: any): Promise<MusicPlaylist | null> => {
    // In a real app, this might call an API to generate music
    // For now, return a mock playlist
    return getRecommendationByEmotion(params.emotion || 'calm');
  }, [getRecommendationByEmotion]);

  // Additional required methods
  const addToPlaylist = useCallback((trackId: string, playlistId: string) => {
    setPlaylists(prevPlaylists => {
      return prevPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          const track = mockTracks.find(t => t.id === trackId);
          if (track && !playlist.tracks.some(t => t.id === trackId)) {
            return {
              ...playlist,
              tracks: [...playlist.tracks, track]
            };
          }
        }
        return playlist;
      });
    });
  }, []);

  const removeFromPlaylist = useCallback((trackId: string, playlistId: string) => {
    setPlaylists(prevPlaylists => {
      return prevPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            tracks: playlist.tracks.filter(t => t.id !== trackId)
          };
        }
        return playlist;
      });
    });
  }, []);

  const createPlaylist = useCallback((name: string, tracks: MusicTrack[] = []) => {
    const newPlaylist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      title: name,
      tracks: tracks,
      description: `Custom playlist: ${name}`
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    toast({
      title: "Playlist created",
      description: `"${name}" has been created successfully`
    });
  }, [toast]);

  const playEmotion = useCallback((emotion: string) => {
    loadPlaylistForEmotion(emotion).then(playlist => {
      if (playlist && playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
      }
    });
  }, [loadPlaylistForEmotion, playTrack]);

  const value: MusicContextType = {
    currentTrack,
    currentPlaylist,
    playlists,
    isPlaying,
    volume,
    duration,
    muted,
    currentTime,
    isLoading,
    error,
    openDrawer,
    isInitialized,
    
    // Player controls
    togglePlay,
    toggleMute,
    setVolume: handleSetVolume,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack: previousTrack,
    previousTrack,
    seekTo,
    
    // Aliases for compatibility
    play: playTrack,
    pause: pauseTrack,
    resume: resumeTrack,
    next: nextTrack,
    previous: previousTrack,
    
    // UI controls
    toggleDrawer,
    setOpenDrawer,
    
    // Playlist management
    playlist: currentPlaylist,
    setPlaylist,
    setCurrentTrack,
    playPlaylist,
    
    // Emotion-based music
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    generateMusic,
    
    // Additional required methods
    addToPlaylist,
    removeFromPlaylist,
    createPlaylist,
    playEmotion,
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
