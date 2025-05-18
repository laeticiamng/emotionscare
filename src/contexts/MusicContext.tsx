
/**
 * 🎵 MusicContext — VERSION OFFICIELLE
 * ------------------------------------
 * Ceci est l'unique source de vérité pour la gestion de la musique/audio dans l'application.
 * Tout nouveau composant doit utiliser le hook `useMusic` de ce fichier.
 * NE PAS créer d'autres contexts music ailleurs !
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { musicTracks, musicPresets, mockPlaylists } from '@/data/musicData';

// Create the context with a default undefined value
const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Provider component
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
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [progress, setProgressState] = useState(0);
  
  // Audio element reference
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    // Set up event listeners
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('durationchange', () => setDuration(audio.duration));
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    
    // Set initialized flag
    setIsInitialized(true);
    
    // Cleanup
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      audio.removeEventListener('durationchange', () => setDuration(audio.duration));
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Update audio when currentTrack changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audioUrl = currentTrack.audioUrl || currentTrack.url || currentTrack.src || currentTrack.track_url;
      
      if (audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        
        if (isPlaying) {
          audioRef.current.play().catch(handleError);
        }
      }
    }
  }, [currentTrack]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Update muted state
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
    setError(new Error("Error playing audio"));
    setIsPlaying(false);
    console.error("Audio error:", e);
  };

  // Play a track
  const playTrack = (track: MusicTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  // Pause playback
  const pauseTrack = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  // Resume playback
  const resumeTrack = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(handleError);
    }
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      if (currentTrack) {
        resumeTrack();
      } else if (playlist && playlist.tracks.length > 0) {
        playTrack(playlist.tracks[0]);
      }
    }
  };
  
  // Alias for togglePlay
  const togglePlayPause = togglePlay;

  // Play next track
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex >= playlist.tracks.length - 1) {
      // If at the end or not found, play first track
      playTrack(playlist.tracks[0]);
    } else {
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };

  // Play previous track
  const prevTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // If at the beginning or not found, play last track
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };

  // Alias for prevTrack
  const previousTrack = prevTrack;

  // Seek to a specific time
  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
  };

  // Toggle drawer
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  // Close drawer
  const closeDrawer = () => {
    setOpenDrawer(false);
  };
  
  // Toggle repeat
  const toggleRepeat = () => {
    setIsRepeating(!isRepeating);
  };
  
  // Toggle shuffle
  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };
  
  // Add track to queue
  const addToQueue = (track: MusicTrack) => {
    setQueue(prev => [...prev, track]);
  };
  
  // Clear queue
  const clearQueue = () => {
    setQueue([]);
  };
  
  // Set progress
  const setProgress = (progress: number) => {
    setProgressState(progress);
  };
  
  // Find tracks by mood
  const findTracksByMood = (mood: string): MusicTrack[] => {
    return musicTracks.filter(track => track.mood?.toLowerCase() === mood.toLowerCase() || 
                                      track.emotion?.toLowerCase() === mood.toLowerCase());
  };

  // Handle playlist setting with array or playlist object
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

  // Load a playlist based on emotion
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      const emotionName = typeof params === 'string' ? params : params.emotion;
      
      // Find a playlist that matches the emotion
      const emotionPlaylist = mockPlaylists.find(p => 
        p.emotion?.toLowerCase() === emotionName.toLowerCase() || 
        p.mood?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (emotionPlaylist) {
        setPlaylist(emotionPlaylist);
        setEmotionState(emotionName);
        
        // If no current track, set the first track
        if (!currentTrack && emotionPlaylist.tracks.length > 0) {
          setCurrentTrack(emotionPlaylist.tracks[0]);
        }
        
        return emotionPlaylist;
      }
      
      // If no playlist matched, create one based on tracks with matching emotion/mood
      const matchingTracks = musicTracks.filter(track => 
        track.emotion?.toLowerCase() === emotionName.toLowerCase() ||
        track.mood?.toLowerCase() === emotionName.toLowerCase()
      );
      
      if (matchingTracks.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `generated-${emotionName}`,
          name: `${emotionName.charAt(0).toUpperCase() + emotionName.slice(1)} Playlist`,
          tracks: matchingTracks,
          emotion: emotionName,
          mood: emotionName,
        };
        
        setPlaylist(newPlaylist);
        setEmotionState(emotionName);
        
        if (!currentTrack) {
          setCurrentTrack(matchingTracks[0]);
        }
        
        return newPlaylist;
      }
      
      return null;
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err : new Error('Failed to load playlist'));
      return null;
    }
  };

  // Get recommendations based on emotion
  const getRecommendationByEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | MusicTrack[]> => {
    const emotionName = typeof params === 'string' ? params : params.emotion;
    const tracks = findTracksByMood(emotionName);
    
    if (tracks.length > 0) {
      return {
        id: `recommendation-${emotionName}`,
        name: `${emotionName.charAt(0).toUpperCase() + emotionName.slice(1)} Recommendations`,
        tracks: tracks,
        emotion: emotionName,
      };
    }
    
    return [];
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
        mood: prompt.toLowerCase().includes("calm") ? "calm" : 
              prompt.toLowerCase().includes("happy") ? "happy" : "neutral"
      };
      
      return generatedTrack;
    } catch (error) {
      console.error('Error generating music:', error);
      setError(error instanceof Error ? error : new Error('Failed to generate music'));
      return null;
    }
  };

  // Create the value object to be provided
  const value: MusicContextType = {
    isInitialized,
    isPlaying,
    currentTrack,
    volume,
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
    setEmotion: setEmotionState,
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    setPlaylist,
    setCurrentTrack,
    generateMusic,
    error,
    isRepeating,
    isShuffled,
    queue,
    progress,
    toggleRepeat,
    toggleShuffle,
    addToQueue,
    clearQueue,
    setProgress,
    findTracksByMood
  };

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
};

// Hook to use the music context
export const useMusic = (): MusicContextType => {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
