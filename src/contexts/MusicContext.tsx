import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { mockMusicTracks, mockMusicPlaylists } from '@/mocks/musicTracks';
import { useToast } from '@/hooks/use-toast';
import { ensurePlaylist, trackToMusicTrack, getTrackAudioUrl } from '@/utils/musicCompatibility';

// Create the context with a meaningful default value
const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  currentTrack: null,
  isInitialized: false,
  volume: 0.5,
  muted: false,
  duration: 0,
  currentTime: 0,
  playlist: null,
  openDrawer: false,
  emotion: null,
  
  // Required methods with empty implementations
  togglePlay: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  seekTo: () => {},
  setVolume: () => {},
  setMute: () => {},
  toggleMute: () => {},
  setEmotion: () => {},
  setPlaylist: () => {},
  setCurrentTrack: () => {},
  loadPlaylistForEmotion: async () => null,
  setOpenDrawer: () => {},
  prevTrack: () => {} // Alias for previousTrack
});

export interface MusicProviderProps {
  children: ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(mockMusicPlaylists);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  
  const { toast } = useToast();

  // Initialize audio element
  useEffect(() => {
    if (!audioElement) {
      const audio = new Audio();
      audio.volume = volume;
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('durationchange', () => {
        setDuration(audio.duration);
      });
      
      audio.addEventListener('ended', handleTrackEnded);
      
      setAudioElement(audio);
      setIsInitialized(true);
    }
    
    return () => {
      if (audioElement) {
        audioElement.removeEventListener('ended', handleTrackEnded);
        audioElement.pause();
      }
    };
  }, []);

  // Handle track ended
  const handleTrackEnded = () => {
    if (isRepeating) {
      // Restart the same track
      if (audioElement) {
        audioElement.currentTime = 0;
        audioElement.play();
      }
    } else {
      // Play next track
      nextTrack();
    }
  };

  // Play a track
  const playTrack = useCallback((track: MusicTrack) => {
    if (!audioElement) return;
    
    const audioUrl = getTrackAudioUrl(track);
    if (!audioUrl) {
      console.error('Track has no audio URL:', track);
      toast({
        title: "Erreur",
        description: "Ce morceau n'a pas d'URL audio valide",
        variant: "destructive"
      });
      return;
    }
    
    audioElement.src = audioUrl;
    audioElement.load();
    
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setCurrentTrack(track);
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error playing track:', error);
          setIsPlaying(false);
          toast({
            title: "Erreur de lecture",
            description: "Impossible de lire ce morceau",
            variant: "destructive"
          });
        });
    }
  }, [audioElement, toast]);

  // Pause playback
  const pauseTrack = useCallback(() => {
    if (!audioElement) return;
    audioElement.pause();
    setIsPlaying(false);
  }, [audioElement]);

  // Resume playback
  const resumeTrack = useCallback(() => {
    if (!audioElement || !currentTrack) return;
    
    const playPromise = audioElement.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(error => {
          console.error('Error resuming playback:', error);
          toast({
            title: "Erreur de lecture",
            description: "Impossible de reprendre la lecture",
            variant: "destructive"
          });
        });
    }
  }, [audioElement, currentTrack, toast]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resumeTrack();
    } else if (playlist && playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  }, [isPlaying, currentTrack, playlist, pauseTrack, resumeTrack, playTrack]);

  // Next track
  const nextTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.tracks.length - 1) {
      // If it's the last track, play the first one
      playTrack(playlist.tracks[0]);
    } else {
      // Otherwise play the next one
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  }, [playlist, currentTrack, playTrack]);

  // Previous track
  const previousTrack = useCallback(() => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === 0) {
      // If it's the first track, play the last one
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      // Otherwise play the previous one
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  }, [playlist, currentTrack, playTrack]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    if (!audioElement) return;
    
    const clampedVolume = Math.min(Math.max(newVolume, 0), 1);
    audioElement.volume = clampedVolume;
    setVolumeState(clampedVolume);
    
    if (clampedVolume > 0 && muted) {
      setMuted(false);
      audioElement.muted = false;
    }
  }, [audioElement, muted]);

  // Seek to position
  const seekTo = useCallback((seconds: number) => {
    if (!audioElement) return;
    
    audioElement.currentTime = seconds;
    setCurrentTime(seconds);
  }, [audioElement]);

  // Set mute
  const setMute = useCallback((shouldMute: boolean) => {
    if (!audioElement) return;
    
    audioElement.muted = shouldMute;
    setMuted(shouldMute);
  }, [audioElement]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioElement) return;
    
    const newMuted = !muted;
    audioElement.muted = newMuted;
    setMuted(newMuted);
  }, [audioElement, muted]);

  // Toggle repeat mode
  const toggleRepeat = useCallback(() => {
    setIsRepeating(!isRepeating);
  }, [isRepeating]);

  // Toggle shuffle mode
  const toggleShuffle = useCallback(() => {
    setIsShuffled(!isShuffled);
  }, [isShuffled]);

  // Add a track to the queue
  const addToQueue = useCallback((track: MusicTrack) => {
    setQueue(currentQueue => [...currentQueue, track]);
  }, []);

  // Clear the queue
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  // Set playlist
  const setPlaylistHandler = useCallback((newPlaylist: MusicPlaylist | MusicTrack[]) => {
    const formattedPlaylist = ensurePlaylist(newPlaylist);
    setPlaylist(formattedPlaylist);
    
    if (formattedPlaylist.tracks.length > 0 && !currentTrack) {
      setCurrentTrack(formattedPlaylist.tracks[0]);
    }
  }, [currentTrack]);

  // Load playlist for emotion
  const loadPlaylistForEmotion = useCallback(async (emotionParam: string | EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      // Extract emotion string from parameter
      const emotionString = typeof emotionParam === 'string' ? emotionParam : emotionParam.emotion;
      
      // In a real app, this would fetch from an API
      const matchingPlaylists = mockMusicPlaylists.filter(p => 
        p.emotion && p.emotion.toLowerCase() === emotionString.toLowerCase()
      );
      
      if (matchingPlaylists.length > 0) {
        const selectedPlaylist = matchingPlaylists[0];
        setPlaylist(selectedPlaylist);
        setEmotion(emotionString);
        
        if (selectedPlaylist.tracks.length > 0) {
          setCurrentTrack(selectedPlaylist.tracks[0]);
          if (audioElement) {
            playTrack(selectedPlaylist.tracks[0]);
          }
        }
        
        return selectedPlaylist;
      }
      
      // If no matching playlist, create one from tracks with matching emotion
      const matchingTracks = mockMusicTracks.filter(t => 
        t.emotion && t.emotion.toLowerCase() === emotionString.toLowerCase()
      );
      
      if (matchingTracks.length > 0) {
        const newPlaylist: MusicPlaylist = {
          id: `emotion-${emotionString}-${Date.now()}`,
          name: `${emotionString.charAt(0).toUpperCase() + emotionString.slice(1)} Playlist`,
          emotion: emotionString,
          tracks: matchingTracks
        };
        
        setPlaylist(newPlaylist);
        setEmotion(emotionString);
        
        if (newPlaylist.tracks.length > 0) {
          setCurrentTrack(newPlaylist.tracks[0]);
          if (audioElement) {
            playTrack(newPlaylist.tracks[0]);
          }
        }
        
        return newPlaylist;
      }
      
      toast({
        title: "Aucune musique trouvée",
        description: `Aucune playlist trouvée pour l'émotion: ${emotionString}`,
        variant: "destructive"
      });
      
      return null;
    } catch (error) {
      console.error('Error loading playlist for emotion:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la playlist pour cette émotion",
        variant: "destructive"
      });
      return null;
    }
  }, [audioElement, playTrack, toast]);

  // Also provide this function as an alias for component compatibility
  const getRecommendationByEmotion = loadPlaylistForEmotion;

  // Toggle drawer
  const toggleDrawer = useCallback(() => {
    setOpenDrawer(!openDrawer);
  }, [openDrawer]);

  // The context value
  const contextValue: MusicContextType = {
    isPlaying,
    currentTrack,
    isInitialized,
    volume,
    muted,
    isMuted: muted, // Alias for compatibility
    currentTime,
    duration,
    playlist,
    playlists,
    emotion,
    openDrawer,
    isRepeating,
    isShuffled,
    queue,
    
    togglePlay,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    prevTrack: previousTrack, // Alias for compatibility
    seekTo,
    setVolume,
    setMute,
    toggleMute,
    setEmotion,
    setPlaylist: setPlaylistHandler,
    setCurrentTrack,
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    setOpenDrawer,
    toggleDrawer,
    toggleRepeat,
    toggleShuffle,
    addToQueue,
    clearQueue
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;

/**
 * @deprecated Use useMusic from '@/hooks/useMusic' instead. Kept for compatibility.
 */
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
