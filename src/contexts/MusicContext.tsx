
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { mockTracks, mockPlaylists } from './music/mockMusicData';
import { normalizeTrack, normalizePlaylist } from '@/utils/musicCompatibility';

export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  currentPlaylist: null,
  playlists: [],
  isPlaying: false,
  volume: 0.5,
  duration: 0,
  muted: false,
  currentTime: 0,
  togglePlay: () => {},
  toggleMute: () => {},
  setVolume: () => {},
  playTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
});

export interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.5);
  const [duration, setDuration] = useState<number>(0);
  const [muted, setMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize with mock data
  useEffect(() => {
    if (!isInitialized) {
      setPlaylists(mockPlaylists);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    setMuted(prev => !prev);
  }, []);

  // Set volume
  const handleSetVolume = useCallback((value: number) => {
    setVolumeState(value);
  }, []);

  // Play a specific track
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(normalizeTrack(track));
    setIsPlaying(true);
  }, []);

  // Set current playlist
  const setPlaylist = useCallback((playlist: MusicPlaylist) => {
    setCurrentPlaylist(normalizePlaylist(playlist));
  }, []);

  // Play a playlist
  const playPlaylist = useCallback((playlist: MusicPlaylist) => {
    const normalizedPlaylist = normalizePlaylist(playlist);
    setCurrentPlaylist(normalizedPlaylist);
    
    // Play the first track if available
    if (normalizedPlaylist.tracks && normalizedPlaylist.tracks.length > 0) {
      playTrack(normalizedPlaylist.tracks[0]);
    }
  }, [playTrack]);

  // Next track
  const nextTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist || !currentPlaylist.tracks || currentPlaylist.tracks.length === 0) {
      return;
    }

    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex >= currentPlaylist.tracks.length - 1) {
      // If last track, play first track or stop
      if (currentPlaylist.tracks.length > 0) {
        playTrack(currentPlaylist.tracks[0]);
      }
    } else {
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);

  // Previous track
  const prevTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist || !currentPlaylist.tracks || currentPlaylist.tracks.length === 0) {
      return;
    }

    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // If first track, play last track or restart
      if (currentPlaylist.tracks.length > 0) {
        playTrack(currentPlaylist.tracks[currentPlaylist.tracks.length - 1]);
      }
    } else {
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  }, [currentTrack, currentPlaylist, playTrack]);

  // Seek to position
  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  // Toggle drawer
  const toggleDrawer = useCallback(() => {
    setOpenDrawer(prev => !prev);
  }, []);

  // Load playlist by emotion
  const loadPlaylistForEmotion = useCallback(async (params: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      let emotion: string;
      
      if (typeof params === 'string') {
        emotion = params;
      } else {
        emotion = params.emotion;
      }
      
      // Find playlist with matching emotion or mood
      const matchingPlaylist = playlists.find(playlist => 
        playlist.emotion === emotion || 
        playlist.mood === emotion ||
        (playlist.tags && typeof playlist.tags === 'string' && playlist.tags.includes(emotion)) ||
        (playlist.tags && Array.isArray(playlist.tags) && playlist.tags.includes(emotion))
      );
      
      if (matchingPlaylist) {
        return matchingPlaylist;
      }
      
      // If no matching playlist, create a generic one with tracks matching the emotion
      const matchingTracks = mockTracks.filter(track => 
        track.emotion === emotion || 
        track.mood === emotion || 
        (track.tags && typeof track.tags === 'string' && track.tags.includes(emotion)) ||
        (track.tags && Array.isArray(track.tags) && track.tags.includes(emotion))
      );
      
      if (matchingTracks.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `generated-${emotion}-${Date.now()}`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
          description: `Music for ${emotion} mood`,
          tracks: matchingTracks,
          emotion: emotion,
          mood: emotion
        };
        return newPlaylist;
      }
      
      return null;
    } catch (error) {
      console.error("Error loading playlist for emotion:", error);
      setError(`Failed to load playlist: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [playlists]);

  // Get recommendation by emotion
  const getRecommendationByEmotion = useCallback(async (emotion: string): Promise<MusicTrack | null> => {
    try {
      setIsLoading(true);
      
      // Get matching tracks for the emotion
      const matchingTracks = mockTracks.filter(track => 
        track.emotion === emotion || 
        track.mood === emotion ||
        (track.tags && typeof track.tags === 'string' && track.tags.includes(emotion)) ||
        (track.tags && Array.isArray(track.tags) && track.tags.includes(emotion))
      );
      
      if (matchingTracks.length > 0) {
        // Return a random track from the matching tracks
        const randomIndex = Math.floor(Math.random() * matchingTracks.length);
        return matchingTracks[randomIndex];
      }
      
      return null;
    } catch (error) {
      console.error("Error getting recommendation:", error);
      setError(`Failed to get recommendation: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate music for a given emotion (mock implementation)
  const generateMusic = useCallback(async (params: any): Promise<MusicTrack | null> => {
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate fake track based on params
      const generatedTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `Generated ${params.emotion || 'Music'}`,
        artist: 'AI Composer',
        audioUrl: '/sounds/ambient-calm.mp3', // Use a placeholder audio
        url: '/sounds/ambient-calm.mp3',
        duration: params.duration || 180,
        emotion: params.emotion || 'neutral',
        mood: params.emotion || 'neutral',
        coverUrl: '/images/covers/generated.jpg',
        intensity: params.intensity || 0.5,
        tags: ['generated', params.emotion || 'neutral']
      };
      
      return generatedTrack;
    } catch (error) {
      console.error("Error generating music:", error);
      setError(`Failed to generate music: ${error}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Build context value object
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
    togglePlay,
    toggleMute,
    setVolume: handleSetVolume,
    playTrack,
    nextTrack,
    prevTrack,
    previousTrack: prevTrack,
    pauseTrack: () => setIsPlaying(false),
    resumeTrack: () => setIsPlaying(true),
    play: () => setIsPlaying(true),
    pause: () => setIsPlaying(false),
    resume: () => setIsPlaying(true),
    next: nextTrack,
    previous: prevTrack,
    seekTo,
    toggleDrawer,
    setOpenDrawer,
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    setEmotion: () => {}, // Placeholder for future implementation
    generateMusic,
    setPlaylist,
    setCurrentTrack,
    playPlaylist,
    toggleRepeat: () => {}, // Placeholder for future implementation
    toggleShuffle: () => {}, // Placeholder for future implementation
    isInitialized
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
