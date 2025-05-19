
import React, { createContext, useState, useContext, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import { fetchPlaylists, fetchTracks } from '@/services/musicService';

export const MusicContext = createContext<MusicContextType>({
  currentTrack: null,
  currentPlaylist: null,
  playlists: [],
  isPlaying: false,
  volume: 0.5,
  duration: 0,
  muted: false,
  currentTime: 0,
  playTrack: () => {},
  pauseTrack: () => {},
  resumeTrack: () => {},
  nextTrack: () => {},
  previousTrack: () => {},
  togglePlay: () => {},
  setVolume: () => {},
  seekTo: () => {},
  toggleMute: () => {},
  addToPlaylist: () => {},
  removeFromPlaylist: () => {},
  createPlaylist: () => {},
  playEmotion: () => {},
});

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for the current track and playlist
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [currentPlaylist, setCurrentPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>([]);

  // Player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // Audio element reference
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  // Fetch playlists on component mount
  useEffect(() => {
    const loadPlaylists = async () => {
      try {
        const fetchedPlaylists = await fetchPlaylists();
        if (fetchedPlaylists) {
          setPlaylists(fetchedPlaylists);
        }
      } catch (err) {
        console.error('Error loading playlists:', err);
        setError('Failed to load playlists');
      }
    };

    loadPlaylists();
  }, []);

  // Initialize audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.volume = volume;

      // Event listeners
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleTrackEnded);
      audioRef.current.addEventListener('loadedmetadata', handleMetadataLoaded);
      audioRef.current.addEventListener('error', handleError);

      setIsInitialized(true);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleTrackEnded);
        audioRef.current.removeEventListener('loadedmetadata', handleMetadataLoaded);
        audioRef.current.removeEventListener('error', handleError);
      }
    };
  }, []);

  // Update audio element when volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume;
    }
  }, [volume, muted]);

  // Event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleTrackEnded = () => {
    if (isRepeating) {
      // Replay the current track
      seekTo(0);
      audioRef.current?.play();
    } else {
      nextTrack();
    }
  };

  const handleMetadataLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleError = (e: Event) => {
    console.error('Audio error:', e);
    setError('Error playing audio');
  };

  // Player control functions
  const playTrack = (track: MusicTrack) => {
    try {
      if (!track.url && !track.audioUrl) {
        setError('Track URL is missing');
        return;
      }

      // Update the current track
      setCurrentTrack(track);

      // Load and play the audio
      if (audioRef.current) {
        audioRef.current.src = track.url || track.audioUrl || '';
        audioRef.current.load();
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setError(null);
          })
          .catch(err => {
            console.error('Play error:', err);
            setError('Failed to play track');
            setIsPlaying(false);
          });
      }
    } catch (err) {
      console.error('Play track error:', err);
      setError('Error playing track');
    }
  };

  const pauseTrack = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeTrack = () => {
    if (audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error('Resume error:', err);
          setError('Failed to resume track');
        });
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      resumeTrack();
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const nextTrack = () => {
    if (!currentPlaylist || !currentTrack) return;

    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === currentPlaylist.tracks.length - 1) {
      // No next track or end of playlist
      if (isRepeating) {
        // Play first track if repeating
        playTrack(currentPlaylist.tracks[0]);
      }
    } else {
      // Play next track
      playTrack(currentPlaylist.tracks[currentIndex + 1]);
    }
  };

  const previousTrack = () => {
    if (!currentPlaylist || !currentTrack) return;

    const currentIndex = currentPlaylist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex <= 0) {
      // No previous track or beginning of playlist
      seekTo(0); // Go to start of current track
    } else {
      // Play previous track
      playTrack(currentPlaylist.tracks[currentIndex - 1]);
    }
  };

  // Playlist management
  const playPlaylist = (playlist: MusicPlaylist) => {
    if (!playlist || !playlist.tracks || playlist.tracks.length === 0) {
      setError('Playlist is empty');
      return;
    }

    setCurrentPlaylist(playlist);
    playTrack(playlist.tracks[0]);
  };

  const addToPlaylist = (trackId: string, playlistId: string) => {
    // Implementation would depend on your backend
    console.log(`Add track ${trackId} to playlist ${playlistId}`);
  };

  const removeFromPlaylist = (trackId: string, playlistId: string) => {
    // Implementation would depend on your backend
    console.log(`Remove track ${trackId} from playlist ${playlistId}`);
  };

  const createPlaylist = (name: string, tracks: MusicTrack[] = []) => {
    const newPlaylist: MusicPlaylist = {
      id: `playlist-${Date.now()}`,
      title: name,
      tracks,
    };

    setPlaylists(prev => [...prev, newPlaylist]);
    return newPlaylist;
  };

  // Emotion-based playback
  const playEmotion = (emotion: string) => {
    console.log(`Playing tracks for emotion: ${emotion}`);
    // Implementation would fetch tracks based on emotion
  };

  // Additional methods for compatibility
  const loadPlaylistForEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    try {
      const emotion = typeof params === 'string' ? params : params.emotion;
      
      // This would typically call your backend API
      // Here's a mock implementation:
      const tracks = await fetchTracks({ emotion });
      if (tracks && tracks.length > 0) {
        const playlist: MusicPlaylist = {
          id: `emotion-${emotion}-${Date.now()}`,
          title: `${emotion.charAt(0).toUpperCase() + emotion.slice(1)} Playlist`,
          tracks,
          emotion
        };
        
        setCurrentPlaylist(playlist);
        return playlist;
      }
      
      return null;
    } catch (error) {
      console.error('Error loading playlist for emotion:', error);
      setError('Failed to load emotion playlist');
      return null;
    }
  };

  const getRecommendationByEmotion = async (params: EmotionMusicParams | string): Promise<MusicPlaylist | null> => {
    return loadPlaylistForEmotion(params);
  };

  const toggleDrawer = () => {
    setOpenDrawer(prev => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeating(prev => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffling(prev => !prev);
  };

  const setPlaylist = (playlist: MusicPlaylist) => {
    setCurrentPlaylist(playlist);
  };

  // For backward compatibility
  const play = (track?: MusicTrack, playlist?: MusicPlaylist) => {
    if (playlist) {
      setCurrentPlaylist(playlist);
    }
    if (track) {
      playTrack(track);
    } else if (currentTrack) {
      resumeTrack();
    }
  };

  const pause = pauseTrack;
  const resume = resumeTrack;
  const next = nextTrack;
  const previous = previousTrack;
  const prevTrack = previousTrack;
  const setEmotion = (emotion: string) => playEmotion(emotion);

  // Context value
  const contextValue: MusicContextType = {
    currentTrack,
    currentPlaylist,
    playlists,
    isPlaying,
    volume,
    muted,
    currentTime,
    duration,
    playTrack,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    togglePlay,
    setVolume,
    seekTo,
    toggleMute,
    addToPlaylist,
    removeFromPlaylist,
    createPlaylist,
    playEmotion,
    error,
    isInitialized,
    openDrawer,
    setOpenDrawer,
    toggleDrawer,
    playlist: currentPlaylist,
    setPlaylist,
    play,
    pause,
    resume,
    next,
    previous,
    prevTrack,
    setCurrentTrack: (track: MusicTrack) => setCurrentTrack(track),
    playPlaylist,
    setEmotion,
    loadPlaylistForEmotion,
    getRecommendationByEmotion,
    toggleRepeat,
    toggleShuffle,
    isRepeating,
    isShuffling,
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

export default MusicContext;
