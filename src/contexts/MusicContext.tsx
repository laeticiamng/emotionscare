import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist } from '@/types/music';
import { mockTracks, mockPlaylists } from '@/data/mockMusic';
import { useToast } from '@/hooks/use-toast';

const MusicContext = createContext<MusicContextType>({
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
  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [volume, setVolume] = useState(0.7); // 0 to 1
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  
  // Drawer state
  const [openDrawer, setOpenDrawer] = useState(false);
  
  // Queue management
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  
  // Playlists management
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(mockPlaylists);
  
  // Emotional context
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  
  // Audio element reference
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  
  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;
      
      // Set up event listeners
      audioRef.current.onended = handleTrackEnd;
      audioRef.current.ontimeupdate = updateTime;
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);
  
  // Update time as track plays
  const updateTime = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // Handle track end
  const handleTrackEnd = () => {
    if (isRepeating && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    } else {
      nextTrack();
    }
  };
  
  // Play a specific track
  const playTrack = useCallback((track: MusicTrack) => {
    if (audioRef.current) {
      audioRef.current.src = track.url || track.audioUrl || '';
      audioRef.current.load();
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        setCurrentTrack(track);
      }).catch(err => {
        console.error('Error playing track:', err);
        toast({
          title: 'Erreur de lecture',
          description: "Impossible de lire cette piste. Veuillez réessayer.",
          variant: 'destructive'
        });
      });
    }
  }, [toast]);
  
  // Pause current track
  const pauseTrack = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isPlaying]);
  
  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      if (audioRef.current) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
      }
    } else if (playlists.length > 0 && playlists[0].tracks && playlists[0].tracks.length > 0) {
      // Play first track of first playlist if nothing is playing
      playTrack(playlists[0].tracks[0]);
    }
  }, [isPlaying, currentTrack, pauseTrack, playTrack, playlists]);
  
  // Go to next track
  const nextTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) {
      return;
    }
    
    const currentTrackIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    let nextIndex;
    
    if (isShuffled) {
      // Random track excluding current
      const availableTracks = currentPlaylist.tracks.filter(t => t.id !== currentTrack.id);
      if (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        playTrack(availableTracks[randomIndex]);
      }
    } else {
      // Sequential next track
      nextIndex = (currentTrackIndex + 1) % currentPlaylist.tracks.length;
      playTrack(currentPlaylist.tracks[nextIndex]);
    }
  }, [currentTrack, currentPlaylist, isShuffled, playTrack]);
  
  // Go to previous track
  const previousTrack = useCallback(() => {
    if (!currentTrack || !currentPlaylist) {
      return;
    }
    
    const currentTrackIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack.id);
    let prevIndex;
    
    // Go to previous track or to the end if at beginning
    prevIndex = (currentTrackIndex - 1 + currentPlaylist.tracks.length) % currentPlaylist.tracks.length;
    playTrack(currentPlaylist.tracks[prevIndex]);
  }, [currentTrack, currentPlaylist, playTrack]);
  
  // Seek to a specific position
  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    if (audioRef.current) {
      const newMuted = !isMuted;
      audioRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  }, [isMuted]);
  
  // Toggle shuffle
  const toggleShuffle = useCallback(() => {
    setIsShuffled(prev => !prev);
  }, []);
  
  // Toggle repeat
  const toggleRepeat = useCallback(() => {
    setIsRepeating(prev => !prev);
  }, []);
  
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
  
  // Expose context values
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

export const useMusic = () => useContext(MusicContext);

// Remove the duplicate mock data declarations here - we already import them from @/data/mockMusic
