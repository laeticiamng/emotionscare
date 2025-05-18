
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { getMockMusicData } from './music/mockMusicData';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylistState] = useState<MusicPlaylist | null>(null);
  const [emotion, setEmotionState] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);

  useEffect(() => {
    // Initialize with mock data
    try {
      const { playlists: mockPlaylists } = getMockMusicData();
      setPlaylists(mockPlaylists);
      setIsInitialized(true);
    } catch (error) {
      console.error("Failed to initialize music data:", error);
      setIsInitialized(true); // Still set initialized to prevent blocking the UI
    }
  }, []);

  const toggleMute = () => setMuted(!muted);
  
  const seekTo = (time: number) => {
    setCurrentTime(time);
    // In a real implementation, we would also seek the audio element
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const togglePlay = togglePlayPause;

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    setDuration(track.duration || 0);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.tracks.length - 1) return;
    
    const nextTrack = playlist.tracks[currentIndex + 1];
    playTrack(nextTrack);
  };

  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex <= 0) return;
    
    const prevTrack = playlist.tracks[currentIndex - 1];
    playTrack(prevTrack);
  };

  // Alias for prevTrack to handle naming inconsistencies
  const previousTrack = prevTrack;

  const setPlaylist = (input: MusicPlaylist | MusicTrack[]) => {
    if (Array.isArray(input)) {
      setPlaylistState({
        id: 'custom-playlist',
        name: 'Custom Playlist',
        tracks: input,
      });
    } else {
      setPlaylistState(input);
    }
  };

  const toggleDrawer = () => setOpenDrawer(!openDrawer);
  const closeDrawer = () => setOpenDrawer(false);

  // Pour la compatibilité avec les composants existants
  const getRecommendationByEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | MusicTrack[]> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      const matchingPlaylist = playlists.find(p => 
        p.emotion?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (matchingPlaylist) {
        return matchingPlaylist;
      }
      
      if (playlists.length > 0) {
        return playlists[0];  // Fallback to first playlist
      }
      
      return [];
    } catch (error) {
      console.error("Error getting recommendations:", error);
      return [];
    }
  };

  // Mock implementation of AI music generation
  const generateMusic = async (prompt: string): Promise<MusicTrack | null> => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock generated track
      const generatedTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `Generated from: ${prompt.slice(0, 20)}...`,
        artist: "AI Composer",
        duration: 180,
        audioUrl: "/audio/generated-track.mp3",
        coverUrl: "/images/ai-generated.jpg",
        album: "AI Generated Music",
        year: new Date().getFullYear(),
        tags: ["ai", "generated", prompt.split(" ")[0]],
        genre: "Electronic",
        category: "ai-generated"
      };
      
      return generatedTrack;
    } catch (error) {
      console.error('Error generating music:', error);
      setError(error instanceof Error ? error : new Error('Failed to generate music'));
      return null;
    }
  };

  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // In a real app, this would be an API call
      const emotionPlaylist = playlists.find(p => 
        p.emotion?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (emotionPlaylist) {
        setPlaylistState(emotionPlaylist);
        setEmotionState(emotionName);
        
        // If no current track, set the first track
        if (!currentTrack && emotionPlaylist.tracks.length > 0) {
          setCurrentTrack(emotionPlaylist.tracks[0]);
        }
        
        return emotionPlaylist;
      }
      
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const setEmotion = setEmotionState;

  const value: MusicContextType = {
    isInitialized,
    isPlaying,
    currentTrack,
    volume,
    setVolume,
    duration,
    currentTime,
    muted,
    setMute: setMuted,
    toggleMute,
    seekTo,
    togglePlayPause,
    togglePlay,
    playlist,
    emotion,
    openDrawer,
    toggleDrawer,
    closeDrawer,
    setOpenDrawer,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    prevTrack,
    previousTrack,
    setEmotion,
    loadPlaylistForEmotion,
    setPlaylist,
    generateMusic,
    setCurrentTrack,
    error,
    getRecommendationByEmotion,
    playlists
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
