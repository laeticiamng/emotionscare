
import React, { useState, useEffect, useContext, createContext } from 'react';
import { MusicContextType, MusicTrack, MusicPlaylist, EmotionMusicParams } from '@/types/music';
import { mockTracks, mockPlaylists } from '@/data/music';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [playlists, setPlaylists] = useState<MusicPlaylist[]>(mockPlaylists);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [queue, setQueue] = useState<MusicTrack[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize audio context and setup
    setIsInitialized(true);
    return () => {
      // Cleanup
    };
  }, []);

  const playTrack = (track: MusicTrack) => {
    console.log('Playing track:', track.title);
    setCurrentTrack(track);
    setIsPlaying(true);
    setDuration(track.duration || 0);
    setCurrentTime(0);

    // In a real app, we would play the audio from track.url or track.audioUrl
    const audioUrl = track.url || track.audioUrl || track.trackUrl;
    if (!audioUrl) {
      setError(new Error('No audio URL provided for this track'));
    }
  };

  const playPlaylist = (newPlaylist: MusicPlaylist) => {
    if (newPlaylist.tracks.length === 0) {
      setError(new Error('This playlist is empty'));
      return;
    }

    setPlaylist(newPlaylist);
    playTrack(newPlaylist.tracks[0]);
  };

  const loadPlaylist = (newPlaylist: MusicPlaylist) => {
    setPlaylist(newPlaylist);
  };
  
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resumeTrack = () => {
    setIsPlaying(true);
  };

  const seekTo = (time: number) => {
    setCurrentTime(time);
  };

  const nextTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === playlist.tracks.length - 1) {
      // We're at the last track, go back to the first one
      playTrack(playlist.tracks[0]);
    } else {
      playTrack(playlist.tracks[currentIndex + 1]);
    }
  };

  const previousTrack = () => {
    if (!playlist || !currentTrack) return;
    
    const currentIndex = playlist.tracks.findIndex(t => t.id === currentTrack.id);
    if (currentIndex === -1 || currentIndex === 0) {
      // We're at the first track, go to the last one
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    } else {
      playTrack(playlist.tracks[currentIndex - 1]);
    }
  };

  const toggleMute = () => {
    setMuted(prev => !prev);
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (newVolume > 0) {
      setMuted(false);
    }
  };

  const loadPlaylistForEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist | null> => {
    try {
      // In a real app, we would make an API call here
      // For now, just filter from mock data
      const { emotion } = params;
      const matchingPlaylist = mockPlaylists.find(playlist => 
        playlist.mood?.toLowerCase() === emotion.toLowerCase()
      );
      
      if (matchingPlaylist) {
        setPlaylist(matchingPlaylist);
        setCurrentEmotion(emotion);
        return matchingPlaylist;
      }
      
      // If no matching playlist found, return the first one
      setPlaylist(mockPlaylists[0]);
      return mockPlaylists[0];
    } catch (err) {
      console.error('Error loading playlist for emotion:', err);
      setError(err instanceof Error ? err : new Error('Error loading playlist'));
      return null;
    }
  };

  const recommendByEmotion = (emotion: string): MusicPlaylist => {
    const matchingPlaylist = mockPlaylists.find(playlist => 
      playlist.mood?.toLowerCase() === emotion.toLowerCase()
    );
    
    return matchingPlaylist || mockPlaylists[0];
  };

  const getRecommendedPlaylists = (limit = 3): MusicPlaylist[] => {
    return mockPlaylists.slice(0, limit);
  };

  const addToQueue = (track: MusicTrack) => {
    setQueue(prevQueue => [...prevQueue, track]);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const playSimilar = (mood?: string) => {
    const targetMood = mood || currentTrack?.mood || 'calm';
    const similarTracks = mockTracks.filter(track => track.mood === targetMood);
    
    if (similarTracks.length > 0) {
      const randomTrack = similarTracks[Math.floor(Math.random() * similarTracks.length)];
      playTrack(randomTrack);
    }
  };

  const shufflePlaylist = () => {
    setIsShuffled(prev => !prev);
  };

  const toggleRepeat = () => {
    setIsRepeating(prev => !prev);
  };

  const value: MusicContextType = {
    currentTrack,
    isPlaying,
    volume,
    duration,
    currentTime,
    playlist,
    playlists,
    openDrawer,
    setOpenDrawer,
    playTrack,
    playPlaylist,
    playSimilar,
    playNext: nextTrack,
    playPrevious: previousTrack,
    togglePlay,
    setVolume,
    seekTo,
    recommendByEmotion,
    getRecommendedPlaylists,
    pauseTrack,
    resumeTrack,
    nextTrack,
    previousTrack,
    toggleMute,
    loadPlaylistForEmotion,
    currentEmotion,
    muted,
    queue,
    addToQueue,
    clearQueue,
    loadPlaylist,
    shufflePlaylist,
    isShuffled,
    isRepeating,
    toggleShuffle: shufflePlaylist,
    toggleRepeat,
    error,
    isInitialized
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
