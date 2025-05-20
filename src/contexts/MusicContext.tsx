
import React, { createContext, useContext, useState, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { defaultPlaylists } from '@/data/musicPlaylists';
import { ensureArray } from '@/utils/musicCompatibility';

// Create the music context with default values
export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  currentPlaylist: null,
  playlists: [],
  isPlaying: false,
  volume: 0.7,
  duration: 0,
  muted: false,
  currentTime: 0,
  isLoading: false,
  
  // Playback control methods
  togglePlay: () => {},
  toggleMute: () => {},
  setVolume: () => {},
  playTrack: () => {},
  nextTrack: () => {},
  prevTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {},
  
  // Initialize other required methods
  loadPlaylistForEmotion: async () => null,
  getRecommendationByEmotion: async () => null,
  setEmotion: () => {},
  generateMusic: async () => null,
  setPlaylist: () => {},
  playPlaylist: () => {}
});

// Provider component
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(defaultPlaylists);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string>('calm');
  
  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    setMuted(!muted);
  }, [muted]);
  
  // Volume control
  const handleVolumeChange = useCallback((newVolume: number) => {
    setVolume(newVolume);
  }, []);
  
  // Play a track
  const playTrack = useCallback((track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);
  
  // Pause track
  const pauseTrack = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  // Resume track
  const resumeTrack = useCallback(() => {
    setIsPlaying(true);
  }, []);
  
  // Next track
  const nextTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const tracks = currentPlaylist.tracks;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    
    if (currentIndex < tracks.length - 1) {
      playTrack(tracks[currentIndex + 1]);
    } else {
      // Loop back to first track
      playTrack(tracks[0]);
    }
  }, [currentPlaylist, currentTrack, playTrack]);
  
  // Previous track
  const prevTrack = useCallback(() => {
    if (!currentPlaylist || !currentTrack) return;
    
    const tracks = currentPlaylist.tracks;
    const currentIndex = tracks.findIndex(track => track.id === currentTrack.id);
    
    if (currentIndex > 0) {
      playTrack(tracks[currentIndex - 1]);
    } else {
      // Loop to last track
      playTrack(tracks[tracks.length - 1]);
    }
  }, [currentPlaylist, currentTrack, playTrack]);
  
  // Seek to a position
  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);
  
  // Toggle drawer
  const toggleDrawer = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);
  
  // Load playlist for emotion
  const loadPlaylistForEmotion = useCallback(async (params: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      const emotion = typeof params === 'string' ? params : params.emotion;
      
      // Find a playlist that matches the emotion
      let playlist = playlists.find(p => 
        (p.emotion && p.emotion.toLowerCase() === emotion.toLowerCase()) ||
        (p.mood && p.mood.toLowerCase() === emotion.toLowerCase()) ||
        (p.tags && ensureArray(p.tags).some(tag => 
          typeof tag === 'string' && tag.toLowerCase() === emotion.toLowerCase()
        ))
      );
      
      if (!playlist) {
        // Create a default playlist if none exists
        playlist = {
          id: `generated-${Date.now()}`,
          title: `${emotion} Mix`,
          description: `Customized mix for ${emotion} mood`,
          tracks: playlists.flatMap(p => p.tracks).slice(0, 5),
          emotion: emotion,
          mood: emotion,
          coverUrl: "/music/covers/default.jpg"
        };
        
        setPlaylists([...playlists, playlist]);
      }
      
      setCurrentPlaylist(playlist);
      return playlist;
    } catch (error) {
      console.error('Error loading playlist for emotion:', error);
      setError('Failed to load playlist');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [playlists]);
  
  // Get recommendation by emotion
  const getRecommendationByEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      
      // Find tracks that match the emotion
      const matchingTracks = playlists.flatMap(p => p.tracks).filter(track => 
        (track.emotion && track.emotion.toLowerCase() === emotion.toLowerCase()) ||
        (track.mood && track.mood.toLowerCase() === emotion.toLowerCase()) ||
        (track.tags && ensureArray(track.tags).some(tag => 
          typeof tag === 'string' && tag.toLowerCase() === emotion.toLowerCase()
        ))
      );
      
      if (matchingTracks.length > 0) {
        const recommendedPlaylist: MusicPlaylist = {
          id: `recommended-${Date.now()}`,
          title: `${emotion} Recommendation`,
          description: `Recommended tracks for ${emotion}`,
          tracks: matchingTracks,
          emotion: emotion,
          mood: emotion
        };
        
        return recommendedPlaylist;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting recommendation:', error);
      setError('Failed to get recommendation');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [playlists]);
  
  // Set emotion
  const setEmotion = useCallback((emotion: string) => {
    setCurrentEmotion(emotion);
  }, []);
  
  // Generate music (mock implementation)
  const generateMusic = useCallback(async (params: any): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      const emotion = params.emotion || 'calm';
      
      // For now, just return the first playlist
      const playlist = playlists[0] || null;
      return playlist;
    } catch (error) {
      console.error('Error generating music:', error);
      setError('Failed to generate music');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [playlists]);
  
  // Set playlist
  const handleSetPlaylist = useCallback((playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
  }, []);
  
  // Play playlist
  const playPlaylist = useCallback((playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  }, [playTrack]);
  
  // Context value
  const value = {
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
    
    // Actions
    togglePlay,
    toggleMute,
    setVolume: handleVolumeChange,
    playTrack,
    nextTrack,
    prevTrack,
    previousTrack: prevTrack,
    pauseTrack,
    resumeTrack,
    seekTo,
    toggleDrawer,
    setOpenDrawer,
    
    // Aliases for compatibility
    play: playTrack,
    pause: pauseTrack,
    resume: resumeTrack,
    next: nextTrack,
    previous: prevTrack,
    
    // Playlist management
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    setEmotion,
    generateMusic,
    setPlaylist: handleSetPlaylist,
    setCurrentTrack,
    playPlaylist
  };
  
  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

// Hook for using the music context
export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
