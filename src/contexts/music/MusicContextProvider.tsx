
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist } from '@/types/music';
import { mockPlaylists } from '@/data/mockMusic';
import { useToast } from '@/hooks/use-toast';
import { useAudioHandlers } from './useAudioHandlers';

// Create the context with default values
export const MusicContext = createContext<MusicContextType>({
  isPlaying: false,
  currentTrack: null,
  playlists: [],
  currentPlaylist: null,
  togglePlay: () => {},
  playTrack: () => {},
  pauseTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  volume: 0.7,
  setVolume: () => {},
  toggleMute: () => {},
  isMuted: false,
  duration: 0,
  currentTime: 0,
  seekTo: () => {},
  queue: [],
  addToQueue: () => {},
  clearQueue: () => {},
  toggleShuffle: () => {},
  toggleRepeat: () => {},
  isShuffled: false,
  isRepeating: false,
  openDrawer: false,
  setOpenDrawer: () => {},
  setEmotion: () => {},
  loadPlaylistForEmotion: () => Promise.resolve(null),
  currentEmotion: null,
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  
  // State variables
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(mockPlaylists);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  // Use custom hook for audio handling
  const { 
    audioRef,
    isPlaying, 
    currentTrack, 
    volume,
    isMuted,
    currentTime,
    duration,
    playTrack,
    pauseTrack,
    seekTo,
    setVolume,
    toggleMute
  } = useAudioHandlers({ toast });

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          // setIsPlaying is handled in the hook
        }).catch(console.error);
      }
    } else if (playlists.length > 0 && playlists[0].tracks && playlists[0].tracks.length > 0) {
      // Play first track of first playlist if nothing is playing
      playTrack(playlists[0].tracks[0]);
    }
  }, [isPlaying, currentTrack, pauseTrack, playTrack, playlists, audioRef]);
  
  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);
  
  // Toggle repeat
  const toggleRepeat = useCallback(() => {
    setIsRepeating(prev => !prev);
  }, []);
  
  // Go to next track
  const nextTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) {
      return;
    }
    
    const currentTrackIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    
    if (isShuffled) {
      // Random track excluding current
      const availableTracks = currentPlaylist.tracks.filter(t => t.id !== currentTrack.id);
      if (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        playTrack(availableTracks[randomIndex]);
      }
    } else {
      // Sequential next track
      const nextIndex = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
      playTrack(currentPlaylist.tracks[nextIndex]);
    }
  }, [currentTrack, currentPlaylist, isShuffled, playTrack]);
  
  // Go to previous track
  const previousTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) {
      return;
    }
    
    const currentTrackIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    
    // Go to previous track or to the end if at beginning
    const prevIndex = (currentTrackIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[prevIndex]);
  }, [currentTrack, currentPlaylist, playTrack]);
  
  // Add track to queue
  const addToQueue = useCallback((track: MusicTrack) => {
    setQueue(prev => [...prev, track]);
  }, []);
  
  // Clear queue
  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);
  
  // Set current emotion
  const setEmotion = useCallback((emotion: string) => {
    setCurrentEmotion(emotion);
  }, []);
  
  // Load playlist for emotion
  const loadPlaylistForEmotion = useCallback(async (emotion: string): Promise<MusicPlaylist | null> => {
    try {
      // In a real app, this would call an API
      const matchingPlaylists = playlists.filter(
        p => p.mood?.toLowerCase() === emotion.toLowerCase() || 
             p.category?.toLowerCase() === emotion.toLowerCase()
      );
      
      if (matchingPlaylists.length > 0) {
        const playlist = matchingPlaylists[0];
        setCurrentPlaylist(playlist);
        
        if (playlist.tracks && playlist.tracks.length > 0) {
          // Don't automatically play, just set current playlist
          // playTrack(playlist.tracks[0]);
        }
        
        return playlist;
      }
      
      toast({
        title: "Playlist non trouvée",
        description: `Aucune playlist trouvée pour l'émotion ${emotion}`,
        variant: "destructive"
      });
      
      return null;
    } catch (error) {
      console.error('Error loading emotion playlist:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la playlist adaptée à cette émotion",
        variant: "destructive"
      });
      return null;
    }
  }, [playlists, toast]);
  
  // Configure track end event handling
  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleTrackEnd = () => {
      if (isRepeating && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(console.error);
      } else {
        nextTrack();
      }
    };
    
    audioRef.current.onended = handleTrackEnd;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.onended = null;
      }
    };
  }, [audioRef, isRepeating, nextTrack]);
  
  // Context value object
  const contextValue: MusicContextType = {
    isPlaying,
    currentTrack,
    playlists,
    currentPlaylist,
    togglePlay,
    playTrack,
    pauseTrack,
    nextTrack,
    previousTrack,
    volume,
    setVolume,
    toggleMute,
    isMuted,
    duration,
    currentTime,
    seekTo,
    queue,
    addToQueue,
    clearQueue,
    toggleShuffle,
    toggleRepeat,
    isShuffled,
    isRepeating,
    openDrawer,
    setOpenDrawer,
    setEmotion,
    loadPlaylistForEmotion,
    currentEmotion
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Custom hook to use the music context
export const useMusic = () => useContext(MusicContext);
