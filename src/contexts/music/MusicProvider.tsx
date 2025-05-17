
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MusicTrack, MusicPlaylist, MusicContextType, EmotionMusicParams } from '@/types/music';
import defaultPlaylists from '@/data/musicPlaylists';

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [playlist, setPlaylist] = useState<MusicPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Function to get music recommendations based on emotion
  const getMusicByEmotion = async (params: EmotionMusicParams): Promise<MusicPlaylist> => {
    try {
      // This is a placeholder for actual API call to get music recommendations
      console.log("Getting music recommendations for:", params);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Return mock data based on emotion
      const emotion = params.emotion || 'neutral';
      
      // Find matching playlist or return default
      const matchingPlaylist = defaultPlaylists.find(p => 
        p.emotion.toLowerCase() === emotion.toLowerCase()
      ) || defaultPlaylists[0];
      
      return { ...matchingPlaylist };
    } catch (error) {
      console.error("Error getting music recommendations:", error);
      return defaultPlaylists[0]; // Return default playlist on error
    }
  };

  // Play a specific track
  const playTrack = (track: MusicTrack) => {
    if (!audioElement) return;

    // Set the current track
    setCurrentTrack(track);
    
    // Update the audio source
    audioElement.src = track.audioUrl;
    audioElement.load();
    
    // Play the track
    audioElement.play().catch(error => {
      console.error("Error playing track:", error);
    });
    
    setIsPlaying(true);
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioElement || !currentTrack) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play().catch(error => {
        console.error("Error playing track:", error);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  // Skip to the next track in playlist
  const nextTrack = () => {
    if (!playlist || !currentTrack) return;

    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex < playlist.tracks.length - 1) {
      playTrack(playlist.tracks[currentIndex + 1]);
    } else {
      // Loop back to the first track
      playTrack(playlist.tracks[0]);
    }
  };

  // Skip to the previous track in playlist
  const previousTrack = () => {
    if (!playlist || !currentTrack) return;

    const currentIndex = playlist.tracks.findIndex(track => track.id === currentTrack.id);
    if (currentIndex > 0) {
      playTrack(playlist.tracks[currentIndex - 1]);
    } else {
      // Loop to the last track
      playTrack(playlist.tracks[playlist.tracks.length - 1]);
    }
  };

  // Set the volume
  const setVolumeLevel = (level: number) => {
    if (!audioElement) return;
    
    // Ensure volume is between 0 and 1
    const newVolume = Math.max(0, Math.min(1, level));
    audioElement.volume = newVolume;
    setVolume(newVolume);
  };

  // Set specific time in the track
  const seekTo = (time: number) => {
    if (!audioElement) return;
    
    audioElement.currentTime = time;
    setCurrentTime(time);
  };

  // Set up event listeners for the audio element
  useEffect(() => {
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audioElement.duration);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('durationchange', handleDurationChange);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('durationchange', handleDurationChange);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [audioElement, nextTrack]);

  // Load and play a playlist
  const loadPlaylist = (newPlaylist: MusicPlaylist, autoplay = true) => {
    setPlaylist(newPlaylist);
    
    if (newPlaylist.tracks.length > 0 && autoplay) {
      playTrack(newPlaylist.tracks[0]);
    }
  };

  // Get a specific playlist by ID
  const getPlaylistById = (id: string): MusicPlaylist | undefined => {
    return defaultPlaylists.find(playlist => playlist.id === id);
  };

  // Open/close music drawer
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Stop the current track
  const stopTrack = () => {
    if (!audioElement) return;
    
    audioElement.pause();
    audioElement.currentTime = 0;
    setIsPlaying(false);
  };

  const playEmotionBasedMusic = async (params: EmotionMusicParams): Promise<MusicPlaylist> => {
    const playlist = await getMusicByEmotion(params);
    loadPlaylist(playlist);
    return playlist;
  };

  // Context value
  const contextValue: MusicContextType = {
    currentTrack,
    playlist,
    isPlaying,
    volume,
    duration,
    currentTime,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    setVolume: setVolumeLevel,
    seekTo,
    loadPlaylist,
    getPlaylistById,
    isDrawerOpen,
    toggleDrawer,
    stopTrack,
    getMusicByEmotion,
    playEmotionBasedMusic
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
