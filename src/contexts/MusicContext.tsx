
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { musicPresets, musicTracks } from '@/data/musicData';

/**
 * 🎵 MusicContext — VERSION OFFICIELLE
 * ------------------------------------
 * Ceci est l'unique source de vérité pour la gestion de la musique/audio dans l'application.
 * Tout nouveau composant doit utiliser le hook `useMusic` de ce fichier.
 * NE PAS créer d'autres contexts music ailleurs !
 */
export const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Audio player state
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [volume, setVolumeState] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylistState] = useState<MusicPlaylist | null>(null);
  const [emotion, setEmotionState] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);

  // Audio element reference
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock playlists for demo
  const playlists: MusicPlaylist[] = [
    {
      id: 'calm-playlist',
      name: 'Calme et Zen',
      emotion: 'calm',
      tracks: musicTracks.filter(t => t.emotion === 'calm' || t.mood === 'calm')
    },
    {
      id: 'focus-playlist',
      name: 'Concentration',
      emotion: 'focus',
      tracks: musicTracks.filter(t => t.emotion === 'focus' || t.mood === 'focus')
    },
    {
      id: 'energy-playlist',
      name: 'Énergie',
      emotion: 'energetic',
      tracks: musicTracks.filter(t => t.emotion === 'energetic' || t.mood === 'energetic')
    },
  ];

  // Initialize audio element on mount
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    // Set up event listeners
    audio.addEventListener('timeupdate', () => {
      if (audio) setCurrentTime(audio.currentTime);
    });
    
    audio.addEventListener('durationchange', () => {
      if (audio) setDuration(audio.duration);
    });
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Set initialized flag
    setIsInitialized(true);
    
    // Cleanup
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
        audio.removeEventListener('durationchange', () => setDuration(audio.duration));
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      }
    };
  }, []);

  // Handle track change
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audio = audioRef.current;
      
      const audioUrl = currentTrack.audioUrl || currentTrack.url || currentTrack.src || '';
      
      if (audioUrl) {
        audio.src = audioUrl;
        audio.load();
        
        if (isPlaying) {
          audio.play().catch(handleError);
        }
      }
    }
  }, [currentTrack]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle muted change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
    }
  }, [muted]);

  // Handle playback end
  const handleEnded = () => {
    setIsPlaying(false);
    nextTrack();
  };

  // Handle audio errors
  const handleError = (e: Event) => {
    console.error("Audio error:", e);
    setError(new Error("Error playing audio"));
    setIsPlaying(false);
  };

  // Audio control methods
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const togglePlayPause = togglePlay; // Alias for compatibility

  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
    
    // If track is in a playlist but not the current one, update the playlist
    if (playlist && !playlist.tracks.some(t => t.id === track.id)) {
      const trackPlaylist = playlists.find(p => p.tracks.some(t => t.id === track.id));
      if (trackPlaylist) {
        setPlaylistState(trackPlaylist);
      }
    }
  };

  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    if (audioRef.current && currentTrack) {
      audioRef.current.play().catch(handleError);
      setIsPlaying(true);
    } else if (!currentTrack && playlist && playlist.tracks.length > 0) {
      // If no track is playing but we have a playlist, play the first track
      playTrack(playlist.tracks[0]);
    }
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex >= playlist.tracks.length - 1) {
      // If at the end or not found, play first track
      playTrack(playlist.tracks[0]);
    } else {
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };

  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex <= 0) {
      // If at the beginning or not found, play last track
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };

  const prevTrack = previousTrack; // Alias for compatibility

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolumeState(clampedVolume);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  // UI control methods
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const closeDrawer = () => {
    setOpenDrawer(false);
  };

  const setEmotion = (newEmotion: string) => {
    setEmotionState(newEmotion);
  };

  // Playlist management
  const setPlaylist = (input: MusicPlaylist | MusicTrack[]) => {
    if (Array.isArray(input)) {
      // Convert track array to playlist
      setPlaylistState({
        id: `playlist-${Date.now()}`,
        name: 'Custom Playlist',
        tracks: input,
      });
    } else {
      setPlaylistState(input);
    }
  };

  // Find tracks by mood/emotion
  const findTracksByMood = (mood: string) => {
    return musicTracks.filter(track => 
      track.mood?.toLowerCase() === mood.toLowerCase() || 
      track.emotion?.toLowerCase() === mood.toLowerCase()
    );
  };

  // Load playlist for emotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      setIsLoading(true);
      
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // Find playlist matching the emotion
      const emotionPlaylist = playlists.find(p => 
        p.emotion?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (emotionPlaylist) {
        setPlaylistState(emotionPlaylist);
        
        // If no current track, set the first track
        if (!currentTrack && emotionPlaylist.tracks.length > 0) {
          setCurrentTrack(emotionPlaylist.tracks[0]);
        }
        
        // Set recommendations
        setRecommendations(emotionPlaylist.tracks);
        
        // Update emotion
        setEmotionState(emotionName);
        
        return emotionPlaylist;
      }
      
      // If no matching playlist, create one with tracks of the emotion
      const matchingTracks = findTracksByMood(emotionName);
      if (matchingTracks.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `generated-${emotionName}-${Date.now()}`,
          name: `${emotionName.charAt(0).toUpperCase() + emotionName.slice(1)} Playlist`,
          tracks: matchingTracks,
          emotion: emotionName,
          created_at: new Date().toISOString()
        };
        
        setPlaylistState(newPlaylist);
        setRecommendations(matchingTracks);
        
        // If no current track, set the first track
        if (!currentTrack && matchingTracks.length > 0) {
          setCurrentTrack(matchingTracks[0]);
        }
        
        return newPlaylist;
      }
      
      return null;
    } catch (err) {
      console.error("Error loading playlist for emotion:", err);
      setError(err instanceof Error ? err : new Error("Failed to load playlist"));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Get recommendations by emotion
  const getRecommendationByEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | MusicTrack[]> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      const matchingTracks = findTracksByMood(emotionName);
      
      setRecommendations(matchingTracks);
      
      // Return as playlist
      return {
        id: `recommendations-${emotionName}`,
        name: `${emotionName.charAt(0).toUpperCase() + emotionName.slice(1)} Recommendations`,
        tracks: matchingTracks,
        emotion: emotionName
      };
    } catch (err) {
      console.error("Error getting recommendations:", err);
      return [];
    }
  };

  // Generate AI music (mock implementation)
  const generateMusic = async (prompt: string): Promise<MusicTrack | null> => {
    try {
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock generated track based on prompt
      const generatedTrack: MusicTrack = {
        id: `generated-${Date.now()}`,
        title: `Generated from: ${prompt.slice(0, 20)}...`,
        artist: "AI Composer",
        duration: 180, // 3 minutes
        audioUrl: "/audio/generated-track.mp3",
        coverUrl: "/images/ai-generated-cover.jpg",
        emotion: prompt.toLowerCase().includes('calm') ? 'calm' : 
                 prompt.toLowerCase().includes('happy') ? 'happy' : 'neutral',
        tags: ["ai-generated", prompt.split(" ")[0]],
        album: "AI Generated Music"
      };
      
      return generatedTrack;
    } catch (error) {
      console.error("Error generating music:", error);
      setError(error instanceof Error ? error : new Error("Failed to generate music"));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Advanced features
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };
  
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };
  
  const addToQueue = (track: MusicTrack) => {
    setQueue([...queue, track]);
  };
  
  const clearQueue = () => {
    setQueue([]);
  };

  const setProgress = (progress: number) => {
    if (duration > 0) {
      seekTo(duration * (progress / 100));
    }
  };

  // Initialize music system (for compatibility)
  const initializeMusicSystem = async (): Promise<void> => {
    setIsInitialized(true);
    return Promise.resolve();
  };

  const contextValue: MusicContextType = {
    // Audio player state
    isInitialized,
    isPlaying,
    currentTrack,
    volume,
    duration,
    currentTime,
    muted,
    isMuted: muted, // Alias for compatibility
    playlist,
    playlists,
    emotion,
    openDrawer,
    error,
    isRepeating,
    isShuffled,
    queue,
    recommendations,
    isLoading,
    
    // Audio player methods
    initializeMusicSystem,
    setVolume,
    setMute: setMuted,
    toggleMute,
    seekTo,
    togglePlay,
    togglePlayPause,
    pauseTrack,
    resumeTrack,
    playTrack,
    nextTrack,
    prevTrack,
    previousTrack,
    setProgress,
    
    // UI control
    setOpenDrawer,
    toggleDrawer,
    closeDrawer,
    setEmotion,
    
    // Playlist management
    setPlaylist,
    setCurrentTrack,
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    findTracksByMood,
    
    // Advanced features
    generateMusic,
    toggleRepeat,
    toggleShuffle,
    addToQueue,
    clearQueue
  };

  return <MusicContext.Provider value={contextValue}>{children}</MusicContext.Provider>;
};

/**
 * Hook to access the MusicContext
 * Always use this hook to access music functionality
 */
export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
